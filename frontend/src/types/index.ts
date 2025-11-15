export interface User {
  _id: string;
  email: string;
  name: string;
  role: "ADMIN" | "MANAGER" | "MEMBER";
  teamId?: string;
  team?: Team;
}

export interface Team {
  _id: string;
  name: string;
  description?: string;
  adminId: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  teamId: string;
  team?: Team;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  projectId: string;
  assignedTo?: string;
  assignedUser?: User;
  project?: Project;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  content: string;
  senderId: string;
  teamId: string;
  sender?: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  backendRegister: (userData: BackendRegisterData) => Promise<void>;
}

export interface BackendRegisterData {
  email: string;
  name: string;
  role?: "ADMIN" | "MANAGER" | "MEMBER";
  teamId?: string;
}
