/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import QuizWelcome from "./quizwelcome";
import QuizQuestion from "./quizquestion";
import QuizResults from "./quizresult";
import { useToast } from "../hooks/use-toast";
import { Question } from "../models/question";

type QuizState = "welcome" | "quiz" | "results";

export default function QuizApp() {
  const [currentState, setCurrentState] = useState<QuizState>("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(900); // 15 minutes
  const { toast } = useToast();

  const [errors, setErrors] = useState(null);
  const [sampleQuestions, setQuestions] = useState<Question[]>([]);
  const [options2Array, setOpt] = useState<string[]>([]);

  // Timer effect
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

   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/questions');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data: Question[] = await response.json();
        setQuestions(data);

        if (data.length > 0 && data[currentQuestionIndex]?.options) {
          // Directly set the options to the state
          setOpt(
            data[currentQuestionIndex].options
              .map((option: string) => option.trim())
          );
        }
      } catch (error) {
          //setErrors();
      }
    };

    fetchData();
  }, [currentQuestionIndex]); // Include any other dependencies if necessary

  const handleStartQuiz = () => {
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
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinishQuiz = () => {
    setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    setCurrentState("results");
    
    const score = userAnswers.reduce((total, answer, index) => {
      return total + (answer === sampleQuestions[index].correctAnswer ? 1 : 0);
    }, 0);
    
    toast({
      title: "Quiz Completed!",
      description: `You scored ${score} out of ${sampleQuestions.length} questions.`,
    });
  };

  const handleRetakeQuiz = () => {
    setCurrentState("welcome");
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTimeElapsed(0);
    setTimeRemaining(900);
  };

  const handleBackToHome = () => {
    setCurrentState("welcome");
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTimeElapsed(0);
    setTimeRemaining(900);
  };

  const calculateScore = () => {
    return userAnswers.reduce((total, answer, index) => {
      return total + (answer === sampleQuestions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const currentQuestion = sampleQuestions[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQuestionIndex];

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
    return (
      <QuizQuestion
        question={currentQuestion}
        questionOption={options2Array}
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
        correctAnswers={sampleQuestions.map((q: { correctAnswer:number; }) => q.correctAnswer)}
        userAnswers={userAnswers}
        questions={sampleQuestions}
        onRetakeQuiz={handleRetakeQuiz}
        onBackToHome={handleBackToHome}
      />
    );
  }

  return errors;
}