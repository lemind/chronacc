export class Task {
  id: string;
  time: number;
  periods: Period[];
}

export class Period {
  task: Task;
  b: number;
  e: number;
}
