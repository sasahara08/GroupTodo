import { atom } from 'jotai';

// 通知のタイトルとメッセージを保持する型を定義
export type notificationText = {
  title: string;
  message: string;
};

// 通知の状態を保持するアトム。初期値はnull。
export const NotificationAtom = atom<notificationText | null>(null);
