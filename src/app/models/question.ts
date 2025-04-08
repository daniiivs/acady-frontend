import {Answer} from './answer';

export class Question {
  number!: string;
  question!: string;
  answers!: Answer[];
  correctAnswer!: Answer;
  chosenAnswer!: Answer;
}
