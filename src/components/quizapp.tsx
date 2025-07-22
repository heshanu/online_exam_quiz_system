import { useState, useEffect } from "react";
import QuizWelcome from "./quizwelcome";
import QuizQuestion from "./quizquestion";
import QuizResults from "./quizresult";
import { useToast } from "../hooks/use-toast";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "What is the correct syntax for creating a function in JavaScript?",
    options: [
      "function myFunction() {}",
      "create myFunction() {}",
      "function = myFunction() {}",
      "def myFunction() {}"
    ],
    correctAnswer: 0
  },
  {
    id: 2,
    question: "Which method is used to add an element to the end of an array?",
    options: [
      "append()",
      "push()",
      "add()",
      "insert()"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "What does 'DOM' stand for?",
    options: [
      "Document Object Model",
      "Data Object Management",
      "Dynamic Object Method",
      "Document Oriented Markup"
    ],
    correctAnswer: 0
  },
  {
    id: 4,
    question: "Which of the following is NOT a JavaScript data type?",
    options: [
      "String",
      "Boolean",
      "Float",
      "Number"
    ],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "How do you declare a variable in JavaScript?",
    options: [
      "var variableName;",
      "let variableName;",
      "const variableName = value;",
      "All of the above"
    ],
    correctAnswer: 3
  },
  {
    id: 6,
    question: "What is the output of: console.log(typeof null)?",
    options: [
      "null",
      "undefined",
      "object",
      "boolean"
    ],
    correctAnswer: 2
  },
  {
    id: 7,
    question: "Which operator is used for strict equality comparison?",
    options: [
      "==",
      "===",
      "=",
      "!="
    ],
    correctAnswer: 1
  },
  {
    id: 8,
    question: "What is the purpose of the 'use strict' directive?",
    options: [
      "Makes JavaScript run faster",
      "Enables strict mode for cleaner code",
      "Prevents errors from being thrown",
      "Allows newer JavaScript features"
    ],
    correctAnswer: 1
  },
  {
    id: 9,
    question: "Which method converts a string to lowercase?",
    options: [
      "toLowerCase()",
      "toLower()",
      "lower()",
      "stringToLower()"
    ],
    correctAnswer: 0
  },
  {
    id: 10,
    question: "What is a closure in JavaScript?",
    options: [
      "A way to close the browser",
      "A function with access to outer scope variables",
      "A method to end a program",
      "A type of loop"
    ],
    correctAnswer: 1
  }
];

type QuizState = "welcome" | "quiz" | "results";

export default function QuizApp() {
  const [currentState, setCurrentState] = useState<QuizState>("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(900); // 15 minutes
  const { toast } = useToast();

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
        questions={sampleQuestions}
        onRetakeQuiz={handleRetakeQuiz}
        onBackToHome={handleBackToHome}
      />
    );
  }

  return null;
}