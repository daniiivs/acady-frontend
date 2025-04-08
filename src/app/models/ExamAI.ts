import {Question} from './question';

export class ExamAI {
  id!: string;
  studentId!: string;
  subjectId!: string;
  examId!: string;
  grade!: number;
  questions!: Question[];
}
