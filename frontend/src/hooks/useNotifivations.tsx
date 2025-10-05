import { NotificationAtom } from '@/atoms/notificationAtom';
import { notifications } from '@mantine/notifications';
import { useSetAtom } from 'jotai';

/**
 * 汎用的な通知表示のためのカスタムフック。
 * @returns {function} notifications.show()のラッパー関数。
 */

type notificationText = {
  title: string,
  message: string
}
export const useNotify = () => {

  const setNotificationAtom = useSetAtom(NotificationAtom);

  const display_notification = ({ title, message }: notificationText) => {
    notifications.show({
      title,
      message,
      autoClose: 3000,
    });
    setNotificationAtom(null);
  }

  return [display_notification];
};


