import { useState } from "react";
import { Card, Button, Form, Alert } from "react-bootstrap";

interface Rating {
  clarity?: number;
  usefulness?: number;
  accuracy?: number;
  usability?: number;
  speed?: number;
  design?: number;
  recommend?: number;
  price?: number;
}

interface GradeProps {
  sessionId: string;
}

export default function RuGrade({ sessionId }: GradeProps) {
  const [rating, setRating] = useState<Rating>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [feedback, setFeedback] = useState("");

  const calculateOverallRating = () => {
    const ratings = [
      rating.clarity,
      rating.usefulness,
      rating.accuracy,
      rating.usability,
      rating.speed,
      rating.design,
    ].filter((r) => r !== undefined);

    if (ratings.length === 0) return 0;
    return Math.round(
      ratings.reduce((sum, r) => sum + (r || 0), 0) / ratings.length,
    );
  };

  const submitRatingAndFeedback = async () => {
    try {
      setStatus("submitting");
      setErrorMessage("");
      const overallRating = calculateOverallRating();

      const apiUrl =
        process.env.NEXT_PUBLIC_MONITORING_API_URL || "http://localhost:8000";

      const response = await fetch(`${apiUrl}/api/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...rating,
          overall: overallRating,
          feedback,
          session_id: sessionId,
          service_name: "synth_focus_lab",
          page_url:
            typeof window !== "undefined" ? window.location.href : undefined,
        }),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to submit rating");
      }
    } catch (error) {
      console.error("Ошибка отправки рейтинга:", error);
      setStatus("error");
      setErrorMessage(
        "Произошла ошибка при отправке оценки. Попробуйте позже.",
      );
    }
  };

  const renderStars = (
    category: keyof Rating,
    currentValue: number | undefined,
  ) => (
    <div className="d-flex w-100 justify-content-between">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{ cursor: "pointer", fontSize: "1.5rem" }}
          onClick={() => setRating({ ...rating, [category]: star })}
        >
          {star <= (currentValue || 0) ? "⭐" : "☆"}
        </span>
      ))}
    </div>
  );

  return (
    <Card
      className="shadow-sm h-100"
      style={{ borderRadius: "16px", border: "1px solid #eee" }}
    >
      <Card.Header
        style={{
          backgroundColor: "transparent",
          border: "none",
          padding: "1.5rem 1.5rem 0",
        }}
      >
        <h5 className="text-brand mb-0">⭐ Оцените сервис</h5>
      </Card.Header>
      <Card.Body
        style={{ maxHeight: "650px", overflowY: "auto", padding: "1.5rem" }}
      >
        <div style={{ width: "100%" }}>
          <Alert
            variant="light"
            className="mb-4"
            style={{
              width: "100%",
              backgroundColor: "#f8f9fb",
              border: "none",
            }}
          >
            <p className="small mb-2">
              Сервис запущен в тестовом режиме (бэта-версия) и полностью
              бесплатен!
            </p>
            <p className="small mb-0">
              Мы собираем отзывы - это анонимно и конфиденциально. Вы можете
              оценить сервис по окончании ознакомления с результатом. Спасибо,
              это помогает проекту улучшать свою работу и лучше помогать
              предпринимателям!
            </p>
          </Alert>

          {/* Clarity */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2 fw-bold">Понятность результата</h6>
            {renderStars("clarity", rating.clarity)}
          </div>

          {/* Usefulness */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2 fw-bold">Полезность сервиса</h6>
            {renderStars("usefulness", rating.usefulness)}
          </div>

          {/* Accuracy */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2 fw-bold">Точность и логика</h6>
            {renderStars("accuracy", rating.accuracy)}
          </div>

          {/* Usability */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2 fw-bold">Удобство использования</h6>
            {renderStars("usability", rating.usability)}
          </div>

          {/* Speed */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2 fw-bold">Скорость генерации</h6>
            {renderStars("speed", rating.speed)}
          </div>

          {/* Design */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2 fw-bold">Оформление и структура</h6>
            {renderStars("design", rating.design)}
          </div>

          {/* Overall Rating */}
          <div
            className="mb-4 p-3 rounded"
            style={{ width: "100%", backgroundColor: "#f0f7fa" }}
          >
            <h6 className="small mb-2 text-center text-brand">
              <strong>Общая оценка</strong>
            </h6>
            <div className="d-flex w-100 justify-content-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{ fontSize: "1.8rem", color: "#ffd700" }}
                >
                  {star <= calculateOverallRating() ? "⭐" : "☆"}
                </span>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2 fw-bold">
              Насколько вероятно, что вы порекомендуете наш сервис друзьям?
            </h6>
            {renderStars("recommend", rating.recommend)}
          </div>

          {/* Price */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2 fw-bold">
              Сколько может по вашему стоить такая услуга при разовой оплате?
            </h6>
            <div className="d-flex flex-wrap gap-2" style={{ width: "100%" }}>
              {[5, 10, 15, 20, 25].map((price) => (
                <Button
                  key={price}
                  size="sm"
                  variant={
                    rating.price === price ? "primary" : "outline-secondary"
                  }
                  onClick={() => setRating({ ...rating, price })}
                  style={{
                    flex: "1 1 calc(33.333% - 0.5rem)",
                    borderRadius: "8px",
                    borderColor: rating.price === price ? "#1e6078" : "#ccc",
                    backgroundColor:
                      rating.price === price ? "#1e6078" : "transparent",
                  }}
                >
                  ${price}
                </Button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2 fw-bold">Ваш отзыв (по желанию)</h6>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Поделитесь своими впечатлениями..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              style={{ width: "100%", borderRadius: "10px", padding: "10px" }}
              disabled={status === "success"}
            />
          </div>

          {/* Submit Button & Messages */}
          <div className="d-grid gap-2">
            {status === "success" ? (
              <Alert
                variant="success"
                className="text-center py-3 border-0"
                style={{ borderRadius: "12px", backgroundColor: "#e8f5e9" }}
              >
                <div className="h4 mb-2">✅ Спасибо!</div>
                <div className="small">
                  Ваш отзыв получен и помогает нам становиться лучше.
                </div>
              </Alert>
            ) : (
              <>
                <Button
                  onClick={submitRatingAndFeedback}
                  disabled={
                    (!rating.clarity && !feedback) || status === "submitting"
                  }
                  className="contact-btn w-100"
                  style={{
                    backgroundColor: "#1e6078",
                    color: "white",
                    border: "none",
                    height: "48px",
                    borderRadius: "10px",
                    fontSize: "1rem",
                  }}
                >
                  {status === "submitting" ? "Отправка..." : "Отправить отзыв"}
                </Button>
                {status === "error" && (
                  <div className="text-danger small text-center mt-2">
                    {errorMessage}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
