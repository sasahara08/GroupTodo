import { useAtomValue } from 'jotai';
import { useForm } from '@mantine/form';
import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from '@mantine/core';
import classes from './login.module.css';
import { useEffect } from 'react';
import { NotificationAtom } from '@/atoms/notificationAtom';
import { useAuth } from '@/hooks/useAuth';
import { useNotify } from '@/hooks/useNotifivations';

const LoginPage = () => {
  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) => {
        if (!value) return 'メールアドレスは必須です';
        return /^\S+@\S+$/.test(value) ? null : 'メールアドレスが無効です';
      },
      password: (value: string) => {
        if (!value) return 'パスワードは必須です';
        return value.length < 6 ? 'パスワードは6文字以上必要です' : null;
      },
    },
  });
  const notification = useAtomValue(NotificationAtom);
  const [display_notification] = useNotify();
  const { loginSubmit } = useAuth();

  // 他画面→loginページ遷移時メッセージ
  useEffect(() => {
    if (notification) {
      display_notification(notification)
    }
  }, [notification])

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await loginSubmit(values)
    } catch (error: any) {
      console.error('ログイン失敗', error);
      if (error.response) {
        const data = error.response.data;
        if (data.errors) {
          // フォームにエラーをセット
          form.setErrors(data.errors);
        } else {
          console.error('サーバーエラー', data);
        }
      }
    }
  };

  const convertToHalfWidth = (value: string) => {
    return value
      // 全角数字 → 半角数字
      .replace(/[０-９]/g, (s) =>
        String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
      )
      // 全角英字 → 半角英字
      .replace(/[Ａ-Ｚａ-ｚ]/g, (s) =>
        String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
      );
  };


  return (
    <Container size={420} my={120}>
      <Title ta="center" className={classes.title}>
        ログイン
      </Title>

      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>

          <TextInput
            type='email'
            label="メールアドレス"
            placeholder="メールアドレスを入力"
            radius="md"
            {...form.getInputProps('email')} />

          <PasswordInput
            label="パスワード"
            placeholder="パスワードを入力"
            mt="md"
            radius="md"
            {...form.getInputProps('password')}
            onBeforeInput={(event) => {
              // 全角文字（Unicodeで0xFF01〜0xFF5Eあたり）を禁止
              if (/[Ａ-Ｚａ-ｚ０-９]/.test(event.data ?? "")) {
                event.preventDefault();
              }
            }}
          />

          <Group justify="center" mt="lg">
            <Anchor href="/register" size="sm">
              新規登録はこちら
            </Anchor>
          </Group>

          <Button type="submit" fullWidth mt="xl" radius="md">
            ログイン
          </Button>
        </form>
      </Paper>
    </Container>



  );
};

export default LoginPage;
