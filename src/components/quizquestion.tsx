import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { RadioGroup, RadioGroupItem } from "../components/ui/radiogroup";
import { Label } from "../components/ui/label";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizQuestionProps {
  question: Question;
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

export default function QuizQuestion({
  question,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  onFinish,
  timeRemaining = 900, // 15 minutes in seconds
  isFirstQuestion,
  isLastQuestion
}: QuizQuestionProps) {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const handleAnswerChange = (value: string) => {
    onAnswerSelect(parseInt(value));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </div>
            <Progress value={progress} className="w-32" />
          </div>
          
          <div className="flex items-center gap-2 text-sm bg-muted/30 px-3 py-2 rounded-lg border border-border/50">
            <Clock className="w-4 h-4 text-cozy-orange" />
            <span className="font-mono">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Question Card */}
        <Card className="shadow-lg border-border/50">
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">
              {question.question}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <RadioGroup 
              value={selectedAnswer?.toString()} 
              onValueChange={handleAnswerChange}
              className="space-y-3"
            >
              {question.options.map((option, index) => (
                <div key={index} className="group">
                  <Label
                    htmlFor={`option-${index}`}
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-muted/30 ${
                      selectedAnswer === index 
                        ? 'border-cozy-orange bg-cozy-orange/5' 
                        : 'border-border/50 hover:border-border'
                    }`}
                  >
                    <RadioGroupItem 
                      value={index.toString()} 
                      id={`option-${index}`}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Option {String.fromCharCode(65 + index)}
                      </div>
                      <div className="text-base leading-relaxed">
                        {option}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-border/30">
              <Button
                variant="outline"
                onClick={onPrevious}
                disabled={isFirstQuestion}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              {isLastQuestion ? (
                <Button
                  onClick={onFinish}
                  disabled={selectedAnswer === undefined}
                  variant="cozy"
                  className="flex items-center gap-2"
                >
                  Finish Quiz
                </Button>
              ) : (
                <Button
                  onClick={onNext}
                  disabled={selectedAnswer === undefined}
                  variant="cozy"
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question Overview */}
        <div className="mt-6 bg-muted/20 border border-border/30 rounded-lg p-4">
          <h3 className="font-semibold mb-3">Question Overview</h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {Array.from({ length: totalQuestions }).map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                  index === currentQuestionIndex
                    ? 'border-cozy-orange bg-cozy-orange text-white'
                    : index < currentQuestionIndex
                    ? 'border-green-500 bg-green-500/10 text-green-500'
                    : 'border-border/50 text-muted-foreground'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}