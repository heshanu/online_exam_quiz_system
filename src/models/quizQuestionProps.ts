import { Question } from "./question";

export interface QuizQuestionProps {
    question: Question;
    questionOption: string[];
    currentQuestionIndex: number;
    totalQuestions: number;
    selectedAnswer?: number;
    onAnswerSelect: (answerIndex: number) => void;
    onNext: () => void;
    onPrevious: () => void;
    onFinish: () => void;
    timeRemaining?: number;
    isFirstQuestion: boolean;
    isLastQuestion: boolean;
}