"use client";

import { useState, useEffect, useRef, ChangeEvent, useCallback, useReducer } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Spinner,
  ProgressBar,
  Alert,
} from "react-bootstrap";
import {
  FiUpload,
  FiSend,
  FiX,
  FiCheckCircle,
  FiDownload,
  FiMessageCircle,
  FiEdit2,
  FiFileText,
} from "react-icons/fi";
import Header from "../../../components/Header";
import Grade from "../../../components/Grade";
import Tips from "../../../components/Tips";
import styles from "./plan.module.css";
import {
  triggerGeneration,
  pollGenerationStatus,
  getGenerationStatus,
  downloadDocument,
  getPlanDrivers,
  verifyPlanDrivers,
  GenerationStatus,
  GenerationResult,
} from "../../../lib/documentGenerationApi";

interface ChatMessage {
  type: "user" | "system" | "question" | "greeting";
  text: string;
  options?: string[];
  files?: string[];
  multiple?: boolean;
  questionId?: string;
  messageId?: string;
}

const ALLOWED_FILE_TYPES = [
  "doc",
  "docx",
  "xls",
  "xlsx",
  "txt",
  "pdf",
  "png",
  "jpg",
  "jpeg",
];
const MAX_FILES = 5;

// Уровни качества данных для KPI-панели — полоска из 5 блоков + текстовый уровень.
const QUALITY_LEVELS: Record<string, { bars: number; color: string; label: string }> = {
  verified:        { bars: 5, color: "#16a34a", label: "Проверено" },
  reference:       { bars: 4, color: "#0284c7", label: "Норматив"  },
  benchmark_range: { bars: 4, color: "#2563eb", label: "Рыночный"  },
  derived:         { bars: 3, color: "#d97706", label: "Расчётный" },
  assumption:      { bars: 2, color: "#ea580c", label: "Черновик"  },
};

function QualityBar({ sourceType, redFlag }: { sourceType: string; redFlag?: boolean }) {
  if (sourceType === "user_input") {
    return (
      <span style={{ fontSize: "0.57rem", color: "#64748b", whiteSpace: "nowrap", flexShrink: 0 }}>
        ✎ ваши данные
      </span>
    );
  }
  const lvl = QUALITY_LEVELS[sourceType] ?? QUALITY_LEVELS.assumption;
  const color  = redFlag ? "#dc2626" : lvl.color;
  const filled = redFlag ? 1        : lvl.bars;
  const label  = redFlag ? `${lvl.label} · ⚠` : lvl.label;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{
          display: "inline-block", width: 3, height: 8, borderRadius: 1,
          background: i < filled ? color : "#e2e8f0",
        }} />
      ))}
      <span style={{ fontSize: "0.57rem", color, fontWeight: 600, marginLeft: 2, whiteSpace: "nowrap" }}>
        {label}
      </span>
    </span>
  );
}

export default function PlanPage() {
  const [chatStarted, setChatStarted] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [surveyComplete, setSurveyComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState("ru");
  const [sessionId, setSessionId] = useState("");
  const [currentHint, setCurrentHint] = useState<string>("");

  // Document Generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus | null>(null);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Пауза / сохранение сессии / логи сервисов (стиль MRS)
  const [isPaused, setIsPaused] = useState(false);
  const [genLogs, setGenLogs] = useState<string[]>([]);
  const [sessionSaved, setSessionSaved] = useState(false);
  // Остановка/возобновление БЕЗ рестарта: храним plan_id и флаг активного опроса.
  const [isStopped, setIsStopped] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const pollActiveRef = useRef(false);

  // Верификация драйверов (шаг «Проверьте ключевые показатели»)
  const [drivers, setDrivers] = useState<any[]>([]);
  const [driverEdits, setDriverEdits] = useState<Record<string, string>>({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [driversCurrency, setDriversCurrency] = useState("");
  const [recomputed, setRecomputed] = useState(false);
  // computable из финмодели: true → план реально рассчитан; false → черновик (нужен ввод KPI).
  const [driversComputable, setDriversComputable] = useState<boolean | undefined>(undefined);
  // Рентабельность (расчётная маржа) — headline KPI, обновляется при пересчёте.
  const [driversProfit, setDriversProfit] = useState<any>(null);
  // Ставка аренды/м²/мес (DRA benchmark) — подсказка рядом с полем sqm.
  const [rentRateBenchmark, setRentRateBenchmark] = useState<any>(null);
  // Конкурентный средний чек (MRS) — подсказка рядом с полем avg_check.
  const [marketAvgCheck, setMarketAvgCheck] = useState<any>(null);
  // Таймер ожидания MRS — показывает прошедшее время на этапе "Исследование рынка".
  const [mrsElapsedSec, setMrsElapsedSec] = useState(0);
  const mrsStartRef = useRef<number | null>(null);
  // Форс-ре-рендер для мутируемых структур (используется в ws-хендлере question_update).
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
  // Форма оценки (Grade) — скрыта по умолчанию, открывается кнопкой «Оценить план».
  const [showGrade, setShowGrade] = useState(false);

  // Множественный выбор
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [currentMultipleQuestion, setCurrentMultipleQuestion] = useState<
    string | null
  >(null);

  // Редактирование
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const ws = useRef<WebSocket | null>(null);
  const lastQuestionId = useRef<string | null>(null);
  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const answersRef = useRef<Record<string, any>>({});
  const logsEndRef = useRef<HTMLDivElement | null>(null);   // якорь автоскролла логов
  const lastGenLogRef = useRef<string>("");                  // дедуп одинаковых событий
  const lastStageRef = useRef<string>("");                   // текущая стадия: новая строка только при смене
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
    // Auto-focus input field after bot message
    if (!surveyComplete && !isTyping && inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatMessages, isTyping, surveyComplete]);

  // Автоскролл терминала логов к последнему событию
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [genLogs]);

  // Таймер ожидания MRS: запускается когда current_step == market_research, тикает каждую секунду.
  useEffect(() => {
    const isMrs = generationStatus?.current_step === "market_research";
    if (isMrs) {
      if (!mrsStartRef.current) mrsStartRef.current = Date.now();
      const t = setInterval(() => {
        setMrsElapsedSec(Math.floor((Date.now() - mrsStartRef.current!) / 1000));
      }, 1000);
      return () => clearInterval(t);
    } else {
      mrsStartRef.current = null;
      setMrsElapsedSec(0);
    }
  }, [generationStatus?.current_step]);

  // По завершении генерации — подтягиваем драйверы для верификации
  useEffect(() => {
    const pid = generationResult?.execution_id;
    if (!pid) {
      setDrivers([]);
      return;
    }
    (async () => {
      try {
        const d = await getPlanDrivers(pid);
        setDrivers(d.drivers || []);
        setDriversCurrency(d.currency || "");
        setDriversComputable(d.computable);
        setDriversProfit(d.profitability || null);
        setRentRateBenchmark(d.rent_rate_benchmark || null);
        setMarketAvgCheck(d.market_avg_check || null);
        setDriverEdits({});
        setRecomputed(false);
      } catch (e) {
        console.error("Ошибка загрузки драйверов:", e);
      }
    })();
  }, [generationResult]);

  const handleVerifyDrivers = async () => {
    const pid = generationResult?.execution_id;
    if (!pid) return;
    const overrides: Record<string, number> = {};
    Object.entries(driverEdits).forEach(([k, v]) => {
      const num = parseFloat(String(v).replace(",", "."));
      if (!isNaN(num)) overrides[k] = num;
    });
    if (Object.keys(overrides).length === 0) return;
    try {
      setIsVerifying(true);
      await verifyPlanDrivers(pid, overrides);
      const d = await getPlanDrivers(pid); // обновлённые значения
      setDrivers(d.drivers || []);
      setDriversComputable(d.computable);
      setDriversProfit(d.profitability || null);
      setRentRateBenchmark(d.rent_rate_benchmark || null);
      setMarketAvgCheck(d.market_avg_check || null);
      setDriverEdits({});
      setRecomputed(true);
    } catch (e: any) {
      console.error("Ошибка пересчёта:", e);
      setGenerationError(e?.message || "Ошибка пересчёта");
    } finally {
      setIsVerifying(false);
    }
  };

  // Метки ключевых параметров запроса (что дал пользователь). Набор ключей брифа варьируется
  // между сценариями онбординга — показываем те, что реально присутствуют.
  const SUMMARY_PARAMS: [string, string][] = [
    ["target_audience_type", "Аудитория"],
    ["average_check", "Средний чек"],
    ["expected_income", "Ожидаемый доход"],
    ["investment_needed", "Инвестиции"],
    ["investment_purpose", "Цель инвестиций"],
    ["business_stage", "Стадия"],
    ["legal_form", "Форма"],
    ["taxation_system", "Налоги"],
    ["marketing_strategy", "Маркетинг"],
    ["competitors", "Конкуренты"],
    ["key_partners", "Партнёры"],
    ["audience_pain_points", "Боли аудитории"],
  ];

  // Сводка запроса пользователя (для контента ожидания и панели KPI) из собранных ответов.
  const getRequestSummary = () => {
    const a = answersRef.current || {};
    const raw = (k: string) => {
      const v = a[k]?.answer;
      if (v == null) return "";
      const s = Array.isArray(v) ? v.flat().filter(Boolean).join(", ") : String(v).trim();
      return s === "Нет данных" ? "" : s;
    };
    const first = (...keys: string[]) => {
      for (const k of keys) { const s = raw(k); if (s) return s; }
      return "";
    };
    const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n) + "…" : s);
    return {
      idea: first("business_idea", "product_or_service", "welcome", "additional_info",
                  "market_understanding"),
      location: first("location", "city", "customer_location", "audience_geography"),
      industry: first("industry"),
      goal: first("goal_of_plan", "goal"),
      params: SUMMARY_PARAMS
        .map(([k, label]) => ({ label, value: clip(raw(k), 90) }))
        .filter((p) => p.value),
    };
  };

  // Стадии генерации для чек-листа ожидания (загораются по прогрессу planmaster).
  const GEN_STAGES = [
    { key: "brief", label: "Сбор и разбор вводных", at: 1 },
    { key: "expenses", label: "Расходы и налоги (свой поиск + судья)", at: 12 },
    { key: "market_research", label: "Исследование рынка (MRS)", at: 30 },
    { key: "docx", label: "Сборка документа", at: 70 },
  ];

  const initWebSocket = () => {
    ws.current = new WebSocket(
      process.env.NEXT_PUBLIC_ONBOARDING_WS_URL || "ws://localhost:8000/ws/survey"
    );

    ws.current.onopen = () => {
      console.log("✅ WebSocket подключён");
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleServerMessage(data);
      } catch (e) {
        console.error("Ошибка парсинга:", e);
      }
    };

    ws.current.onerror = (e) => console.error("Ошибка WebSocket:", e);
    ws.current.onclose = () => console.log("WebSocket отключён");
  };

  const handleServerMessage = (data: any) => {
    setIsTyping(false);

    switch (data.type) {
      case "greeting":
        setChatMessages((prev) => [
          ...prev,
          {
            type: "greeting",
            text: data.data.message,
            messageId: `msg_${Date.now()}`,
          },
        ]);
        break;

      case "question":
        if (data.data?.progress) {
          setProgressPercent(data.data.progress.percentage);
        }
        const isMultiple =
          data.data.multiple ||
          (data.data.id &&
            ["has_team", "sales_channels", "target_audience_type"].includes(
              data.data.id
            ));

        if (isMultiple) {
          setCurrentMultipleQuestion(data.data.id);
          setSelectedOptions([]);
        }

        // Обновляем подсказку, которая пришла с бэкенда (всегда, даже если пустая)
        setCurrentHint(data.data?.hint || "");

        setChatMessages((prev) => [
          ...prev,
          {
            type: "question",
            text: data.data.text,
            options: data.data.options,
            multiple: isMultiple,
            questionId: data.data.id,
            messageId: `msg_${Date.now()}`,
          },
        ]);
        if (data.data?.id) {
          lastQuestionId.current = data.data.id;
        }
        break;

      case "answer_accepted":
        const qid = data.data.question_id;
        const ans = data.data.answer;
        answersRef.current[qid] = {
          answer: ans,
          timestamp: new Date().toISOString(),
          files: data.data.files ?? [],
        };
        setCurrentMultipleQuestion(null);
        setSelectedOptions([]);
        forceUpdate();
        break;

      case "system_message":
      case "extraction_summary":
        setChatMessages((prev) => [
          ...prev,
          {
            type: "system",
            text: data.data.message,
            messageId: `msg_${Date.now()}`,
          },
        ]);
        break;

      case "validation_error":
      case "error":
        setChatMessages((prev) => [
          ...prev,
          {
            type: "system",
            text: data.data.message,
            messageId: `msg_${Date.now()}`,
          },
        ]);
        break;

      case "survey_complete":
        setSurveyComplete(true);
        setProgressPercent(100);
        setChatMessages((prev) => [
          ...prev,
          {
            type: "system",
            text: data.data.message,
            messageId: `msg_${Date.now()}`,
          },
        ]);
        break;
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);

    if (filesArray.length + selectedFiles.length > MAX_FILES) {
      // alert(`Можно загрузить максимум ${MAX_FILES} файлов`);
      return;
    }

    const invalidFiles = filesArray.filter(
      (f) =>
        !ALLOWED_FILE_TYPES.includes(
          f.name.split(".").pop()?.toLowerCase() ?? ""
        )
    );
    if (invalidFiles.length > 0) {
      // alert(`Недопустимый формат файла: ${invalidFiles.map((f) => f.name).join(", ")}`);
      console.warn(`Недопустимый формат файла: ${invalidFiles.map((f) => f.name).join(", ")}`);
      return;
    }

    setSelectedFiles((prev) => [...prev, ...filesArray]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const sendAnswer = async (answer: string) => {
    if (!answer.trim() && selectedFiles.length === 0) return;

    setChatMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: answer,
        files: selectedFiles.map((f) => f.name),
        messageId: `msg_${Date.now()}`,
      },
    ]);

    const filesPayload = await Promise.all(
      selectedFiles.map(async (f) => {
        const buffer = await f.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(buffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        return {
          filename: f.name,
          content: base64,
        };
      })
    );

    ws.current?.send(
      JSON.stringify({
        type: "answer",
        data: {
          question_id: lastQuestionId.current || "start",
          answer,
          files: filesPayload,
        },
      })
    );

    setIsTyping(true);
    setUserInput("");
    setSelectedFiles([]);
  };

  const handleSend = () => {
    if (!userInput.trim() && selectedFiles.length === 0) return;

    // Always send through WebSocket
    sendAnswer(userInput);
  };

  const handleUserQuestion = async (question: string) => {
    setChatMessages((prev) => [
      ...prev,
      { type: "user", text: question, messageId: `msg_${Date.now()}` },
    ]);

    setIsTyping(true);
    setUserInput("");

    try {
      const response = await fetch(
        "http://localhost:8000/api/handle_question",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        }
      );

      const result = await response.json();

      setIsTyping(false);
      setChatMessages((prev) => [
        ...prev,
        {
          type: "system",
          text:
            result.answer ||
            "Понял ваш вопрос! Давайте вернемся к основному опросу. 😊",
          messageId: `msg_${Date.now()}`,
        },
      ]);
    } catch (error) {
      setIsTyping(false);
      setChatMessages((prev) => [
        ...prev,
        {
          type: "system",
          text: "Понял ваш вопрос! Давайте вернемся к основному опросу. 😊",
          messageId: `msg_${Date.now()}`,
        },
      ]);
    }
  };

  const handleMultipleOptionToggle = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const sendMultipleOptions = () => {
    if (selectedOptions.length === 0) return;
    sendAnswer(selectedOptions.join(", "));
  };

  const handleEditMessage = (messageId: string, currentText: string) => {
    setEditingMessageId(messageId);
    setEditText(currentText);
  };

  const saveEditedMessage = () => {
    if (editText.trim()) {
      sendAnswer(editText);
    }
    setEditingMessageId(null);
    setEditText("");
  };

  const handleStartChat = () => {
    setChatStarted(true);
    setSessionId(
      `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    );
    initWebSocket();
  };

  const handleStartFromChat = () => {
    sendAnswer("Начать");
  };

  const exportData = async () => {
    try {
      const structuredData = {
        session_id: sessionId,
        timestamp: new Date().toISOString(),
        completion_percentage: progressPercent,
        answers: answersRef.current,
        context: {
          language: language,
          collection_mode: "standard",
          total_questions_answered: Object.keys(answersRef.current).length,
        },
      };

      const dataStr = JSON.stringify(structuredData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `planmaster_survey_${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();
      URL.revokeObjectURL(url);

      // alert("✅ Данные успешно скачаны!");
    } catch (error) {
      console.error("Ошибка экспорта:", error);
      // alert("❌ Ошибка экспорта данных");
    }
  };

  // --- Логи сервисов + пауза/сессия (оффлайн, бэкенд не трогаем) ---
  const SESSION_KEY = "planmaster_session_v1";

  // updateLast=true → обновляет последнюю строку на месте (не добавляет новую).
  // Используется когда стадия не меняется, только % — иначе лог заполняется дублями.
  const pushGenLog = (line: string, updateLast = false) => {
    if (line === lastGenLogRef.current) return;
    lastGenLogRef.current = line;
    setGenLogs((prev) => {
      const entry = `${new Date().toLocaleTimeString()}  ${line}`;
      if (updateLast && prev.length > 0) {
        return [...prev.slice(0, -1), entry];
      }
      return [...prev.slice(-200), entry];
    });
  };

  const saveSessionToStorage = () => {
    try {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          planId:
            generationResult?.execution_id ||
            generationStatus?.execution_id ||
            sessionId,
          answers: answersRef.current,
          savedAt: Date.now(),
        })
      );
      setSessionSaved(true);
      pushGenLog("💾 Сессия сохранена (доступна 60 минут)");
    } catch {}
  };

  // Отменяемый опрос статуса — позволяет остановить/возобновить БЕЗ рестарта генерации
  // (planmaster генерит на сервере независимо; мы лишь подключаем/отключаем опрос по plan_id).
  const pollLoop = async (planId: string, resultObj?: GenerationResult) => {
    pollActiveRef.current = true;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    try {
      while (pollActiveRef.current) {
        let status: GenerationStatus;
        try {
          status = await getGenerationStatus(planId);
        } catch {
          await sleep(2500);
          continue;
        }
        if (!pollActiveRef.current) return; // остановлено пользователем
        setGenerationStatus(status);
        const _stage = status.current_step || status.status || "";
        const _isNewStage = _stage !== lastStageRef.current;
        if (_isNewStage) lastStageRef.current = _stage;
        pushGenLog(`[${status.progress_percent ?? 0}%] ${_stage}`, !_isNewStage);
        if (status.status === "completed") {
          pollActiveRef.current = false;
          setGenerationResult(
            resultObj || ({ status: "completed", execution_id: planId, document_id: planId,
              files: { markdown: "", docx: "" }, metadata: undefined as any } as GenerationResult)
          );
          setIsGenerating(false);
          return;
        }
        if (status.status === "failed") {
          pollActiveRef.current = false;
          setGenerationError(status.error || "Генерация не удалась");
          setIsGenerating(false);
          return;
        }
        await sleep(2500);
      }
    } catch (e: any) {
      setGenerationError(e?.message || "Ошибка опроса статуса");
    }
  };

  const handlePauseGeneration = () => {
    setIsPaused(true);
    saveSessionToStorage();
    pushGenLog("⏸ Приостановлено — бэкенд продолжает работу, данные не теряются");
  };
  const handleResumeGeneration = () => {
    setIsPaused(false);
    pushGenLog("▶ Возобновление…");
  };
  // «Остановить» — отключает опрос (бэкенд продолжает генерить), показывает Продолжить/Изменить.
  const handleStopGeneration = () => {
    pollActiveRef.current = false;
    setIsStopped(true);
    saveSessionToStorage();
    pushGenLog("⏹ Остановлено — опрос отключён, бэкенд продолжает. Можно продолжить или изменить вводные.");
  };
  // «Продолжить» — заново подключает опрос к ТОМУ ЖЕ plan_id (без перезапуска генерации).
  const handleContinuePolling = () => {
    if (!currentPlanId) return;
    setIsStopped(false);
    setGenerationError(null);
    pushGenLog("▶ Продолжаем отслеживание того же плана…");
    pollLoop(currentPlanId);
  };
  // «Изменить входные данные» — вернуться к чату для правки БЕЗ рестарта текущей генерации.
  const handleEditInputs = () => {
    pollActiveRef.current = false;
    setIsStopped(false);
    setIsGenerating(false);
    setGenerationStatus(null);
    pushGenLog("✏️ Возврат к вводным — текущая генерация не перезапускается.");
  };

  const startDocumentGeneration = async () => {
    try {
      setIsGenerating(true);
      setIsPaused(false);
      setIsStopped(false);
      setGenLogs([]);
      lastGenLogRef.current = "";
      lastStageRef.current = "";
      setSessionSaved(false);
      setShowGrade(false);
      pushGenLog("🚀 Запуск генерации бизнес-плана…");
      setGenerationError(null);
      setGenerationStatus(null);
      setGenerationResult(null);

      // Собираем все данные из ответов чата
      const answers = answersRef.current;

      console.log("📋 Все собранные ответы:", answers);
      console.log("📋 Ключи вопросов:", Object.keys(answers));

      // Создаем плоский объект со всеми ответами
      const allAnswersFlat: Record<string, any> = {};
      Object.entries(answers).forEach(([questionId, data]: [string, any]) => {
        allAnswersFlat[questionId] = data.answer;
      });

      // Вспомогательная функция для нормализации массивов
      const normalizeArray = (value: any): string[] | undefined => {
        if (!value) return undefined;
        if (Array.isArray(value)) {
          return value.flat().filter(v => v && typeof v === 'string');
        }
        if (typeof value === 'string') {
          return [value];
        }
        return undefined;
      };

      // Начинаем с базовых обязательных полей
      const requestData: any = {
        goal_of_plan: "для банка (кредит)",
        location_country: "Россия",
        session_id: sessionId
      };

      // Добавляем ВСЕ поля из собранных ответов
      Object.entries(allAnswersFlat).forEach(([key, value]) => {
        if (!value || value === "Нет данных" || value === "") return;

        // Специальная обработка для конкретных полей
        if (key === 'sales_channels' || key === 'investment_purpose' || key === 'target_audience_type') {
          requestData[key] = normalizeArray(value);
        } else if (key === 'team' || key === 'team_size') {
          requestData.team_size = value ? parseInt(String(value)) : undefined;
        } else if (key === 'location' || key === 'customer_location' || key === 'city') {
          if (!requestData.location_city) {
            requestData.location_city = value;
          }
        } else if (key === 'business_stage') {
          // Маппим значения business_stage к значениям enum
          const businessStageMap: Record<string, string> = {
            'идея': 'идея (еще не запущен)',
            'идея (еще не запущен)': 'идея (еще не запущен)',
            'запуск': 'новый проект',
            'запуск (0-6 месяцев)': 'новый проект',
            'новый проект': 'новый проект',
            'стартап': 'стартап (до 2 лет)',
            'стартап (до 2 лет)': 'стартап (до 2 лет)',
            'действующий': 'действующий бизнес (2+ года)',
            'действующий бизнес': 'действующий бизнес (2+ года)',
            'действующий бизнес (2+ года)': 'действующий бизнес (2+ года)',
            'растущий': 'растущий бизнес',
            'растущий бизнес': 'растущий бизнес',
            'зрелый': 'зрелый бизнес',
            'зрелый бизнес': 'зрелый бизнес'
          };
          const normalizedValue = String(value).toLowerCase().trim();
          requestData.business_stage = businessStageMap[normalizedValue] || 'новый проект';
        } else if (key === 'legal_form') {
          // Маппим значения legal_form
          const legalFormMap: Record<string, string> = {
            'Пока не зарегистрирован': 'Еще не решили',
            'Не решили': 'Еще не решили',
            'Еще не определились': 'Еще не решили'
          };
          requestData.legal_form = legalFormMap[String(value)] || value;
        } else if (key === 'goal_of_plan') {
          // Приводим к нижнему регистру для соответствия enum
          requestData.goal_of_plan = String(value).toLowerCase();
        } else {
          // Все остальные поля добавляем напрямую
          requestData[key] = value;
        }
      });

      // Обязательные поля - если не заполнены, используем минимальные значения
      if (!requestData.full_name) {
        requestData.full_name = allAnswersFlat["company_name"] || allAnswersFlat["business_name"] || allAnswersFlat["user_name"] || "Компания";
      }
      if (!requestData.industry) {
        requestData.industry = allAnswersFlat["industry"] || "Бизнес";
      }
      if (!requestData.product_or_service) {
        // Ищем описание продукта в разных полях
        requestData.product_or_service =
          allAnswersFlat["business_description"] ||
          allAnswersFlat["product"] ||
          allAnswersFlat["audience_pain_points"] ||
          "Продукт или услуга компании";
      }

      // Удаляем undefined значения
      Object.keys(requestData).forEach(key => {
        if (requestData[key] === undefined) {
          delete requestData[key];
        }
      });

      console.log("🚀 Запуск генерации бизнес-плана...");
      console.log("   Execution ID:", sessionId);
      console.log("   Request data:", requestData);

      // Запускаем генерацию в planmaster-service: сырой онбординг-brief → провенанс-мост
      const result = await triggerGeneration({
        answers: answersRef.current,
        system_locale: "ru",
      });

      console.log("✅ Генерация запущена:", result);
      console.log("   Backend execution ID:", result.execution_id);

      // Отменяемый опрос по plan_id (позволяет Остановить/Продолжить без рестарта).
      setCurrentPlanId(result.execution_id);
      pollLoop(result.execution_id, result); // isGenerating снимется внутри при completed/failed
    } catch (error: any) {
      console.error("❌ Ошибка генерации:", error);
      setGenerationError(error.message || "Неизвестная ошибка");
      setIsGenerating(false);
    }
  };

  const handleDownloadDocument = async (format: "markdown" | "docx") => {
    if (!generationResult) return;

    try {
      if (format === "docx") {
        // Download DOCX file from backend
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DOC_GEN_API_URL || "http://localhost:8004"}/planMaster/${generationResult.execution_id}/download`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the blob
        const blob = await response.blob();

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `business_plan_${generationResult.execution_id}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log("✅ DOCX файл скачан");
      } else {
        // Markdown format - download JSON temporarily
        const dataStr = JSON.stringify(generationResult, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `business_plan_${sessionId}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log("✅ JSON файл скачан (Markdown в разработке)");
      }
    } catch (error) {
      console.error("❌ Ошибка скачивания:", error);
      // alert(`❌ Ошибка скачивания ${format.toUpperCase()}`);
    }
  };

  // [TEST MODE] Load test data from JSON file
  const loadTestData = () => {
    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const jsonData = JSON.parse(text);

        // Load data into answersRef. Экспорт онбординга — это { answers: {...}, ... },
        // а генерация ждёт САМ словарь ответов. Разворачиваем, если это полный экспорт.
        answersRef.current = jsonData.answers || jsonData;
        setProgressPercent(100);
        setSurveyComplete(true);

        console.log("✅ Тестовые данные загружены из файла:", file.name);
        // alert(`✅ Тестовые данные загружены из ${file.name}! Теперь можно запустить генерацию.`);
      } catch (error) {
        console.error("❌ Ошибка загрузки JSON:", error);
        // alert("❌ Ошибка загрузки файла. Проверьте формат JSON.");
      }
    };

    // Trigger file dialog
    input.click();
  };

  // СТАРТОВЫЙ ЭКРАН
  if (!chatStarted) {
    return (
      <div className={styles.planPage}>
        <Header />
        <Container className="mt-5">
          <Row className="mb-5 text-center">
            <Col>
              <h1 className="display-4 mb-3 text-brand">PlanMaster AI</h1>
              <p className="lead text-muted">
                Интеллектуальный сервис для создания профессиональных
                бизнес-планов на основе современной экономической методологии,
                использует живой онлайн поиск и проверку всех источников,
                критический анализ данных, адаптивные финансовые модели
              </p>
            </Col>
          </Row>

          <Row className="g-4">
            <Col md={6}>
              <Card className={`shadow-sm h-100 ${styles.modeCard}`}>
                <Card.Body className={styles.modeCardBody}>
                  <div className={styles.modeCardContent}>
                    <h5 className="mb-3 text-brand">Начать работу</h5>
                    <p className="mb-4">
                      Я помогу вам собрать всю необходимую информацию о вашем
                      проекте и создам экспертный бизнес-план, готовый для
                      презентации инвестору, банку или для вашей стратегии.
                    </p>

                    <div className="mb-4 w-100">
                      <Badge bg="success" className="me-2">
                        ✓ Интеллектуальный диалог
                      </Badge>
                      <Badge bg="success" className="me-2">
                        ✓ Голосовой ввод
                      </Badge>
                      <Badge bg="success" className="me-2">
                        ✓ Возможность добавить файлы, фото, ссылки
                      </Badge>
                      <Badge bg="success">✓ Факт-чекинг данных </Badge>
                    </div>

                    <Form.Group className="mb-4 w-100">
                      <Form.Label className="w-100">
                        Выберите язык / Choose language
                      </Form.Label>
                      <Form.Select
                        className="w-100"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                      >
                        <option value="ru">🇷🇺 Русский</option>
                        <option value="en">🇬🇧 English</option>
                        <option value="es">🇪🇸 Español</option>
                        <option value="fr">🇫🇷 Français</option>
                        <option value="de">🇩🇪 Deutsch</option>
                        <option value="zh">🇨🇳 中文</option>
                      </Form.Select>
                    </Form.Group>

                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleStartChat}
                      className="w-100 mb-3"
                    >
                      Начать работу
                    </Button>

                    <p className="text-muted text-center small mb-0 w-100">
                      ⏱️ Займет 10-20 минут
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className={`shadow-sm h-100 ${styles.modeCard}`}>
                <Card.Body className={styles.modeCardBody}>
                  <div className={styles.modeCardContent}>
                    <h5 className="mb-3 text-brand">О сервисе</h5>
                    <p className="w-100">
                      PlanMaster AI - это инновационный инструмент, который
                      использует искусственный интеллект для создания
                      профессиональных бизнес-планов за минимальное время.
                    </p>

                    <h6 className="mt-4 text-brand">Как это работает?</h6>
                    <ol className="mb-4 w-100">
                      <li>Отвечайте на вопросы в удобном формате диалога</li>
                      <li>
                        Система собирает и структурирует информацию о вашем
                        проекте
                      </li>
                      <li>Получите готовый бизнес-план за 15-20 минут</li>
                      <li>Экспортируйте документ в нужном формате</li>
                    </ol>

                    <div className="alert alert-info mb-0 w-100">
                      <h6>🎁 Бесплатный тестовый период</h6>
                      <p className="mb-2">
                        Сервис запущен в тестовом режиме и полностью бесплатен!
                      </p>
                      <p className="mb-0 small">
                        Пожалуйста, оцените дизайн и функционал после
                        использования - это поможет нам улучшить продукт и
                        сделать его еще лучше для вас. Спасибо! 🙏
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  // ОСНОВНОЙ ЧАТ
  return (
    <div className={styles.planPage}>
      <Header />
      <Container className="mt-4 mb-5">
        <Row>
          <Col md={generationResult || isGenerating ? 12 : 8}>
            <Card
              className="shadow-sm"
              style={{
                height: "700px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Card.Header
                style={{
                  backgroundColor: "#1e6078",
                  color: "white",
                  borderTopLeftRadius: "16px",
                  borderTopRightRadius: "16px",
                }}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>💬 Чат с PlanMaster AI</strong>
                </div>
                <div>
                  <Badge bg="light" text="dark">
                    Прогресс: {progressPercent}%
                  </Badge>
                </div>
              </Card.Header>

              <Card.Body
                ref={chatBodyRef}
                className={styles.chatBody}
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "20px",
                  backgroundColor: "#e0f7ff",
                }}
              >
                {chatMessages.length === 0 && !isGenerating && !generationResult && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginBottom: "1rem",
                    }}
                  >
                    <Button
                      variant="primary"
                      onClick={handleStartFromChat}
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#171717",
                        border: "none",
                        borderRadius: "16px",
                        padding: "0.6rem 1.5rem",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      Начать 🚀
                    </Button>
                  </div>
                )}

                {/* Контент ожидания — вместо пустого чата, пока идёт генерация */}
                {isGenerating && !generationResult && (() => {
                  const s = getRequestSummary();
                  const prog = generationStatus?.progress_percent ?? 0;
                  const activeIdx = GEN_STAGES.reduce(
                    (acc, st, i) => (prog >= st.at ? i : acc), 0
                  );
                  return (
                    <div className="text-start">
                      <div className="p-3 mb-3" style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                        <div className="fw-semibold mb-2">📋 Ваш запрос</div>
                        {s.idea && <div className="small mb-2">{s.idea.slice(0, 260)}</div>}
                        {(s.industry || s.location || s.goal) && (
                          <div className="small mb-2 d-flex flex-wrap gap-3">
                            {s.industry && <span><span className="text-muted">Отрасль:</span> {s.industry}</span>}
                            {s.location && <span><span className="text-muted">Локация:</span> {s.location}</span>}
                            {s.goal && <span><span className="text-muted">Цель:</span> {s.goal}</span>}
                          </div>
                        )}
                        {s.params.length > 0 && (
                          <div className="small" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 16, rowGap: 2 }}>
                            {s.params.map((p, i) => (
                              <div key={i}><span className="text-muted">{p.label}:</span> {p.value}</div>
                            ))}
                          </div>
                        )}
                        {!s.idea && !s.industry && !s.location && !s.goal && s.params.length === 0 && (
                          <div className="small text-muted">Формируем план по вашим ответам…</div>
                        )}
                      </div>
                      <div className="p-3 mb-3" style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                        <div className="fw-semibold mb-2">⚙️ Что происходит сейчас</div>
                        {GEN_STAGES.map((st, i) => {
                          const done = i < activeIdx || prog >= 100;
                          const active = i === activeIdx && prog < 100;
                          const isMrsStage = st.key === "market_research";
                          const elapsed = isMrsStage && active && mrsElapsedSec > 0;
                          const elapsedStr = elapsed
                            ? mrsElapsedSec >= 60
                              ? ` · ${Math.floor(mrsElapsedSec / 60)} мин ${mrsElapsedSec % 60} сек`
                              : ` · ${mrsElapsedSec} сек`
                            : "";
                          return (
                            <div key={st.key} className="d-flex align-items-center gap-2 mb-1 small">
                              <span style={{ width: 18 }}>{done ? "✅" : active ? "⏳" : "⚪"}</span>
                              <span style={{ color: done ? "#198754" : active ? "#0d6efd" : "#94a3b8", fontWeight: active ? 600 : 400 }}>
                                {st.label}{elapsedStr}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="p-3 small text-muted" style={{ background: "#eef6ff", borderRadius: 14 }}>
                        🔒 Все числа берём только из проверенных источников (поиск + судья, исследование рынка),
                        LLM не выдумывает цифры. Обычно занимает несколько минут — можно не ждать на странице,
                        сессия сохраняется до 1 часа.
                      </div>
                    </div>
                  );
                })()}

                {!isGenerating && !generationResult && chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`chat-message ${msg.type}`}
                    style={{
                      alignSelf:
                        msg.type === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    {msg.type === "user" ? (
                      <div
                        style={{
                          padding: "0.6rem 1rem",
                          borderRadius: "16px",
                          backgroundColor: "#0785f6",
                          color: "#ffffff",
                          wordBreak: "break-word",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      >
                        {editingMessageId === msg.messageId ? (
                          <div className="d-flex gap-2">
                            <Form.Control
                              size="sm"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              autoFocus
                            />
                            <Button
                              size="sm"
                              variant="success"
                              onClick={saveEditedMessage}
                            >
                              <FiSend />
                            </Button>
                          </div>
                        ) : (
                          msg.text
                        )}
                      </div>
                    ) : (
                      <div
                        style={{
                          padding: "0.6rem 1rem",
                          borderRadius: "16px",
                          backgroundColor: "#eef1f4",
                          color: "#171717",
                          wordBreak: "break-word",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        }}
                      >
                        {msg.text}

                        {msg.options && msg.options.length > 0 && (
                          <div
                            className="mt-3"
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "0.5rem",
                            }}
                          >
                            {msg.options.map((opt, idx) => (
                              <Button
                                key={idx}
                                size="sm"
                                style={{
                                  backgroundColor:
                                    msg.multiple &&
                                    selectedOptions.includes(opt)
                                      ? "#0056b3"
                                      : "#0785f6",
                                  border: "none",
                                  borderRadius: "12px",
                                  padding: "0.4rem 1rem",
                                }}
                                onClick={() => {
                                  if (msg.multiple) {
                                    handleMultipleOptionToggle(opt);
                                  } else {
                                    sendAnswer(opt);
                                  }
                                }}
                              >
                                {msg.multiple &&
                                  selectedOptions.includes(opt) &&
                                  "✓ "}
                                {opt}
                              </Button>
                            ))}
                            {msg.multiple && (
                              <Button
                                size="sm"
                                variant="success"
                                onClick={sendMultipleOptions}
                                disabled={selectedOptions.length === 0}
                                style={{ borderRadius: "12px" }}
                              >
                                <FiSend />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div
                    className="chat-message system"
                    style={{ alignSelf: "flex-start" }}
                  >
                    <div
                      style={{
                        padding: "0.6rem 1rem",
                        borderRadius: "16px",
                        backgroundColor: "#ffffff",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <Spinner
                        animation="grow"
                        size="sm"
                        style={{ width: "8px", height: "8px" }}
                      />
                      <Spinner
                        animation="grow"
                        size="sm"
                        style={{ width: "8px", height: "8px" }}
                      />
                      <Spinner
                        animation="grow"
                        size="sm"
                        style={{ width: "8px", height: "8px" }}
                      />
                    </div>
                  </div>
                )}
              </Card.Body>

              <Card.Footer className="bg-white">
                {!surveyComplete ? (
                  <>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                      }}
                    >
                      {selectedFiles.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mb-2">
                          {selectedFiles.map((file, i) => (
                            <Badge key={i} bg="secondary" className="p-2">
                              📎 {file.name}
                              <FiX
                                className="ms-2"
                                style={{ cursor: "pointer" }}
                                onClick={() => removeFile(i)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="d-flex gap-2">
                        <Form.Control
                          ref={inputRef}
                          type="text"
                          placeholder="Введите ответ или задайте вопрос..."
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          disabled={isTyping}
                        />

                        <Form.Label
                          className="btn btn-outline-secondary mb-0"
                          style={{ cursor: "pointer" }}
                        >
                          <FiUpload />
                          <Form.Control
                            type="file"
                            multiple
                            onChange={handleFileSelect}
                            style={{ display: "none" }}
                          />
                        </Form.Label>

                        <Button
                          variant="primary"
                          type="submit"
                          disabled={
                            isTyping ||
                            (!userInput.trim() && selectedFiles.length === 0)
                          }
                        >
                          <FiSend />
                        </Button>
                      </div>
                    </Form>

                    {/* [TEST MODE] Quick test buttons - available from the start */}
                    <div className="border-top pt-3 mt-3">
                      <p className="text-muted small text-center mb-2">
                        <strong>Режим тестирования:</strong>
                      </p>
                      <div className="d-flex gap-2 justify-content-center">
                        <Button
                          variant="outline-warning" style={{borderColor: "#fc0fc0", color: "#fc0fc0"}}
                          size="sm"
                          onClick={loadTestData}
                        >
                          Загрузить тестовые данные
                        </Button>
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={startDocumentGeneration}
                          disabled={Object.keys(answersRef.current).length === 0}
                        >
                          Начать генерацию
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-3">
                    {/* Always show download button after survey completion */}
                    <div className="text-center mb-3">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={exportData}
                        className="mb-3"
                      >
                        <FiDownload className="me-2" /> Скачать данные (JSON)
                      </Button>
                    </div>

                    {!isGenerating && !generationResult && !generationError && (
                      <>
                        <div className="text-center mb-3">
                          <FiCheckCircle size={32} className="text-success mb-3" />
                          <p className="mb-3">
                            <strong>Сбор данных завершен!</strong>
                          </p>
                          <div className="d-flex gap-2 justify-content-center">
                            <Button variant="success" onClick={startDocumentGeneration}>
                              Начать генерацию бизнес-плана 🚀
                            </Button>
                          </div>
                        </div>

                        {/* [TEST MODE] Quick test buttons - always visible for testing */}
                        <div className="border-top pt-3 mt-3">
                          <p className="text-muted small text-center mb-2">
                            <strong>Режим тестирования:</strong>
                          </p>
                          <div className="d-flex gap-2 justify-content-center">
                            <Button
                              variant="outline-warning" style={{borderColor: "#fc0fc0", color: "#fc0fc0"}}
                              size="sm"
                              onClick={loadTestData}
                            >
                              Загрузить тестовые данные
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={startDocumentGeneration}
                            >
                              Начать генерацию
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                    {isGenerating && (
                      <>
                        {isStopped ? (
                          <div
                            className="mb-3 p-3"
                            style={{
                              background: "#fff8e1",
                              border: "1px solid #ffe082",
                              borderRadius: 12,
                            }}
                          >
                            <div className="d-flex align-items-start gap-2">
                              <span style={{ fontSize: "1.2rem" }}>⏹</span>
                              <div>
                                <strong>Отслеживание остановлено</strong>
                                <p className="mb-0 small text-muted">
                                  Генерация на сервере <strong>продолжается</strong> — данные не
                                  теряются. Продолжите отслеживание того же плана или измените
                                  вводные (текущая генерация не перезапустится).
                                </p>
                              </div>
                            </div>
                            <div className="d-flex gap-2 mt-3 flex-wrap">
                              <Button size="sm" variant="success" onClick={handleContinuePolling}>
                                ▶ Продолжить
                              </Button>
                              <Button size="sm" variant="outline-secondary" onClick={handleEditInputs}>
                                ✏️ Изменить входные данные
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <strong>Генерация бизнес-плана…</strong>
                              <Badge bg="info">
                                {generationStatus?.progress_percent || 0}%
                              </Badge>
                            </div>
                            <ProgressBar
                              now={generationStatus?.progress_percent || 0}
                              animated
                              striped
                              variant="success"
                            />
                            <p className="text-muted small mt-2 mb-0">
                              {generationStatus?.current_step || "Инициализация…"}
                            </p>
                            {/* Во время генерации — ОДНА опция: остановить. Сессия и так
                                сохраняется до 1 часа (пауза-дубликаты убраны). */}
                            <div className="d-flex align-items-center gap-2 mt-3 flex-wrap">
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={handleStopGeneration}
                              >
                                ⏹ Остановить генерацию
                              </Button>
                              <span className="text-muted small">
                                Сессия сохраняется до 1 часа — можно вернуться и продолжить.
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Логи сервисов — консоль */}
                        <div
                          className="mb-3"
                          style={{
                            borderRadius: 10,
                            overflow: "hidden",
                            border: "1px solid #1b2440",
                          }}
                        >
                          <div
                            style={{
                              background: "#161c2e",
                              padding: "8px 12px",
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56" }} />
                            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
                            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#27c93f" }} />
                            <span style={{ color: "#9aa4bf", fontSize: "0.8rem", marginLeft: 6 }}>
                              Логи сервисов
                            </span>
                          </div>
                          <div
                            style={{
                              background: "#0b1021",
                              color: "#7CFC98",
                              fontFamily: "ui-monospace, Menlo, Consolas, monospace",
                              fontSize: "0.78rem",
                              lineHeight: 1.5,
                              padding: "10px 12px",
                              maxHeight: 240,
                              overflowY: "auto",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {genLogs.length === 0 ? (
                              <span style={{ opacity: 0.6 }}>▍ ожидание событий…</span>
                            ) : (
                              genLogs.map((l, i) => <div key={i}>{l}</div>)
                            )}
                            <div ref={logsEndRef} />
                          </div>
                        </div>
                      </>
                    )}

                    {generationError && (
                      <>
                        <Alert variant="danger" className="mb-3">
                          <strong>Ошибка генерации:</strong> {generationError}
                          <div className="mt-2">
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={startDocumentGeneration}
                            >
                              Попробовать снова
                            </Button>
                          </div>
                        </Alert>

                        {/* [TEST MODE] Quick test buttons - always visible for testing */}
                        <div className="border-top pt-3 mt-3">
                          <p className="text-muted small text-center mb-2">
                            <strong>Режим тестирования:</strong>
                          </p>
                          <div className="d-flex gap-2 justify-content-center">
                            <Button
                              variant="outline-warning" style={{borderColor: "#fc0fc0", color: "#fc0fc0"}}
                              size="sm"
                              onClick={loadTestData}
                            >
                              Загрузить тестовые данные
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={startDocumentGeneration}
                            >
                              Начать генерацию
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                    {generationResult && (
                      <>
                        <div className="text-center">
                          {driversComputable === false ? (
                            <>
                              <FiFileText size={44} className="text-warning mb-3" />
                              <h5 className="mb-1">Черновик готов — заполните ключевые показатели</h5>
                              <p className="text-muted small mb-3">
                                Финмодель ещё не рассчитана: не хватает данных о доходности.
                                Заполните обязательные поля ниже и нажмите «Пересчитать план».
                              </p>
                            </>
                          ) : (
                            <>
                              <FiCheckCircle size={48} className="text-success mb-3" />
                              <h5 className="mb-3">Бизнес-план готов! 🎉</h5>
                            </>
                          )}
                          {generationResult.metadata && (
                            <div className="mb-3">
                              <Badge bg="success" className="me-2">
                                {generationResult.metadata.sections_count} разделов
                              </Badge>
                              <Badge bg="info" className="me-2">
                                {generationResult.metadata.verified_facts_used} verified фактов
                              </Badge>
                              <Badge bg="secondary">
                                {generationResult.metadata.generation_time_seconds.toFixed(1)}с
                              </Badge>
                            </div>
                          )}

                          {/* ШАГ: Проверьте ключевые показатели (верификация драйверов) */}
                          {drivers.length > 0 && (() => {
                            // Валидное число? (для required-полей нужен непустой корректный ввод)
                            const isNum = (s: any) =>
                              s != null && String(s).trim() !== "" &&
                              !isNaN(parseFloat(String(s).replace(",", ".")));
                            // Человекочитаемая единица (pct→%, per_month→/мес и т.п.)
                            const unitLabel = (dr: any) => {
                              if (dr.currency) return dr.currency;
                              return ({ pct: "%", per_month: "/мес", per_year: "/год",
                                each: "шт", per_day: "/день" } as Record<string, string>)[dr.unit]
                                || dr.unit || "";
                            };
                            // Обязательные входы, не заполненные пользователем → пересчёт запрещён.
                            // Два вида: 'revenue' (без него модель не считается) и 'cost'
                            // (подтвердить статью расходов, 0 допустимо).
                            const requiredUnmet = drivers.filter(
                              (dr) => dr.required && !isNum(driverEdits[dr.key])
                            );
                            const unmetRevenue = requiredUnmet.filter((d) => d.required_kind === "revenue");
                            const unmetCost = requiredUnmet.filter((d) => d.required_kind === "cost");
                            return (
                            <div
                              className="text-start mb-4 p-3"
                              style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12 }}
                            >
                              <h6 className="mb-1">🔎 Проверьте ключевые показатели</h6>
                              <p className="text-muted small mb-2">
                                Значения по умолчанию — из исследования рынка и могут быть неточными
                                (напр. клиентов в день). Скорректируйте под ваш бизнес и нажмите
                                «Пересчитать» — финмодель и документ обновятся.
                              </p>
                              {/* Сводка запроса перед глазами, пока юзер правит KPI (фидбэк 2b) */}
                              {(() => {
                                const s = getRequestSummary();
                                if (!s.idea && !s.industry && !s.location && !s.goal && s.params.length === 0) return null;
                                return (
                                  <div className="mb-3 p-2 small" style={{ background: "#eef6ff", borderRadius: 8 }}>
                                    {s.idea && <div className="mb-1">{s.idea.slice(0, 200)}</div>}
                                    <div className="d-flex flex-wrap gap-3">
                                      {s.industry && <span><span className="text-muted">Отрасль:</span> {s.industry}</span>}
                                      {s.location && <span><span className="text-muted">Локация:</span> {s.location}</span>}
                                      {s.goal && <span><span className="text-muted">Цель:</span> {s.goal}</span>}
                                    </div>
                                    {s.params.length > 0 && (
                                      <div className="d-flex flex-wrap gap-3 mt-1">
                                        {s.params.map((p, i) => (
                                          <span key={i}><span className="text-muted">{p.label}:</span> {p.value}</span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                              {/* Рентабельность — headline KPI (расчётная, обновляется при пересчёте) */}
                              {(() => {
                                const p = driversProfit?.calculated;
                                const pct = (x: any) => (x == null ? "—" : `${(x * 100).toFixed(0)}%`);
                                const nm = p?.net_margin;
                                return (
                                  <div className="mb-3 p-3 text-center"
                                    style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10 }}>
                                    <div className="text-muted small">Рентабельность (чистая маржа)</div>
                                    {nm != null ? (
                                      <>
                                        <div className="d-flex justify-content-center align-items-baseline gap-3 flex-wrap">
                                          <div>
                                            <div style={{ fontSize: "1.9rem", fontWeight: 700, lineHeight: 1.1,
                                              color: nm >= 0 ? "#15803d" : "#b91c1c" }}>
                                              {pct(nm)}
                                            </div>
                                            <div className="text-muted" style={{ fontSize: "0.66rem" }}>ваш расчёт</div>
                                          </div>
                                          {(() => {
                                            const t = driversProfit?.target;
                                            if (!t || t.median == null) {
                                              return (
                                                <div style={{ opacity: 0.75 }}>
                                                  <div style={{ fontSize: "1.1rem", fontWeight: 600, lineHeight: 1.1, color: "#64748b" }}>
                                                    нет данных
                                                  </div>
                                                  <div className="text-muted" style={{ fontSize: "0.66rem" }}>ориентир по отрасли</div>
                                                </div>
                                              );
                                            }
                                            const range = t.low === t.high
                                              ? pct(t.median)
                                              : `${pct(t.low)}–${pct(t.high)}`;
                                            return (
                                              <div>
                                                <div style={{ fontSize: "1.3rem", fontWeight: 600, lineHeight: 1.1, color: "#334155" }}>
                                                  {range}
                                                </div>
                                                <div className="text-muted" style={{ fontSize: "0.66rem" }}>
                                                  ориентир по отрасли ({t.n_sources} источн.)
                                                </div>
                                              </div>
                                            );
                                          })()}
                                        </div>
                                        <div className="text-muted" style={{ fontSize: "0.7rem", marginTop: 4 }}>
                                          расчётная на {p.year}-й год · 1-й год {pct(p.net_margin_year1)} · EBITDA-маржа {pct(p.ebitda_margin)}
                                        </div>
                                      </>
                                    ) : (
                                      <div className="text-muted small mt-1">
                                        Рассчитается после заполнения показателей ниже.
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                              {unmetRevenue.length > 0 && (
                                <div
                                  className="py-2 px-3 small mb-2"
                                  style={{ background: "#fff5f5", border: "1px solid #f5c2c7", borderRadius: 8, color: "#842029" }}
                                >
                                  ⚠ Финмодель не рассчитается без этих данных — заполните:{" "}
                                  <strong>{unmetRevenue.map((d) => d.label).join(", ")}</strong>.
                                </div>
                              )}
                              {unmetCost.length > 0 && (
                                <div
                                  className="py-2 px-3 small mb-3"
                                  style={{ background: "#fff8e1", border: "1px solid #ffe082", borderRadius: 8, color: "#7a5b00" }}
                                >
                                  Подтвердите статьи расходов (укажите <strong>0</strong>, если их нет):{" "}
                                  <strong>{unmetCost.map((d) => d.label).join(", ")}</strong>.
                                </div>
                              )}
                              {/* Два столбца — все KPI на экране без прокрутки (фидбэк 3) */}
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 16, rowGap: 8 }}>
                                {drivers.map((dr) => {
                                  const unmet = dr.required && !isNum(driverEdits[dr.key]);
                                  const hasRedFlag = !!(dr.red_flag && !dr.required);
                                  // Подсказка рядом с avg_check: конкурентный чек рынка
                                  const avgCheckHint = dr.key === "avg_check" && marketAvgCheck?.value ? (
                                    <div className="small mt-1" style={{ color: "#64748b", fontSize: "0.65rem" }}>
                                      рынок: ~{Math.round(marketAvgCheck.value).toLocaleString()} {marketAvgCheck.currency}
                                    </div>
                                  ) : null;
                                  // Подсказка рядом с sqm: ставка аренды из DRA
                                  const sqmHint = dr.key === "sqm" && rentRateBenchmark?.median ? (
                                    <div className="small mt-1" style={{ color: "#64748b", fontSize: "0.65rem" }}>
                                      ставка: {Math.round(rentRateBenchmark.low ?? rentRateBenchmark.median)}–{Math.round(rentRateBenchmark.high ?? rentRateBenchmark.median)} {rentRateBenchmark.currency}/м²/мес
                                    </div>
                                  ) : null;
                                  // Подсказка рядом с rent_monthly: формула если rent_rate известна
                                  const rentHint = dr.key === "rent_monthly" && rentRateBenchmark?.median && !driverEdits["sqm"] && !drivers.find(d => d.key === "sqm")?.value ? (
                                    <div className="small mt-1" style={{ color: "#64748b", fontSize: "0.65rem" }}>
                                      или введите площадь (м²) выше
                                    </div>
                                  ) : null;
                                  return (
                                    <div key={dr.key} style={{ minWidth: 0 }}>
                                      {/* Label + полоска качества данных в одну строку */}
                                      <div className="d-flex align-items-center gap-1 mb-1" style={{ flexWrap: "nowrap" }}>
                                        <div className="small fw-semibold text-truncate" style={{ flex: 1, minWidth: 0 }}>{dr.label}</div>
                                        <QualityBar sourceType={dr.source_type} redFlag={hasRedFlag} />
                                        {dr.required && dr.required_kind === "cost" && (
                                          <span style={{ fontSize: "0.57rem", color: "#92400e", whiteSpace: "nowrap", flexShrink: 0 }}>0 если нет</span>
                                        )}
                                        {dr.required && dr.required_kind !== "cost" && (
                                          <span style={{ fontSize: "0.57rem", color: "#dc2626", whiteSpace: "nowrap", flexShrink: 0 }}>обязательно</span>
                                        )}
                                      </div>
                                      <div className="d-flex align-items-center gap-1">
                                        <Form.Control
                                          size="sm"
                                          style={{ flex: 1, minWidth: 0, ...(unmet ? { borderColor: "#dc3545" } : {}) }}
                                          type="text"
                                          placeholder={dr.value == null
                                            ? (dr.key === "sqm" ? "напр. 60" : dr.required_kind === "cost" ? "0 если нет" : dr.required ? "введите" : "—")
                                            : String(dr.value)}
                                          value={driverEdits[dr.key] ?? (dr.value == null ? "" : String(dr.value))}
                                          onChange={(e) =>
                                            setDriverEdits((p) => ({ ...p, [dr.key]: e.target.value }))
                                          }
                                        />
                                        <span className="text-muted small" style={{ whiteSpace: "nowrap" }}>
                                          {unitLabel(dr)}
                                        </span>
                                      </div>
                                      {avgCheckHint}
                                      {sqmHint}
                                      {rentHint}
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="d-flex align-items-center gap-2 mt-2">
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={handleVerifyDrivers}
                                  disabled={isVerifying || requiredUnmet.length > 0 || Object.keys(driverEdits).length === 0}
                                >
                                  {isVerifying ? "Пересчитываю…" : "Пересчитать план"}
                                </Button>
                                {requiredUnmet.length > 0 && (
                                  <span className="text-danger small">
                                    Заполните обязательные поля
                                  </span>
                                )}
                                {recomputed && requiredUnmet.length === 0 && (
                                  <span className="text-success small">
                                    ✓ Пересчитано — скачайте обновлённый документ
                                  </span>
                                )}
                              </div>
                            </div>
                            );
                          })()}

                          <div className="d-flex gap-2 justify-content-center mb-3">
                            <Button
                              variant="primary"
                              onClick={() => handleDownloadDocument("docx")}
                            >
                              <FiFileText className="me-2" /> Скачать DOCX
                            </Button>
                            <Button
                              variant="outline-primary"
                              onClick={() => handleDownloadDocument("markdown")}
                            >
                              <FiDownload className="me-2" /> Скачать Markdown
                            </Button>
                          </div>
                          <div className="text-center">
                            <Button
                              variant="outline-secondary"
                              onClick={() => {
                                setGenerationResult(null);
                                setIsGenerating(false);
                                setIsPaused(false);
                                setGenLogs([]);
                                lastGenLogRef.current = "";
                                lastStageRef.current = "";
                                setSessionSaved(false);
                                setShowGrade(false);
                                setGenerationStatus(null);
                                setGenerationError(null);
                              }}
                            >
                              Начать новую генерацию
                            </Button>
                          </div>
                        </div>


                        {/* [TEST MODE] Quick test buttons - always visible for testing */}
                        <div className="border-top pt-3 mt-3">
                          <p className="text-muted small text-center mb-2">
                            <strong>Режим тестирования:</strong>
                          </p>
                          <div className="d-flex gap-2 justify-content-center">
                            <Button
                              variant="outline-warning" style={{borderColor: "#fc0fc0", color: "#fc0fc0"}}
                              size="sm"
                              onClick={loadTestData}
                            >
                              Загрузить тестовые данные
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={startDocumentGeneration}
                            >
                              Начать генерацию
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="progress mt-2" style={{ height: "5px" }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </Card.Footer>
            </Card>
          </Col>

          {/* ПРАВАЯ ПАНЕЛЬ — ПОДСКАЗКИ только в режиме чата. Во время генерации скрыты
              (контент ожидания слева). После завершения Grade уходит ВНИЗ на всю ширину. */}
          {!generationResult && !isGenerating && (
            <Col md={4}>
              <Tips hint={currentHint} />
            </Col>
          )}
        </Row>

        {/* Grade — скрыта за кнопкой, чтобы не перекрывать KPI-панель */}
        {generationResult && (
          <Row className="mt-3">
            <Col md={12} className="text-center">
              {!showGrade ? (
                <Button
                  variant="outline-secondary"
                  size="sm"
                  style={{ fontSize: "0.82rem", color: "#64748b", borderColor: "#cbd5e1" }}
                  onClick={() => setShowGrade(true)}
                >
                  Оценить план
                </Button>
              ) : (
                <div style={{ fontSize: "1.05rem" }}>
                  <Grade sessionId={generationResult.execution_id || sessionId} />
                </div>
              )}
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}
