export interface Question {
    id: string;
    examId:string[];
    questionText: string;
    options: string[];
    correctOptions: number;
}