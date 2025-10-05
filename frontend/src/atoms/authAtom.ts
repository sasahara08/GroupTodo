import { atom } from 'jotai';

export type User = {
  id: string;
  name: string;
  email: string;
};

// ユーザー情報を保持
export const authAtom = atom<User | null>(null);
