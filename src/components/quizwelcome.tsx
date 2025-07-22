import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Clock, Trophy, BookOpen, Users } from "lucide-react";

interface QuizWelcomeProps {
  onStartQuiz: () => void;
  quizTitle?: string;
  description?: string;
  questionsCount?: number;
  timeLimit?: number;
  difficulty?: "Easy" | "Medium" | "Hard";
}

export default function QuizWelcome({
  onStartQuiz,
  quizTitle = "JavaScript Fundamentals Quiz",
  description = "Test your knowledge of JavaScript basics including variables, functions, and DOM manipulation.",
  questionsCount = 10,
  timeLimit = 15,
  difficulty = "Medium"
}: QuizWelcomeProps) {
  const difficultyColors = {
    Easy: "bg-green-500/10 text-green-500 border-green-500/20",
    Medium: "bg-cozy-orange/10 text-cozy-orange border-cozy-orange/20",
    Hard: "bg-red-500/10 text-red-500 border-red-500/20"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg border-border/50">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cozy-orange to-cozy-orange/80 rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {quizTitle}
          </CardTitle>
          <CardDescription className="text-lg leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Questions</div>
                <div className="font-semibold">{questionsCount}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Time Limit</div>
                <div className="font-semibold">{timeLimit} min</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Difficulty</div>
                <Badge className={difficultyColors[difficulty]}>
                  {difficulty}
                </Badge>
              </div>
            </div>
          </div>

          <div className="bg-muted/20 border border-border/30 rounded-lg p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Quiz Instructions
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Choose the best answer for each question</li>
              <li>• You can review and change answers before submitting</li>
              <li>• Each question has only one correct answer</li>
              <li>• Your progress will be saved automatically</li>
            </ul>
          </div>

          <Button 
            onClick={onStartQuiz} 
            size="lg" 
            className="w-full h-12 text-lg font-semibold"
            variant="cozy"
          >
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}