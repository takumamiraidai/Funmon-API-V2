export interface User {
  id: string;
  funmons: string[];
  sub: string[];
}

export interface CreateUserRequest {
  id: string;
  funmons: string[];
  sub: string[];
}
