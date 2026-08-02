"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Card, Button, Spinner, Alert, Form, Badge } from "react-bootstrap";
import Link from "next/link";
import Header from "@/components/Header";
import { monitoringFetch } from "@/app/monitoring/lib/api";

export default function EmailView() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  const [email, setEmail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [sending, setSending] = useState(false);
  const [replySent, setReplySent] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Missing email id in URL");
      setLoading(false);
      return;
    }

    const fetchEmail = async () => {
      try {
        setLoading(true);
        const res = await monitoringFetch(`/api/monitoring/emails/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setEmail(json);
      } catch (err) {
        console.error("Error fetching email:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchEmail();
  }, [id]);

  const handleReply = async () => {
    if (!email) return;
    setSending(true);
    setReplyError(null);
    try {
      const res = await monitoringFetch(
        `/api/monitoring/emails/${email.id}/reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: replyBody }),
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setReplySent(true);
      setReplyBody("");
    } catch (err) {
      console.error("Error sending reply:", err);
      setReplyError(err instanceof Error ? err.message : "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const backHref = typeof window !== "undefined" && window.location.pathname.startsWith("/ru")
    ? "/monitoring"
    : "/monitoring";

  return (
    <>
      <Header />
      <Container className="py-4" style={{ maxWidth: 760 }}>
        <div className="mb-3">
          <Link href={backHref} className="text-decoration-none text-muted small">
            ← Назад к почте
          </Link>
        </div>

        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {email && (
          <>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-bottom py-3">
                <h5 className="mb-1" style={{ color: "#1e6078" }}>
                  {email.subject || "(no subject)"}
                </h5>
                <div className="d-flex gap-3 flex-wrap text-muted small">
                  <span><strong>От:</strong> {email.from}</span>
                  {email.to && <span><strong>Кому:</strong> {email.to}</span>}
                  {email.received_at && (
                    <span>{new Date(email.received_at).toLocaleString()}</span>
                  )}
                  <Badge bg={email.status === "new" ? "danger" : "secondary"}>
                    {email.status}
                  </Badge>
                </div>
              </Card.Header>
              <Card.Body>
                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "0.95rem" }}>
                  {email.body_text || "(пустое письмо)"}
                </pre>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-bottom py-3">
                <h6 className="mb-0" style={{ color: "#1e6078" }}>↩ Ответить</h6>
              </Card.Header>
              <Card.Body>
                {replySent && (
                  <Alert variant="success" className="py-2">
                    ✓ Ответ отправлен
                  </Alert>
                )}
                {replyError && (
                  <Alert variant="danger" className="py-2">
                    Ошибка: {replyError}
                  </Alert>
                )}
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Текст ответа..."
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                  />
                </Form.Group>
                <Button
                  onClick={handleReply}
                  disabled={sending || !replyBody.trim()}
                  style={{ backgroundColor: "#1e6078", borderColor: "#1e6078" }}
                >
                  {sending ? (
                    <><Spinner as="span" size="sm" animation="border" className="me-2" />Отправка...</>
                  ) : (
                    "Отправить ответ"
                  )}
                </Button>
              </Card.Body>
            </Card>
          </>
        )}
      </Container>
    </>
  );
}
