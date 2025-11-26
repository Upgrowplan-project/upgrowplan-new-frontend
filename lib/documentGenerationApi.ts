/**
 * API Client для Document Generation Service
 *
 * Интеграция с Document Generation Service (localhost:8001)
 * для генерации бизнес-планов
 */

const DOC_GEN_API_BASE_URL = process.env.NEXT_PUBLIC_DOC_GEN_API_URL || 'http://localhost:8001';

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
  const response = await fetch(`${DOC_GEN_API_BASE_URL}/api/v1/health`);

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
  requestData: any
): Promise<GenerationResult> {
  console.log('🔍 Sending request to API:', JSON.stringify(requestData, null, 2));

  const response = await fetch(`${DOC_GEN_API_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    try {
      const error = await response.json();
      console.error('❌ API Error Response:', error);
      // FastAPI возвращает валидационные ошибки в формате {detail: [{loc, msg, type}]}
      if (error.detail && Array.isArray(error.detail)) {
        const messages = error.detail.map((e: any) =>
          `${e.loc.join('.')}: ${e.msg}`
        ).join('; ');
        throw new Error(`Validation error: ${messages}`);
      }
      throw new Error(error.detail || error.message || `Generation failed: ${response.status}`);
    } catch (parseError) {
      if (parseError instanceof Error && parseError.message.includes('Validation error')) {
        throw parseError;
      }
      throw new Error(`Generation failed: ${response.status} ${response.statusText}`);
    }
  }

  return response.json();
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
    `${DOC_GEN_API_BASE_URL}/api/status/${executionId}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Execution ${executionId} not found`);
    }
    throw new Error(`Status check failed: ${response.status}`);
  }

  return response.json();
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
 * Получить метрики сервиса
 */
export async function getMetrics() {
  const response = await fetch(`${DOC_GEN_API_BASE_URL}/api/v1/metrics`);

  if (!response.ok) {
    throw new Error(`Metrics fetch failed: ${response.status}`);
  }

  return response.json();
}
