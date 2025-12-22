/**
 * API Client for Synth Focus Lab Backend
 */

import {
    ResearchRequest,
    ResearchStatusResponse,
    Persona,
    Question,
    Report,
    ResearchDetail,
} from "../types";

// UPDATED: Use port 8003 for Synth Focus Lab backend
const API_BASE_URL = process.env.NEXT_PUBLIC_SYNTH_API_URL || "http://localhost:8003";

class SynthFocusLabAPI {
    /**
     * Create new research
     */
    async createResearch(request: ResearchRequest): Promise<ResearchStatusResponse> {
        const response = await fetch(`${API_BASE_URL}/api/research`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: "Unknown error" }));
            throw new Error(error.detail || `HTTP ${response.status}`);
        }

        return response.json();
    }

    /**
     * Get research status
     */
    async getResearchStatus(researchId: number): Promise<ResearchStatusResponse> {
        const response = await fetch(`${API_BASE_URL}/api/research/${researchId}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
    }

    /**
     * Get research personas
     */
    async getPersonas(researchId: number): Promise<Persona[]> {
        const response = await fetch(`${API_BASE_URL}/api/research/${researchId}/personas`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
    }

    /**
     * Get research questions
     */
    async getQuestions(researchId: number): Promise<Question[]> {
        const response = await fetch(`${API_BASE_URL}/api/research/${researchId}/questions`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
    }

    /**
     * Get research report
     */
    async getReport(researchId: number): Promise<Report> {
        const response = await fetch(`${API_BASE_URL}/api/research/${researchId}/report`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
    }

    /**
     * Generate research report (new LLM-based generation)
     */
    async generateReport(researchId: number): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/research/${researchId}/generate-report`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: "Unknown error" }));
            throw new Error(error.detail || `HTTP ${response.status}`);
        }

        return response.json();
    }

    /**
     * Get complete research details
     */
    async getResearchDetail(researchId: number): Promise<ResearchDetail> {
        const response = await fetch(`${API_BASE_URL}/api/research/${researchId}/detail`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
    }

    /**
     * Poll research status until completed or failed
     */
    async pollResearchStatus(
        researchId: number,
        onProgress?: (status: ResearchStatusResponse) => void,
        maxAttempts: number = 1440,  // 1440 attempts = 2 hours (1440 * 5s = 7200s)
        intervalMs: number = 5000
    ): Promise<ResearchStatusResponse> {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const status = await this.getResearchStatus(researchId);

            if (onProgress) {
                onProgress(status);
            }

            if (status.status === "completed" || status.status === "failed") {
                return status;
            }

            // Wait before next poll
            await new Promise((resolve) => setTimeout(resolve, intervalMs));
        }

        throw new Error("Research polling timeout");
    }

    /**
     * Get unified segment analytics (Stage C1)
     */
    async getSegmentAnalytics(researchId: number): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/research/${researchId}/analytics/segments`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    }

    /**
     * Get final unified report HTML/Markdown (Stage C2)
     */
    async getFinalReport(researchId: number, format: "html" | "markdown" = "html"): Promise<string> {
        const response = await fetch(`${API_BASE_URL}/api/research/${researchId}/report/final?format=${format}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
    }

    /**
     * Stop running research
     */
    async stopResearch(researchId: number): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/research/${researchId}/stop`, {
            method: "POST",
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    }

    /**
     * Export research data as CSV/JSON (Stage B1)
     */
    async exportResearchData(researchId: number, format: "csv" | "json" = "csv"): Promise<Blob> {
        const response = await fetch(`${API_BASE_URL}/api/research/${researchId}/export/${format}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.blob();
    }

    /**
     * Export research report as DOCX
     */
    async exportReportDocx(researchId: number): Promise<Blob> {
        const response = await fetch(`${API_BASE_URL}/api/research/${researchId}/export/docx`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.blob();
    }

    /**
     * Export research report as PDF
     */
    async exportReportPdf(researchId: number): Promise<Blob> {
        const response = await fetch(`${API_BASE_URL}/api/research/${researchId}/export/pdf`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.blob();
    }
}

export const synthAPI = new SynthFocusLabAPI();
