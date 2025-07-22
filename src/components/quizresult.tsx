import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Trophy, RotateCcw, Share, Download, CheckCircle, XCircle, Clock } from "lucide-react";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  timeElapsed: number;
  correctAnswers: number[];
  userAnswers: number[];
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
  onRetakeQuiz: () => void;
  onBackToHome: () => void;
}

export default function QuizResults({
  score,
  totalQuestions,
  timeElapsed,
  correctAnswers,
  userAnswers,
  questions,
  onRetakeQuiz,
  onBackToHome
}: QuizResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;

  const getGradeInfo = (percentage: number) => {
    if (percentage >= 90) return { grade: "A+", color: "text-green-500", message: "Excellent!" };
    if (percentage >= 80) return { grade: "A", color: "text-green-500", message: "Great job!" };
    if (percentage >= 70) return { grade: "B", color: "text-blue-500", message: "Good work!" };
    if (percentage >= 60) return { grade: "C", color: "text-cozy-orange", message: "Not bad!" };
    return { grade: "F", color: "text-red-500", message: "Keep practicing!" };
  };

  const gradeInfo = getGradeInfo(percentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Results Header */}
        <Card className="shadow-lg border-border/50">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-cozy-orange to-cozy-orange/80 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">Quiz Complete!</CardTitle>
            <div className="text-muted-foreground">{gradeInfo.message}</div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Score Overview */}
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <div className="text-6xl font-bold bg-gradient-to-r from-cozy-orange to-cozy-orange/80 bg-clip-text text-transparent">
                  {percentage}%
                </div>
                <Badge className={`text-lg px-4 py-2 ${gradeInfo.color}`} variant="outline">
                  Grade: {gradeInfo.grade}
                </Badge>
              </div>
              <Progress value={percentage} className="h-3" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="text-2xl font-bold text-green-500">{score}</div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>

              <div className="text-center p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="text-2xl font-bold text-red-500">{totalQuestions - score}</div>
                <div className="text-sm text-muted-foreground">Wrong Answers</div>
              </div>

              <div className="text-center p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                  <Clock className="w-5 h-5" />
                  {minutes}:{String(seconds).padStart(2, '0')}
                </div>
                <div className="text-sm text-muted-foreground">Time Taken</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={onRetakeQuiz} variant="cozy" className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Quiz
              </Button>
              <Button onClick={onBackToHome} variant="outline" className="flex-1">
                Back to Home
              </Button>
              <Button variant="outline" className="flex-none">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="flex-none">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card className="shadow-lg border-border/50">
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((question, index) => {
                const userAnswer = userAnswers[index];
                const correctAnswer = correctAnswers[index];
                const isCorrect = userAnswer === correctAnswer;

                return (
                  <div key={question.id} className="border border-border/30 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium mb-2">
                          Question {index + 1}: {question.question}
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Your answer:</span>
                            <Badge variant={isCorrect ? "default" : "destructive"}>
                              {question.options[userAnswer]}
                            </Badge>
                          </div>
                          
                          {!isCorrect && (
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Correct answer:</span>
                              <Badge variant="outline" className="border-green-500 text-green-500">
                                {question.options[correctAnswer]}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}