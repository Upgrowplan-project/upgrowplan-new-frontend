"use client";

import { useState, useEffect, useRef, ChangeEvent, useCallback } from "react";
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
  downloadDocument,
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

export default function PlanPage() {
  const [chatStarted, setChatStarted] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [surveyComplete, setSurveyComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [currentHint, setCurrentHint] = useState<string>("");

  // Default language changed to English for local testing
  const [language, setLanguage] = useState("en");

  // Document Generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] =
    useState<GenerationStatus | null>(null);
  const [generationResult, setGenerationResult] =
    useState<GenerationResult | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

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

  const initWebSocket = () => {
    ws.current = new WebSocket("ws://localhost:8888/ws/survey");

    ws.current.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleServerMessage(data);
      } catch (e) {
        console.error("Parsing error:", e);
      }
    };

    ws.current.onerror = (e) => console.error("WebSocket error:", e);
    ws.current.onclose = () => console.log("WebSocket closed");
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
        // trigger a re-render after answersRef update
        setChatMessages((prev) => [...prev]);
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
      // alert(`You can upload a maximum of ${MAX_FILES} files`);
      return;
    }

    const invalidFiles = filesArray.filter(
      (f) =>
        !ALLOWED_FILE_TYPES.includes(
          f.name.split(".").pop()?.toLowerCase() ?? ""
        )
    );
    if (invalidFiles.length > 0) {
      // alert(`Invalid file format: ${invalidFiles.map((f) => f.name).join(", ")}`);
      console.warn(
        `Invalid file format: ${invalidFiles.map((f) => f.name).join(", ")}`
      );
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
    sendAnswer("Start");
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

      // alert("✅ Data downloaded successfully!");
    } catch (error) {
      console.error("Export error:", error);
      // alert("❌ Export error");
    }
  };

  const startDocumentGeneration = async () => {
    try {
      setIsGenerating(true);
      setGenerationError(null);
      setGenerationStatus(null);
      setGenerationResult(null);

      // Collecting all data from chat answers
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
          return value.flat().filter((v) => v && typeof v === "string");
        }
        if (typeof value === "string") {
          return [value];
        }
        return undefined;
      };

      // Начинаем с базовых обязательных полей
      const requestData: any = {
        goal_of_plan: "для банка (кредит)",
        location_country: "Россия",
        session_id: sessionId,
      };

      // Добавляем ВСЕ поля из собранных ответов
      Object.entries(allAnswersFlat).forEach(([key, value]) => {
        if (!value || value === "Нет данных" || value === "") return;

        // Специальная обработка для конкретных полей
        if (
          key === "sales_channels" ||
          key === "investment_purpose" ||
          key === "target_audience_type"
        ) {
          requestData[key] = normalizeArray(value);
        } else if (key === "team" || key === "team_size") {
          requestData.team_size = value ? parseInt(String(value)) : undefined;
        } else if (
          key === "location" ||
          key === "customer_location" ||
          key === "city"
        ) {
          if (!requestData.location_city) {
            requestData.location_city = value;
          }
        } else if (key === "business_stage") {
          // Маппим значения business_stage к значениям enum
          const businessStageMap: Record<string, string> = {
            идея: "идея (еще не запущен)",
            "идея (еще не запущен)": "идея (еще не запущен)",
            запуск: "новый проект",
            "запуск (0-6 месяцев)": "новый проект",
            "новый проект": "новый проект",
            стартап: "стартап (до 2 лет)",
            "стартап (до 2 лет)": "стартап (до 2 лет)",
            действующий: "действующий бизнес (2+ года)",
            "действующий бизнес": "действующий бизнес (2+ года)",
            "действующий бизнес (2+ года)": "действующий бизнес (2+ года)",
            растущий: "растущий бизнес",
            "растущий бизнес": "растущий бизнес",
            зрелый: "зрелый бизнес",
            "зрелый бизнес": "зрелый бизнес",
          };
          const normalizedValue = String(value).toLowerCase().trim();
          requestData.business_stage =
            businessStageMap[normalizedValue] || "новый проект";
        } else if (key === "legal_form") {
          // Маппим значения legal_form
          const legalFormMap: Record<string, string> = {
            "Пока не зарегистрирован": "Еще не решили",
            "Не решили": "Еще не решили",
            "Еще не определились": "Еще не решили",
          };
          requestData.legal_form = legalFormMap[String(value)] || value;
        } else if (key === "goal_of_plan") {
          // Приводим к нижнему регистру для соответствия enum
          requestData.goal_of_plan = String(value).toLowerCase();
        } else {
          // Все остальные поля добавляем напрямую
          requestData[key] = value;
        }
      });

      // Обязательные поля - если не заполнены, используем минимальные значения
      if (!requestData.full_name) {
        requestData.full_name =
          allAnswersFlat["company_name"] ||
          allAnswersFlat["business_name"] ||
          allAnswersFlat["user_name"] ||
          "Компания";
      }
      if (!requestData.industry) {
        requestData.industry = allAnswersFlat["industry"] || "Business";
      }
      if (!requestData.product_or_service) {
        // Ищем описание продукта в разных полях
        requestData.product_or_service =
          allAnswersFlat["business_description"] ||
          allAnswersFlat["product"] ||
          allAnswersFlat["audience_pain_points"] ||
          "Product or service";
      }

      // Удаляем undefined значения
      Object.keys(requestData).forEach((key) => {
        if (requestData[key] === undefined) {
          delete requestData[key];
        }
      });

      console.log("🚀 Starting business plan generation...");
      console.log("   Execution ID:", sessionId);
      console.log("   Request data:", requestData);

      // СНАЧАЛА запускаем генерацию через POST /api/generate
      const result = await triggerGeneration(requestData);

      console.log("✅ Generation started:", result);
      console.log("   Backend execution ID:", result.execution_id);

      // ПОТОМ запускаем polling статуса используя execution_id из ответа бэкенда
      const finalStatus = await pollGenerationStatus(
        result.execution_id, // Используем ID от бэкенда, не sessionId!
        (status) => {
          console.log(`[${status.progress_percent}%] ${status.current_step}`);
          setGenerationStatus(status);
        }
      );

      if (finalStatus.status === "completed") {
        setGenerationResult(result);
        console.log("✅ Generation completed!", result);
      } else if (finalStatus.status === "failed") {
        throw new Error(finalStatus.error || "Generation failed");
      }
    } catch (error: any) {
      console.error("❌ Generation error:", error);
      setGenerationError(error.message || "Unknown error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadDocument = async (format: "markdown" | "docx") => {
    if (!generationResult) return;

    try {
      if (format === "docx") {
        // Download DOCX file from backend
        const response = await fetch(
          `http://localhost:8000/api/download/${generationResult.execution_id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the blob
        const blob = await response.blob();

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `business_plan_${generationResult.execution_id}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log("✅ DOCX downloaded");
      } else {
        // Markdown format - download JSON temporarily
        const dataStr = JSON.stringify(generationResult, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `business_plan_${sessionId}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log("✅ JSON file downloaded (Markdown in progress)");
      }
    } catch (error) {
      console.error("❌ Download error:", error);
      // alert(`❌ Download error ${format.toUpperCase()}`);
    }
  };

  // [TEST MODE] Load test data from JSON file
  const loadTestData = () => {
    // Create file input element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const jsonData = JSON.parse(text);

        // Load data into answersRef
        answersRef.current = jsonData;
        setProgressPercent(100);
        setSurveyComplete(true);

        console.log("✅ Test data loaded from file:", file.name);
        // alert(`✅ Test data loaded from ${file.name}! You can now start generation.`);
      } catch (error) {
        console.error("❌ JSON load error:", error);
        // alert("❌ Failed to load file. Check JSON format.");
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
                Intelligent service for creating professional business plans
                based on modern economic methodology. Uses live online search,
                source verification, critical data analysis and adaptive
                financial models.
              </p>
            </Col>
          </Row>

          <Row className="g-4">
            <Col md={6}>
              <Card className={`shadow-sm h-100 ${styles.modeCard}`}>
                <Card.Body className={styles.modeCardBody}>
                  <div className={styles.modeCardContent}>
                    <h5 className="mb-3 text-brand">Get started</h5>
                    <p className="mb-4">
                      I will help you collect the information needed for your
                      project and create a professional business plan ready for
                      investors, banks or your strategy.
                    </p>

                    <div className="mb-4 w-100">
                      <Badge bg="success" className="me-2">
                        ✓ Intelligent dialog
                      </Badge>
                      <Badge bg="success" className="me-2">
                        ✓ Voice input
                      </Badge>
                      <Badge bg="success" className="me-2">
                        ✓ Attach files, photos, links
                      </Badge>
                      <Badge bg="success">✓ Fact-checking</Badge>
                    </div>

                    <Form.Group className="mb-4 w-100">
                      <Form.Label className="w-100">Choose language</Form.Label>
                      <Form.Select
                        className="w-100"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                      >
                        <option value="ru">🇷🇺 Russian</option>
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
                      Start
                    </Button>

                    <p className="text-muted text-center small mb-0 w-100">
                      ⏱️ Takes 10–20 minutes
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className={`shadow-sm h-100 ${styles.modeCard}`}>
                <Card.Body className={styles.modeCardBody}>
                  <div className={styles.modeCardContent}>
                    <h5 className="mb-3 text-brand">About the service</h5>
                    <p className="w-100">
                      PlanMaster AI is an innovative tool that uses artificial
                      intelligence to create professional business plans in a
                      short time.
                    </p>

                    <h6 className="mt-4 text-brand">How it works</h6>
                    <ol className="mb-4 w-100">
                      <li>Answer questions in a conversational format</li>
                      <li>
                        System collects and structures information about your
                        project
                      </li>
                      <li>Receive a business plan in 15–20 minutes</li>
                      <li>Export the document in the desired format</li>
                    </ol>

                    <div className="alert alert-info mb-0 w-100">
                      <h6>🎁 Free trial</h6>
                      <p className="mb-2">
                        The service is running in test mode and is free to use.
                      </p>
                      <p className="mb-0 small">
                        Please evaluate the design and functionality after use —
                        it will help us improve the product. Thank you! 🙏
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
          <Col md={8}>
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
                  <strong>💬 Chat with PlanMaster AI</strong>
                </div>
                <div>
                  <Badge bg="light" text="dark">
                    Progress: {progressPercent}%
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
                {chatMessages.length === 0 && (
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
                      Start 🚀
                    </Button>
                  </div>
                )}

                {chatMessages.map((msg, i) => (
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
                          backgroundColor: "#ffffff",
                          color: "#171717",
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
                          backgroundColor: "#ffffff",
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
                          placeholder="Type your answer or ask a question..."
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
                        <strong>Test mode:</strong>
                      </p>
                      <div className="d-flex gap-2 justify-content-center">
                        <Button
                          variant="outline-warning"
                          style={{ borderColor: "#fc0fc0", color: "#fc0fc0" }}
                          size="sm"
                          onClick={loadTestData}
                        >
                          Load test data
                        </Button>
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={startDocumentGeneration}
                          disabled={
                            Object.keys(answersRef.current).length === 0
                          }
                        >
                          Start generation
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
                        <FiDownload className="me-2" /> Download data (JSON)
                      </Button>
                    </div>

                    {!isGenerating && !generationResult && !generationError && (
                      <>
                        <div className="text-center mb-3">
                          <FiCheckCircle
                            size={32}
                            className="text-success mb-3"
                          />
                          <p className="mb-3">
                            <strong>Data collection completed!</strong>
                          </p>
                          <div className="d-flex gap-2 justify-content-center">
                            <Button
                              variant="success"
                              onClick={startDocumentGeneration}
                            >
                              Start plan generation 🚀
                            </Button>
                          </div>
                        </div>

                        {/* [TEST MODE] Quick test buttons - always visible for testing */}
                        <div className="border-top pt-3 mt-3">
                          <p className="text-muted small text-center mb-2">
                            <strong>Test mode:</strong>
                          </p>
                          <div className="d-flex gap-2 justify-content-center">
                            <Button
                              variant="outline-warning"
                              style={{
                                borderColor: "#fc0fc0",
                                color: "#fc0fc0",
                              }}
                              size="sm"
                              onClick={loadTestData}
                            >
                              Load test data
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={startDocumentGeneration}
                            >
                              Start generation
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                    {isGenerating && generationStatus && (
                      <>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong>Generating business plan...</strong>
                            <Badge bg="info">
                              {generationStatus.progress_percent || 0}%
                            </Badge>
                          </div>
                          <ProgressBar
                            now={generationStatus.progress_percent || 0}
                            animated
                            striped
                            variant="success"
                          />
                          <p className="text-muted small mt-2 mb-0">
                            {generationStatus.current_step || "Initializing..."}
                          </p>
                          <div className="mt-2">
                            <Button
                              size="sm"
                              variant="outline-secondary"
                              onClick={() => {
                                setIsGenerating(false);
                                setGenerationStatus(null);
                                setGenerationError(
                                  "Generation cancelled by user"
                                );
                              }}
                            >
                              Cancel and retry
                            </Button>
                          </div>
                        </div>

                        {/* [TEST MODE] Quick test buttons - always visible for testing */}
                        <div className="border-top pt-3 mt-3">
                          <p className="text-muted small text-center mb-2">
                            <strong>Test mode:</strong>
                          </p>
                          <div className="d-flex gap-2 justify-content-center">
                            <Button
                              variant="outline-warning"
                              style={{
                                borderColor: "#fc0fc0",
                                color: "#fc0fc0",
                              }}
                              size="sm"
                              onClick={loadTestData}
                            >
                              Load test data
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={startDocumentGeneration}
                            >
                              Start generation
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                    {generationError && (
                      <>
                        <Alert variant="danger" className="mb-3">
                          <strong>Generation error:</strong> {generationError}
                          <div className="mt-2">
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={startDocumentGeneration}
                            >
                              Try again
                            </Button>
                          </div>
                        </Alert>

                        {/* [TEST MODE] Quick test buttons - always visible for testing */}
                        <div className="border-top pt-3 mt-3">
                          <p className="text-muted small text-center mb-2">
                            <strong>Test mode:</strong>
                          </p>
                          <div className="d-flex gap-2 justify-content-center">
                            <Button
                              variant="outline-warning"
                              style={{
                                borderColor: "#fc0fc0",
                                color: "#fc0fc0",
                              }}
                              size="sm"
                              onClick={loadTestData}
                            >
                              Load test data
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={startDocumentGeneration}
                            >
                              Start generation
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                    {generationResult && (
                      <>
                        <div className="text-center">
                          <FiCheckCircle
                            size={48}
                            className="text-success mb-3"
                          />
                          <h5 className="mb-3">Business plan is ready! 🎉</h5>
                          {generationResult.metadata && (
                            <div className="mb-3">
                              <Badge bg="success" className="me-2">
                                {generationResult.metadata.sections_count}{" "}
                                sections
                              </Badge>
                              <Badge bg="info" className="me-2">
                                {generationResult.metadata.verified_facts_used}{" "}
                                verified facts
                              </Badge>
                              <Badge bg="secondary">
                                {generationResult.metadata.generation_time_seconds.toFixed(
                                  1
                                )}
                                s
                              </Badge>
                            </div>
                          )}
                          <div className="d-flex gap-2 justify-content-center mb-3">
                            <Button
                              variant="primary"
                              onClick={() => handleDownloadDocument("docx")}
                            >
                              <FiFileText className="me-2" /> Download DOCX
                            </Button>
                            <Button
                              variant="outline-primary"
                              onClick={() => handleDownloadDocument("markdown")}
                            >
                              <FiDownload className="me-2" /> Download Markdown
                            </Button>
                          </div>
                          <div className="text-center">
                            <Button
                              variant="outline-secondary"
                              onClick={() => {
                                setGenerationResult(null);
                                setIsGenerating(false);
                                setGenerationStatus(null);
                                setGenerationError(null);
                              }}
                            >
                              Start a new generation
                            </Button>
                          </div>
                        </div>

                        {/* [TEST MODE] Quick test buttons - always visible for testing */}
                        <div className="border-top pt-3 mt-3">
                          <p className="text-muted small text-center mb-2">
                            <strong>Test mode:</strong>
                          </p>
                          <div className="d-flex gap-2 justify-content-center">
                            <Button
                              variant="outline-warning"
                              style={{
                                borderColor: "#fc0fc0",
                                color: "#fc0fc0",
                              }}
                              size="sm"
                              onClick={loadTestData}
                            >
                              Load test data
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={startDocumentGeneration}
                            >
                              Start generation
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

          {/* ПРАВАЯ ПАНЕЛЬ - ПОДСКАЗКИ ИЛИ ОЦЕНКА */}
          <Col md={4}>
            {!surveyComplete ? (
              <Tips hint={currentHint} />
            ) : (
              <Grade sessionId={sessionId} />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
