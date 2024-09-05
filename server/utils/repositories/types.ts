// types.ts
export interface User {
    username: string;
    name: string;
    password: string;
    token?: string; // El token es opcional ya que solo se genera cuando el usuario se autentica
  }
  