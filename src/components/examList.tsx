import { useEffect, useState } from "react";
import { ExamInterface } from "../models/exam.interface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge, BookOpen, Clock, RotateCcw, Trophy, Users } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Question } from "../models/question";
import { useQuestionContext } from "../context/questionContext";

const ExamListPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [exmList, setExmList] = useState<ExamInterface[]>([]);
  const navigate = useNavigate();

  const {setQuestions } = useQuestionContext()

  //set question context to questions array
  const setQuestionToContext = async (examId:string) => { 
      try {
        const response = await fetch(`http://localhost:3001/question/exam/${examId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data: Question[] = await response.json();
        setQuestions(data);
        console.log('fetche', data);
        console.log('fetche');
        
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'An unknown error occurred',
        });
      } finally {
        setIsLoading(false);
      }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/exams');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data: ExamInterface[] = await response.json();
        setExmList(data);
          
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

  if (isLoading) {
    return <div className="p-8 text-center">Loading exams...</div>;
  }

  const sendtoQuiz = async (examId: string) => { 
          try {
        const response = await fetch(`http://localhost:3001/exams/${examId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data: Question[] = await response.json();
            setQuestions(data);
            setQuestionToContext(examId);
            
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'An unknown error occurred',
        });
      } finally {
        setIsLoading(false);
      }
        navigate("/quiz");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {exmList.map((exam, index) => (
          <div key={index}>
            <Card className="shadow-lg border-border/50">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-cozy-orange to-cozy-orange/80 rounded-full flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold">{exam.title}</CardTitle>
                <CardDescription>{exam.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <Button onClick={() => { sendtoQuiz(exam.id) }} className="bg-cozy-orange hover:bg-cozy-orange/80 text-white">
                    Start Exam
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExamListPage;