/**
 * TypeScript types for Synth Focus Lab
 */

export interface ResearchRequest {
    product_description: string;
    location: string;
    respondents_per_persona?: number;
    hypothesis_text?: string;
    personas_count?: number;  // NEW: Number of personas to generate (default: 5)
    max_questions?: number;   // NEW: Maximum questions in survey (default: 12)
    industry_category?: string;  // NEW: Hard filter for category (15 options)
    target_audience_type?: string;  // NEW: B2B/B2C/B2B2C
    research_goals?: string[];  // NEW: Array of research goals (min 3)
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
    hypothesis_text?: string;  // NEW: Optional hypothesis field
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
    scale_instruction?: string;
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
    // New fields for Unified Report
    global_themes?: Array<{
        theme: string;
        count: number;
        representative_quotes: string[];
    }>;
    segment_analytics?: Array<{
        persona_name: string;
        stats: any;
        themes: any[];
        profile: {
            description: string;
            core_pain: string;
            motivations: string[];
            barriers: string[];
            trigger: string;
            strategy: string;
        };
    }>;
    // [STAGE 9.1] Executive Summary Professional Re-interpretation
    executive_summary_details?: {
        original_request: string;
        location: string;
        industry_vertical: string;
        business_model: string;
        usp: string;
        growth_hypothesis: string;
        marketing_summary: string;
    };
    // [STAGE 9.2] Devil's Advocate Market Saturation Analysis
    market_saturation?: {
        saturation_level: string;
        survival_probability: number;
        red_ocean_analysis: string;
        bottleneck_opportunity: string | null;
        pivot_recommendation: string | null;
        devils_advocate_summary: string;
    };
    // [STAGE 9.3] Advanced Visualizations
    advanced_visualizations?: {
        triggers_barriers_heatmap: string;
        innovation_adoption_curve: {
            curve_text: string;
            distribution: {
                innovators: number;
                early_adopters: number;
                early_majority: number;
                late_majority: number;
                laggards: number;
            };
            insights: string[];
        };
        gold_nuggets: Array<{
            insight: string;
            why_unique: string;
            action: string;
        }>;
    };
    // [STAGE 10.1] Targeted Insights Pipeline
    targeted_insights?: {
        insights_by_goal: {
            [key: string]: {
                goal: string;
                search_query: string;
                search_results: Array<{
                    title: string;
                    url: string;
                    snippet: string;
                }>;
                analysis: string;
                extracted_entities: {
                    company_names: string[];
                    locations: string[];
                    prices: string[];
                };
            };
        };
        validation_report: {
            passed: string[];
            failed: Array<{
                goal: string;
                errors: string[];
            }>;
            warnings: Array<{
                goal?: string;
                error: string;
            }>;
        };
    };
}

export interface ResearchDetail {
    research: ResearchStatusResponse;
    personas: Persona[];
    questions: Question[];
    report?: Report;
}
