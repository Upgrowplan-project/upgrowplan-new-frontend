// Static blog posts data
// These posts are pre-loaded and displayed immediately
// New posts from the database will be added dynamically

export interface Post {
    id: number;
    message: string;
    createdAt: string;
    mediaUrl?: string;
    forwardAuthor?: string;
}

export const staticPostsRu: Post[] = [
    {
        id: 1,
        message: `🚀 Добро пожаловать в блог Upgrowplan!

Здесь мы делимся реальным опытом в бизнес-планировании, финансовом моделировании и развитии бизнеса.

Что вы найдете:
• Практические кейсы из наших проектов
• Чек-листы для запуска бизнеса
• Аналитика рынков и трендов
• Инсайты по работе с AI в бизнесе
• Советы по привлечению инвестиций

Подписывайтесь на наши каналы, чтобы не пропустить новые материалы!`,
        createdAt: "2025-01-20T10:00:00Z",
    },
];

export const staticPostsEn: Post[] = [
    {
        id: 1,
        message: `🚀 Welcome to the Upgrowplan Blog!

Here we share real-world experience in business planning, financial modeling, and business development.

What you'll find:
• Practical case studies from our projects
• Checklists for launching a business
• Market analysis and trends
• Insights on using AI in business
• Tips for attracting investments

Subscribe to our channels to stay updated with new content!`,
        createdAt: "2025-01-20T10:00:00Z",
    },
];
