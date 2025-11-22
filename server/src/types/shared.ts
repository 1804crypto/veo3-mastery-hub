export interface VEO3Prompt {
    veo3_prompt: string;
    style_references: string[];
    technical_specifications: string;
    production_parameters: string;
    narrative_summary: string;
}

export interface VEO3InnerPrompt {
    Subject: string;
    Action: string;
    Scene: string;
    Style: string;
    Dialogue: string;
    Sounds: string;
    Technical: string;
}

export interface PromptHistoryItem {
    id: string;
    createdAt: string;
    idea: string;
    prompt: VEO3Prompt;
}
