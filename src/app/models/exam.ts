export class Exam {
  id?: string;
  date!: Date;
  completed!: boolean;
  grade?: number;
  chapterIds: (string | undefined)[] = [];
  studentId!: string;
  subjectId: string = '';
}
