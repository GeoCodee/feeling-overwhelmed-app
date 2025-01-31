export interface Task {
    id: string;
    text: string;
    tags: string[];
    completed?: boolean;
  }