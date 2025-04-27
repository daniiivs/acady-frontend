import {Question} from './question';
import {Chapter} from './chapter';

export class ExamAI {
  id!: string;
  studentId!: string;
  subjectId!: string;
  examId!: string;
  grade!: number;
  chapterIds: (string | undefined)[] = [];
  questions!: Question[];
}
