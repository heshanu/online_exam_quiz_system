import { useState, useEffect, useCallback } from "react";
import QuizWelcome from "./quizwelcome";
import QuizQuestion from "./quizquestion";
import QuizResults from "./quizresult";
import { useToast } from "../hooks/use-toast";
import { Question } from "../models/question";

type QuizState = "welcome" | "quiz" | "results";

// Define processed question type
type ProcessedQuestion = Question & {
  processedOptions: string[];
};

export default function QuizApp() {
  const [currentState, setCurrentState] = useState<QuizState>("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(900);
  const { toast } = useToast();
  const [sampleQuestions, setSampleQuestions] = useState<ProcessedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sampleData, setSampleData] = useState<Question[]>([]);

  // For Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (currentState === "quiz") {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleFinishQuiz();
            return 0;
          }
          return prev - 1;
        });
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentState, startTime]); 

  // Fetch questions from supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/questions');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data: Question[] = await response.json();
        
        // Pre-process all questions
        const processed = data.map(q => ({
          ...q,
          processedOptions: q.options.split('\n').map((opt: string) => opt.trim())
        }));
        
        setSampleQuestions(processed);
        setSampleData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'An unknown error occurred',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStartQuiz = useCallback(() => {
    setCurrentState("quiz");
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setStartTime(Date.now());
    setTimeRemaining(900);
    setTimeElapsed(0);
    
    toast({
      title: "Quiz Started!",
      description: "Good luck with your JavaScript fundamentals quiz.",
    });
  }, [toast]);

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = answerIndex;
      return newAnswers;
    });
  }, [currentQuestionIndex]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, sampleQuestions.length]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const handleFinishQuiz = useCallback(() => {
    setCurrentState("results");
    toast({
      title: "Quiz Completed!",
      description: `You scored ${calculateScore()} out of ${sampleQuestions.length} questions.`,
    });
  }, [sampleQuestions.length, toast]);

  const handleRetakeQuiz = useCallback(() => {
    setCurrentState("welcome");
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTimeElapsed(0);
    setTimeRemaining(900);
  }, []);

  const handleBackToHome = useCallback(() => {
    setCurrentState("welcome");
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTimeElapsed(0);
    setTimeRemaining(900);
  }, []);

  const calculateScore = useCallback(() => {
    return userAnswers.reduce((total, answer, index) => {
      return total + (answer === sampleQuestions[index]?.correctAnswer ? 1 : 0);
    }, 0);
  }, [userAnswers, sampleQuestions]);

  // Show loading state
  if (isLoading) {
    return <div className="p-8 text-center">Loading questions...</div>;
  }

  if (currentState === "welcome") {
    return (
      <QuizWelcome
        onStartQuiz={handleStartQuiz}
        quizTitle="JavaScript Fundamentals Quiz"
        description="Test your knowledge of JavaScript basics including variables, functions, DOM manipulation, and core concepts."
        questionsCount={sampleQuestions.length}
        timeLimit={15}
        difficulty="Medium"
      />
    );
  }

  if (currentState === "quiz") {
    const currentQuestion = sampleQuestions[currentQuestionIndex];
    const selectedAnswer = userAnswers[currentQuestionIndex];

    return (
      <QuizQuestion
        question={currentQuestion}
        questionOptions={currentQuestion.processedOptions}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={sampleQuestions.length}
        selectedAnswer={selectedAnswer}
        onAnswerSelect={handleAnswerSelect}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onFinish={handleFinishQuiz}
        timeRemaining={timeRemaining}
        isFirstQuestion={currentQuestionIndex === 0}
        isLastQuestion={currentQuestionIndex === sampleQuestions.length - 1}
      />
    );
  }

  if (currentState === "results") {
    return (
      <QuizResults
        score={calculateScore()}
        totalQuestions={sampleQuestions.length}
        timeElapsed={timeElapsed}
        correctAnswers={sampleQuestions.map(q => q.correctAnswer)}
        userAnswers={userAnswers}
        questions={sampleData}
       
        onRetakeQuiz={handleRetakeQuiz}
        onBackToHome={handleBackToHome}
      />
    );
  }

  return null;
}