import { Card, Row, Col, Badge, Accordion } from "react-bootstrap";
import { Persona } from "../types";

interface PersonaDisplayProps {
  personas: Persona[];
}

export default function PersonaDisplay({ personas }: PersonaDisplayProps) {
  if (!personas || personas.length === 0) {
    return null;
  }

  const russiaPersonas = personas.filter((p) => p.segment === "russia");
  const abroadPersonas = personas.filter((p) => p.segment === "abroad");

  const renderPersonaCard = (persona: Persona, index: number) => (
    <Card key={persona.id} className="mb-3 shadow-sm">
      <Card.Header style={{ backgroundColor: "#1e6078", color: "white" }}>
        <h5 className="mb-0">
          {persona.name}
          <Badge bg="light" text="dark" className="ms-2">
            {persona.segment === "russia" ? "Россия" : "За рубежом"}
          </Badge>
        </h5>
      </Card.Header>
      <Card.Body>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Демография</Accordion.Header>
            <Accordion.Body>
              <ul className="mb-0">
                {persona.demographics.age_range && (
                  <li><strong>Возраст:</strong> {persona.demographics.age_range}</li>
                )}
                {persona.demographics.income_level && (
                  <li><strong>Доход:</strong> {persona.demographics.income_level}</li>
                )}
                {persona.demographics.education && (
                  <li><strong>Образование:</strong> {persona.demographics.education}</li>
                )}
                {persona.demographics.occupation && (
                  <li><strong>Род деятельности:</strong> {persona.demographics.occupation}</li>
                )}
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Задачи</Accordion.Header>
            <Accordion.Body>
              <ul className="mb-0">
                {persona.tasks.map((task, i) => (
                  <li key={i}>{task}</li>
                ))}
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>Проблемы</Accordion.Header>
            <Accordion.Body>
              <ul className="mb-0">
                {persona.problems.map((problem, i) => (
                  <li key={i}>{problem}</li>
                ))}
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header>Боли</Accordion.Header>
            <Accordion.Body>
              <ul className="mb-0">
                {persona.pains.map((pain, i) => (
                  <li key={i}>{pain}</li>
                ))}
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="4">
            <Accordion.Header>Возражения</Accordion.Header>
            <Accordion.Body>
              <ul className="mb-0">
                {persona.objections.map((objection, i) => (
                  <li key={i}>{objection}</li>
                ))}
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="5">
            <Accordion.Header>Критерии принятия решения</Accordion.Header>
            <Accordion.Body>
              <ul className="mb-0">
                {persona.decision_criteria.map((criterion, i) => (
                  <li key={i}>{criterion}</li>
                ))}
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="6">
            <Accordion.Header>Источники информации</Accordion.Header>
            <Accordion.Body>
              <ul className="mb-0">
                {persona.info_sources.map((source, i) => (
                  <li key={i}>{source}</li>
                ))}
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="7">
            <Accordion.Header>Лидеры мнений</Accordion.Header>
            <Accordion.Body>
              <ul className="mb-0">
                {persona.opinion_leaders.map((leader, i) => (
                  <li key={i}>{leader}</li>
                ))}
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card.Body>
    </Card>
  );

  return (
    <div className="mb-4">
      <h4 className="mb-4" style={{ color: "#1e6078" }}>
        Сгенерированные Buyer Persona
      </h4>

      {russiaPersonas.length > 0 && (
        <>
          <h5 className="mb-3">Русскоязычный сегмент внутри России</h5>
          {russiaPersonas.map((persona, index) => renderPersonaCard(persona, index))}
        </>
      )}

      {abroadPersonas.length > 0 && (
        <>
          <h5 className="mb-3 mt-4">Русскоязычный сегмент вне России</h5>
          {abroadPersonas.map((persona, index) => renderPersonaCard(persona, index))}
        </>
      )}
    </div>
  );
}
