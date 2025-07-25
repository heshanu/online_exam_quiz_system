import { useState, useEffect, useCallback } from "react";
import QuizWelcome from "./quizwelcome";
import QuizQuestion from "./quizquestion";
import QuizResults from "./quizresult";
import { useToast } from "../hooks/use-toast";
import { Question } from "../models/question";
import { useQuestionContext } from "../context/questionContext";
import { useNavigate } from "react-router-dom";

type QuizState = "welcome" | "quiz" | "results";

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
  const [sampleQuestions, setSampleQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sampleData, setSampleData] = useState<Question[]>([]);
  const [correctAnswersList, setCorrectAnswersList] = useState<number[]>([]);
  const { questions } = useQuestionContext();
  const navigate = useNavigate();
  
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
        setTimeElapsed(Date.now() - startTime);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentState, startTime]);

     const processData = (data: Question[]) => {
          return data.map(q => ({
            ...q,
            options: q.options.split('\n').map((opt: string) => opt.trim())
          }));
  };

  const fetchQuestionFromContext = async () => { 
        try {  
        setSampleQuestions(processData(questions));
        setSampleData(questions);
        setTimeout(() => { }, 2000);
        setCorrectAnswersList(questions.map(question => question.correctOptions));
      
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }

  // Fetch questions from supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchQuestionFromContext();
        console.log(questions);
          
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'An unknown error occurred',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionFromContext();
    fetchData();
  }, [questions]);

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

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

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

  const handleFinishQuiz = () => {
    setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    setCurrentState("results");
    
    const score = userAnswers.reduce((total, answer, index) => {
      return total + (answer === sampleQuestions[index].correctOptions ? 1 : 0);
    }, 0);
    
    toast({
      title: "Quiz Completed!",
      description: `You scored ${score} out of ${sampleQuestions.length} questions.`,
    });
  };

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
    navigate("/home")
  }, []);

  const calculateScore = () => {
    return userAnswers.reduce((total, answer, index) => {
      return total + (answer === sampleData[index].correctOptions ? 1 : 0);
    }, 0);
  };

  
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
          questionOptions={currentQuestion.options}
          question={currentQuestion}
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

  { console.log(correctAnswersList);
  }
  if (currentState === "results") {  
      return (
        <QuizResults
          score={calculateScore()}
          totalQuestions={questions.length}
          timeElapsed={timeElapsed}
          correctAnswers={correctAnswersList}
          userAnswers={userAnswers}
          questions={sampleQuestions}
          
          onRetakeQuiz={handleRetakeQuiz}
          onBackToHome={handleBackToHome}
        />
      );
    }

    return null;
  }
