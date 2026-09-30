"use client";

import React, { useState } from "react";
import { Badge, Card } from "react-bootstrap";

// Свёрнутый по умолчанию блок со списком: заголовок-переключатель + содержимое.
export const CollapsibleCard: React.FC<{ title: string; count: number; children: React.ReactNode }> = ({
  title,
  count,
  children,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Card className="shadow-sm mb-3">
      <Card.Header
        as="button"
        type="button"
        className="small fw-semibold d-flex justify-content-between align-items-center text-start border-0 w-100 bg-light"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{title} <Badge bg="secondary" className="ms-1">{count}</Badge></span>
        <span className="text-muted fw-normal">{open ? "▾ Скрыть" : "▸ Показать"}</span>
      </Card.Header>
      {open && children}
    </Card>
  );
};
