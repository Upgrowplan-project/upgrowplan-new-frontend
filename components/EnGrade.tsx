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

export default function EnGrade({ sessionId }: GradeProps) {
  const [rating, setRating] = useState<Rating>({});
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
      ratings.reduce((sum, r) => sum + (r || 0), 0) / ratings.length
    );
  };

  const submitRatingAndFeedback = async () => {
    try {
      const overallRating = calculateOverallRating();
      const response = await fetch("http://localhost:8000/api/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...rating,
          overall: overallRating,
          feedback,
          session_id: sessionId,
        }),
      });

      if (response.ok) {
        alert("✅ Thank you for your feedback!");
        setRating({});
        setFeedback("");
      }
    } catch (error) {
      console.error("Error sending rating:", error);
    }
  };

  const renderStars = (
    category: keyof Rating,
    currentValue: number | undefined
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
    <Card className="shadow-sm h-100" style={{ borderRadius: "16px" }}>
      <Card.Header
        style={{
          backgroundColor: "transparent",
          border: "none",
          padding: "1.5rem 1.5rem 0",
        }}
      >
        <h5 className="text-brand mb-0">⭐ Rate the Service</h5>
      </Card.Header>
      <Card.Body
        style={{ maxHeight: "650px", overflowY: "auto", padding: "1.5rem" }}
      >
        <div style={{ width: "100%" }}>
          <Alert variant="light" className="mb-4" style={{ width: "100%" }}>
            <p className="small mb-2">
              🎁 The service is in beta and fully free!
            </p>
            <p className="small mb-0">
              We collect feedback - it is anonymous and confidential. You can
              rate the service after reviewing the result. Thank you, this helps
              improve the project for entrepreneurs! 🙏
            </p>
          </Alert>

          {/* Clarity */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2">Result Clarity</h6>
            {renderStars("clarity", rating.clarity)}
          </div>

          {/* Usefulness */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2">Service Usefulness</h6>
            {renderStars("usefulness", rating.usefulness)}
          </div>

          {/* Accuracy */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2">Accuracy and Logic</h6>
            {renderStars("accuracy", rating.accuracy)}
          </div>

          {/* Usability */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2">Ease of Use</h6>
            {renderStars("usability", rating.usability)}
          </div>

          {/* Speed */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2">Generation Speed</h6>
            {renderStars("speed", rating.speed)}
          </div>

          {/* Design */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2">Design and Structure</h6>
            {renderStars("design", rating.design)}
          </div>

          {/* Overall Rating */}
          <div className="mb-4 p-3 bg-light rounded" style={{ width: "100%" }}>
            <h6 className="small mb-2 text-center">
              <strong>Overall Rating</strong>
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
            <h6 className="small mb-2">
              How likely are you to recommend us to friends?
            </h6>
            {renderStars("recommend", rating.recommend)}
          </div>

          {/* Price */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2">
              What would be a fair price for this service (one-time)?
            </h6>
            <div className="d-flex flex-wrap gap-2" style={{ width: "100%" }}>
              {[5, 10, 15, 20, 25].map((price) => (
                <Button
                  key={price}
                  size="sm"
                  style={{ flex: "1 1 calc(33.333% - 0.5rem)" }}
                  variant={
                    rating.price === price ? "primary" : "outline-secondary"
                  }
                  onClick={() => setRating({ ...rating, price })}
                >
                  ${price}
                </Button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2">Your Feedback (optional)</h6>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Share your impressions..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          {/* Submit Button */}
          <Button
            variant="success"
            onClick={submitRatingAndFeedback}
            disabled={!rating.clarity && !feedback}
            style={{ width: "100%" }}
          >
            Submit Feedback
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
