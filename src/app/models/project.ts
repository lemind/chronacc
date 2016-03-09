export class Project {
  id: string;
  name: string;

  constructor(obj?: any) {
    this.id              = obj && obj.id              || '0';
    this.name            = obj && obj.name            || null;
  }
}
