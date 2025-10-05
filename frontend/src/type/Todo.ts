// src/type/Todo.ts
export type Todo = {
  id: number;
  user_id: number;
  group_id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  is_important: boolean | null;
  image_url: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_name: string | null
};

export type FormValues = {
  title: string;
  details: string;
  due_date: string | null;
  file: File | null;
  group_id: string;
  existingImage: string | null
};

export type GroupData = {
  id: number;
  name: string;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
};
