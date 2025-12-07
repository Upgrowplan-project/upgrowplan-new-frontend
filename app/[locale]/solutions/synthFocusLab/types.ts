/**
 * TypeScript types for Synth Focus Lab
 */

export interface ResearchRequest {
    product_description: string;
    location: string;
    respondents_per_persona?: number;
}

export enum ResearchStatus {
    PENDING = "pending",
    GENERATING_PERSONAS = "generating_personas",
    CREATING_RESPONDENTS = "creating_respondents",
    GENERATING_QUESTIONS = "generating_questions",
    CONDUCTING_SURVEY = "conducting_survey",
    GENERATING_REPORT = "generating_report",
    COMPLETED = "completed",
    FAILED = "failed",
}

export interface Persona {
    id: number;
    name: string;
    segment: string;
    demographics: {
        age_range?: string;
        income_level?: string;
        education?: string;
        occupation?: string;
        location_specifics?: string;
    };
    tasks: string[];
    problems: string[];
    pains: string[];
    objections: string[];
    decision_criteria: string[];
    info_sources: string[];
    opinion_leaders: string[];
}

export interface ResearchStatusResponse {
    id: number;
    product_description: string;
    location: string;
    status: ResearchStatus;
    error_message?: string;
    created_at: string;
    updated_at: string;
    completed_at?: string;
    personas_count: number;
    respondents_count: number;
}

export interface Question {
    id: number;
    category: string;
    text: string;
    question_type: string;
    options?: string[];
    order: number;
}

export interface Report {
    id: number;
    research_id: number;
    executive_summary: string;
    persona_insights: {
        total_personas: number;
        segments: Record<string, any[]>;
        common_pains: string[];
        common_objections: string[];
        key_decision_criteria: string[];
    };
    survey_results: any;
    price_analysis: any;
    motivation_analysis: any;
    readiness_analysis: any;
    recommendations: string[];
    created_at: string;
}

export interface ResearchDetail {
    research: ResearchStatusResponse;
    personas: Persona[];
    questions: Question[];
    report?: Report;
}
