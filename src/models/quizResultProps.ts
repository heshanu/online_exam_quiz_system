import { Question } from "./question";

export interface QuizResultsProps {
    score: number;
    totalQuestions: number;
    timeElapsed: number;
    correctAnswers: number[];
    userAnswers: number[];
    questions: Question[];
    onRetakeQuiz: () => void;
    onBackToHome: () => void;
}