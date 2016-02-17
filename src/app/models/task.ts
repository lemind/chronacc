export class Task {
  id: string;
  time: number;
  periods: Period[];
  active: boolean;
}

export class Period {
  task: Task;
  b: number;
  e: number;
}
