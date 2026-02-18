
import { CurriculumItem, QuestionBlockData, QuizBlockData } from '../types';

/**
 * Generates a summary quiz based on the provided curriculum content.
 * The number of questions is proportional to the amount of practice material,
 * capped at 20 questions.
 */
export const generateSummaryQuiz = (
    moduleItems: CurriculumItem[],
    quizId: string,
    chapterTitle: string
): QuizBlockData & { type: 'quiz' } => {
    // 1. Identify all practice questions in the module
    const practiceQuestions = moduleItems.filter(
        item => item.type === 'question'
    ) as (QuestionBlockData & { type: 'question' })[];

    // 2. Determine Quiz Size
    // Logic: Use 100% of questions up to 5, then 50% of the rest, max 20.
    // Or simpler: Math.min(20, Math.max(5, Math.ceil(practiceQuestions.length * 0.8)))
    // If we have 5 questions -> 5.
    // If we have 10 questions -> 8.
    // If we have 30 questions -> 20.

    // User said: "ha több az anyag akkor több kérdés legyen de max 20"
    // Let's try to map "material" (questions) to quiz size.
    // A safe bet is: use ALL unique questions available, up to 20.
    // Why filter? The summary quiz is supposed to test everything.
    // If there are 50 questions, pick 20 random.
    // If there are 10 questions, pick all 10.
    const maxQuestions = 20;
    const targetSize = Math.min(maxQuestions, practiceQuestions.length);

    // 3. Select Questions
    const selectedIndices = new Set<number>();
    while (selectedIndices.size < targetSize) {
        const idx = Math.floor(Math.random() * practiceQuestions.length);
        selectedIndices.add(idx);
    }

    const quizQuestions = Array.from(selectedIndices).map(idx => {
        const original = practiceQuestions[idx];

        // If the question has a generator, use it to get a fresh instance
        // This prevents the quiz from being identical to what they just solved
        if (original.generate) {
            const generated = original.generate();
            return {
                // Fallback to original properties if not provided by generator
                options: original.options,
                matchPairs: original.matchPairs,
                illustration: original.illustration,
                hint: original.hint,
                explanation: original.explanation,
                // Override with generated properties
                ...generated,
                inputType: original.inputType, // ensuring type is preserved
            };
        }

        // Fallback: Clone the static question
        return {
            question: original.question,
            inputType: original.inputType,
            options: original.options,
            correctAnswer: original.correctAnswer,
            hint: original.hint,
            explanation: original.explanation,
            illustration: original.illustration,
            matchPairs: original.matchPairs, // Critical for matching questions
            // Exclude ID and other block-specific props
        };
    });

    return {
        id: quizId,
        type: 'quiz',
        chapter: chapterTitle,
        title: 'Összefoglaló kvíz (opcionális)',
        questions: quizQuestions as any, // Cast to avoid strict type mismatch if QuestionBlockData vs QuizQuestionData differs slightly
        description: `Ebből a fejezetből ${practiceQuestions.length} gyakorló feladat van. A kvíz most ${targetSize} kérdést tartalmaz ezek alapján.`
    };
};
