export class Task {
  id: string;
  time: number;
  periods: Period[];
}

export class Period {
  b: number;
  e: number;
}