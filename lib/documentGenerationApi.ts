/**
 * API Client для PlanMaster Service (генератор бизнес-плана)
 *
 * Контракт planmaster-service (localhost:8004):
 *   POST /planMaster/from-brief   { answers, system_locale } -> { plan_id, status, progress }
 *   GET  /planMaster/{plan_id}                               -> { status, progress, current_stage }
 *   GET  /planMaster/{plan_id}/download                      -> DOCX
 * Экспортируемые сигнатуры сохранены (execution_id == plan_id) — страница чата не меняется.
 */

import { fetchWithDownDetect } from "@/lib/backendStatus";

const DOC_GEN_API_BASE_URL = process.env.NEXT_PUBLIC_DOC_GEN_API_URL || 'http://localhost:8004';

export interface GenerationStatus {
  execution_id: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  progress_percent?: number;
  current_step?: string;
  started_at?: string;
  completed_at?: string;
  error?: string;
}

export interface GenerationResult {
  status: string;
  execution_id: string;
  document_id: string;
  files: {
    markdown: string;
    docx: string;
  };
  metadata: {
    sections_count: number;
    verified_facts_used: number;
    generation_time_seconds: number;
    financial_metrics?: {
      npv?: number;
      irr?: number;
      payback_period_months?: number;
    };
  };
}

export interface HealthStatus {
  status: 'healthy' | 'degraded';
  timestamp: string;
  version: string;
  services: {
    redis: string;
    openai: string;
  };
}

/**
 * Проверить здоровье Document Generation Service
 */
export async function checkHealth(): Promise<HealthStatus> {
  const response = await fetchWithDownDetect(`${DOC_GEN_API_BASE_URL}/api/v1/health`);

  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Запустить генерацию бизнес-плана
 *
 * @param requestData - Полные данные для генерации бизнес-плана
 */
export async function triggerGeneration(
  payload: any
): Promise<GenerationResult> {
  // payload ожидается как { answers, system_locale } — сырой онбординг-brief
  const response = await fetchWithDownDetect(`${DOC_GEN_API_BASE_URL}/planMaster/from-brief`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Generation failed: ${response.status} ${response.statusText}`);
  }

  const j = await response.json();
  // Маппинг plan_id -> execution_id, чтобы страница/polling работали без изменений
  return {
    status: j.status,
    execution_id: j.plan_id,
    document_id: j.plan_id,
    files: { markdown: '', docx: '' },
    metadata: undefined as any,
  } as GenerationResult;
}

/**
 * Получить статус генерации
 *
 * @param executionId - ID сессии генерации
 */
export async function getGenerationStatus(
  executionId: string
): Promise<GenerationStatus> {
  const response = await fetch(
    `${DOC_GEN_API_BASE_URL}/planMaster/${executionId}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Execution ${executionId} not found`);
    }
    throw new Error(`Status check failed: ${response.status}`);
  }

  const j = await response.json();
  const statusMap: Record<string, GenerationStatus['status']> = {
    pending: 'queued', in_progress: 'in_progress',
    completed: 'completed', failed: 'failed',
  };
  return {
    execution_id: executionId,
    status: statusMap[j.status] || j.status,
    progress_percent: j.progress,
    current_step: j.current_stage,
    error: j.error,
  };
}

/**
 * Polling статуса генерации с callback'ом для обновлений
 *
 * @param executionId - ID сессии
 * @param onUpdate - Callback при каждом обновлении статуса
 * @param intervalMs - Интервал проверки (по умолчанию 2000мс)
 */
export async function pollGenerationStatus(
  executionId: string,
  onUpdate: (status: GenerationStatus) => void,
  intervalMs: number = 2000
): Promise<GenerationStatus> {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const status = await getGenerationStatus(executionId);

        // Вызываем callback с текущим статусом
        onUpdate(status);

        // Если генерация завершена или упала - останавливаем polling
        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(interval);
          resolve(status);
        }
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, intervalMs);
  });
}

/**
 * Скачать сгенерированный документ
 *
 * @param filePath - Путь к файлу (из GenerationResult.files)
 * @param filename - Имя файла для сохранения
 */
export async function downloadDocument(
  filePath: string,
  filename: string
): Promise<void> {
  // Предполагаем, что файлы доступны по HTTP
  // В production нужно будет добавить proper file serving
  const fileUrl = `${DOC_GEN_API_BASE_URL}/output/${filePath.split('/').pop()}`;

  const response = await fetch(fileUrl);

  if (!response.ok) {
    throw new Error(`Download failed: ${response.status}`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Драйверы плана для верификации пользователем (масштаб, клиентов/день, чек, аренда, ФОТ…)
 */
export async function getPlanDrivers(planId: string): Promise<any> {
  const r = await fetchWithDownDetect(`${DOC_GEN_API_BASE_URL}/planMaster/${planId}/drivers`);
  if (!r.ok) throw new Error(`Drivers fetch failed: ${r.status}`);
  return r.json(); // { plan_id, drivers: [...], currency, computable }
}

/**
 * Отправить подтверждённые/скорректированные драйверы → пересчёт + перегенерация документа
 */
export async function verifyPlanDrivers(
  planId: string,
  overrides: Record<string, number>
): Promise<any> {
  const r = await fetchWithDownDetect(`${DOC_GEN_API_BASE_URL}/planMaster/${planId}/verify-drivers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ overrides }),
  });
  if (!r.ok) throw new Error(`Verify failed: ${r.status}`);
  return r.json(); // PlanMasterResponse { plan_id, status, financials, docx_path }
}

/**
 * Получить метрики сервиса
 */
export async function getMetrics() {
  const response = await fetchWithDownDetect(`${DOC_GEN_API_BASE_URL}/api/v1/metrics`);

  if (!response.ok) {
    throw new Error(`Metrics fetch failed: ${response.status}`);
  }

  return response.json();
}
