// types.ts
export interface User {
    username: string;
    name: string;
    password: string;
    token?: string; 
  }
  
  export interface ToDo {
    id: string;
    title: string;
    completed: boolean;
  }