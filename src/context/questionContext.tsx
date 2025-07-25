import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Question } from '../models/question';

// Types


interface QuestionState {
  questions: Question[];
  currentIndex: number;
  isLoading: boolean;
  error: string | null;
}

interface QuestionContextType extends QuestionState {
  setQuestions: (questions: Question[]) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  resetQuestions: () => void;
}

// Initial state
const initialState: QuestionState = {
  questions: [],
  currentIndex: 0,
  isLoading: false,
  error: null,
};

// Create Context
const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

// Reducer function
function questionReducer(state: QuestionState, action: any): QuestionState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_QUESTIONLENG':
      return { ...state, isLoading: action.payload };
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload, isLoading: false };
    case 'NEXT_QUESTION':
      return { ...state, currentIndex: state.currentIndex + 1 };
    case 'PREV_QUESTION':
      return { ...state, currentIndex: state.currentIndex - 1 };
    case 'RESET_QUESTIONS':
      return { ...initialState };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
}

// Provider Component
export const QuestionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(questionReducer, initialState);

  const setQuestions = (questions: Question[]) => {
    dispatch({ type: 'SET_QUESTIONS', payload: questions });
  };


  const nextQuestion = () => {
    if (state.currentIndex < state.questions.length - 1) {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  };

  const prevQuestion = () => {
    if (state.currentIndex > 0) {
      dispatch({ type: 'PREV_QUESTION' });
    }
  };

  const resetQuestions = () => {
    dispatch({ type: 'RESET_QUESTIONS' });
  };

  const value = {
    ...state,
    setQuestions,
    nextQuestion,
    prevQuestion,
    resetQuestions
      };

  return (
    <QuestionContext.Provider value={value}>
      {children}
    </QuestionContext.Provider>
  );
};

// Custom hook
export const useQuestionContext = () => {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error('useQuestionContext must be used within a QuestionProvider');
  }
  return context;
};