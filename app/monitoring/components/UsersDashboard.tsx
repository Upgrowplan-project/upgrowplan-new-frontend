"use client";

import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Col, Form, Row, Spinner, Table } from "react-bootstrap";
import { monitoringFetch } from "../lib/api";

type UserStats = {
  total_users: number;
  new_24h: number;
  new_7d: number;
  new_30d: number;
  verified: number;
  active_7d: number;
};

type ManagedUser = {
  id: number;
  email: string;
  fullName: string | null;
  role: "ADMIN" | "MANAGER" | "USER" | string;
  active: boolean;
  emailVerified: boolean;
  createdAt: string | null;
  lastLoginAt: string | null;
  provider: string | null;
};

type UserPage = {
  content: ManagedUser[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

const PAGE_SIZE = 25;

const Stat: React.FC<{ title: string; value: number | string }> = ({ title, value }) => (
  <Card className="border-0 shadow-sm h-100 text-center">
    <Card.Body>
      <div className="small text-muted mb-1">{title}</div>
      <div className="fs-3 fw-bold text-brand">{value}</div>
    </Card.Body>
  </Card>
);

function dateLabel(value: string | null): string {
  return value ? new Date(value).toLocaleString() : "—";
}

export const UsersDashboard: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [pageData, setPageData] = useState<UserPage | null>(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [statsUnavailable, setStatsUnavailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [reload, setReload] = useState(0);

  const loadData = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    setError(null);
    const query = new URLSearchParams({
      page: String(page),
      size: String(PAGE_SIZE),
      search: appliedSearch,
    });
    try {
      const [statsResponse, usersResponse] = await Promise.all([
        monitoringFetch("/api/monitoring/user-stats", { signal }),
        monitoringFetch(`/api/monitoring/users?${query.toString()}`, { signal }),
      ]);
      if (signal.aborted) return;

      const statsBody = await statsResponse.json();
      if (statsResponse.ok && statsBody.stats) {
        setStats(statsBody.stats);
        setStatsUnavailable(false);
      } else {
        setStatsUnavailable(true);
      }

      const usersBody = await usersResponse.json();
      if (!usersResponse.ok) {
        throw new Error(usersBody.detail?.message || usersBody.detail || "Не удалось загрузить список пользователей");
      }
      setPageData(usersBody);
    } catch (err) {
      if (!signal.aborted) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки пользователей");
      }
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [page, appliedSearch]);

  useEffect(() => {
    const controller = new AbortController();
    void loadData(controller.signal);
    return () => controller.abort();
  }, [loadData, reload]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(0);
    setAppliedSearch(search.trim());
  };

  const handleStatusChange = async (user: ManagedUser) => {
    setSavingId(user.id);
    setError(null);
    try {
      const response = await monitoringFetch(`/api/monitoring/users/${user.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !user.active }),
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.detail?.message || body.detail || "Не удалось изменить статус пользователя");
      }
      setPageData((current) => current && ({
        ...current,
        content: current.content.map((item) => item.id === user.id ? body : item),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка изменения статуса");
    } finally {
      setSavingId(null);
    }
  };

  const maxPage = Math.max((pageData?.totalPages ?? 1) - 1, 0);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div>
          <h4 className="mb-1 text-brand">👥 Пользователи</h4>
          <div className="small text-muted">Регистрации, роли и состояние аккаунтов</div>
        </div>
        <Button variant="outline-secondary" size="sm" onClick={() => setReload((value) => value + 1)} disabled={loading}>
          Обновить
        </Button>
      </div>

      {statsUnavailable && (
        <Alert variant="warning" className="py-2">
          Список пользователей доступен, но агрегированная статистика регистраций не загрузилась.
        </Alert>
      )}
      {error && <Alert variant="danger" className="py-2">{error}</Alert>}

      <Row className="g-3 mb-4">
        <Col xl={2} md={4} xs={6}><Stat title="Всего пользователей" value={stats?.total_users ?? "—"} /></Col>
        <Col xl={2} md={4} xs={6}><Stat title="Регистрации за 24 ч" value={stats?.new_24h ?? "—"} /></Col>
        <Col xl={2} md={4} xs={6}><Stat title="За 7 дней" value={stats?.new_7d ?? "—"} /></Col>
        <Col xl={2} md={4} xs={6}><Stat title="За 30 дней" value={stats?.new_30d ?? "—"} /></Col>
        <Col xl={2} md={4} xs={6}><Stat title="Подтвердили email" value={stats?.verified ?? "—"} /></Col>
        <Col xl={2} md={4} xs={6}><Stat title="Активны за 7 дней" value={stats?.active_7d ?? "—"} /></Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h6 className="mb-0">Список зарегистрированных пользователей</h6>
            <Form className="d-flex gap-2" onSubmit={handleSearch} role="search">
              <Form.Control
                size="sm"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Имя или email"
                aria-label="Поиск по имени или email"
              />
              <Button size="sm" variant="outline-primary" type="submit">Найти</Button>
            </Form>
          </div>
        </Card.Header>
        <div className="table-responsive">
          <Table hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Пользователь</th>
                <th>Роль</th>
                <th>Регистрация</th>
                <th>Email</th>
                <th>Последний вход</th>
                <th>Состояние</th>
              </tr>
            </thead>
            <tbody>
              {pageData?.content.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="fw-semibold">{user.fullName || user.email}</div>
                    {user.fullName && <div className="small text-muted">{user.email}</div>}
                    {user.provider && <div className="small text-muted">{user.provider}</div>}
                  </td>
                  <td><Badge bg={user.role === "ADMIN" ? "warning" : user.role === "MANAGER" ? "info" : "secondary"}>{user.role}</Badge></td>
                  <td className="small text-nowrap">{dateLabel(user.createdAt)}</td>
                  <td><Badge bg={user.emailVerified ? "success" : "secondary"}>{user.emailVerified ? "Подтверждён" : "Не подтверждён"}</Badge></td>
                  <td className="small text-nowrap">{dateLabel(user.lastLoginAt)}</td>
                  <td>
                    <Form.Check
                      type="switch"
                      label={user.active ? "Активен" : "Отключён"}
                      checked={user.active}
                      disabled={savingId === user.id || user.role === "ADMIN"}
                      onChange={() => void handleStatusChange(user)}
                      title={user.role === "ADMIN" ? "Статус администратора здесь изменить нельзя" : undefined}
                    />
                  </td>
                </tr>
              ))}
              {!loading && pageData?.content.length === 0 && (
                <tr><td colSpan={6} className="text-center text-muted py-4">Пользователи не найдены</td></tr>
              )}
              {loading && (
                <tr><td colSpan={6} className="text-center text-muted py-4"><Spinner size="sm" className="me-2" />Загрузка пользователей…</td></tr>
              )}
            </tbody>
          </Table>
        </div>
        <Card.Footer className="bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span className="small text-muted">
            {pageData ? `Показано ${pageData.content.length} из ${pageData.totalElements}` : "Загрузка списка…"}
          </span>
          <div className="d-flex align-items-center gap-2">
            <Button size="sm" variant="outline-secondary" disabled={page <= 0 || loading} onClick={() => setPage((value) => value - 1)}>Назад</Button>
            <span className="small text-muted">Страница {page + 1} из {Math.max(pageData?.totalPages ?? 1, 1)}</span>
            <Button size="sm" variant="outline-secondary" disabled={!pageData || page >= maxPage || loading} onClick={() => setPage((value) => value + 1)}>Далее</Button>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};
