
"use client";

import { Card, Button } from "react-bootstrap";
import { FiDownload, FiPrinter } from "react-icons/fi";

interface FullReportViewProps {
  htmlContent: string;
  onDownloadMarkdown?: () => void;
}

export default function FullReportView({ htmlContent, onDownloadMarkdown }: FullReportViewProps) {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <Card className="shadow-sm mt-4 border-0">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
        <h5 className="mb-0 text-primary">📄 Полный Отчет для Клиента</h5>
        <div className="btn-group">
          <Button variant="outline-secondary" size="sm" onClick={handlePrint}>
            <FiPrinter className="me-2" /> Печать / PDF
          </Button>
          {onDownloadMarkdown && (
            <Button variant="outline-secondary" size="sm" onClick={onDownloadMarkdown}>
              <FiDownload className="me-2" /> Markdown
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <div 
            className="p-5 bg-white"
            style={{ minHeight: "800px" }} 
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
      </Card.Body>
    </Card>
  );
}
