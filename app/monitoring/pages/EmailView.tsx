"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Card, Button, Spinner, Alert, Form } from "react-bootstrap";
import Header from "@/components/Header";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_MONITORING_API_URL || "http://localhost:8000";

export default function EmailView() {
  const router = useRouter();
  // Next.js pages approach: parse id from pathname
  const [email, setEmail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    const parts = path.split("/");
    const id = parts[parts.length - 1];
    if (!id) {
      setError("Missing email id in URL");
      setLoading(false);
      return;
    }

    const fetchEmail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/monitoring/emails/${id}`);
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
  }, []);

  const handleReply = async () => {
    if (!email) return;
    setSending(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/monitoring/emails/${email.id}/reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: replyBody }),
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      alert("Reply sent");
      setReplyBody("");
    } catch (err) {
      console.error("Error sending reply:", err);
      alert("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Header />
      <Container className="py-4">
        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {email && (
          <Card>
            <Card.Header>
              <h5>{email.subject}</h5>
              <div className="text-muted small">
                From: {email.from} • To: {email.to}
              </div>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <pre style={{ whiteSpace: "pre-wrap" }}>{email.body_text}</pre>
              </div>

              <hr />

              <h6>Reply</h6>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                  />
                </Form.Group>
                <Button onClick={handleReply} disabled={sending || !replyBody}>
                  {sending ? "Sending..." : "Send Reply"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
}
