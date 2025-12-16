
import { Card, Table, Badge, Accordion } from "react-bootstrap";
import { Question } from "../types";
import { FiList, FiHelpCircle, FiCheckSquare, FiMessageSquare } from "react-icons/fi";

interface QuestionnaireDisplayProps {
  questions: Question[];
}

export default function QuestionnaireDisplay({ questions }: QuestionnaireDisplayProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "scale": return <FiList className="text-primary" />;
      case "choice": return <FiCheckSquare className="text-success" />;
      case "open": return <FiMessageSquare className="text-warning" />;
      default: return <FiHelpCircle className="text-secondary" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "scale": return "Шкала (1-5)";
      case "choice": return "Выбор варианта";
      case "open": return "Открытый вопрос";
      default: return type;
    }
  };

  return (
    <Card className="shadow-sm mb-4 border-0">
      <Card.Header className="bg-light d-flex align-items-center">
        <FiList className="me-2 text-primary" />
        <strong>Анкета респондента</strong>
      </Card.Header>
      <Card.Body className="p-0">
        <Accordion flush>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Показать вопросы анкеты ({questions.length})</Accordion.Header>
            <Accordion.Body>
              <Table hover responsive className="mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Тип</th>
                    <th>Вопрос</th>
                    <th>Опции / Шкала</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q) => (
                    <tr key={q.id}>
                      <td>{q.order}</td>
                      <td>
                        <Badge bg="light" text="dark" className="d-flex align-items-center gap-2">
                          {getIcon(q.question_type)}
                          {getTypeLabel(q.question_type)}
                        </Badge>
                      </td>
                      <td>{q.text}</td>
                      <td>
                        <small className="text-muted">
                          {q.question_type === "scale" && q.scale_instruction}
                          {q.question_type === "choice" && q.options?.join(", ")}
                          {q.question_type === "open" && "(Текстовый ответ)"}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card.Body>
    </Card>
  );
}
