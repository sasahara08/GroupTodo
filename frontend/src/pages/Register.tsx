import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Box, Title, Paper, Center, ActionIcon } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import crate_axios from '../axios';
import { IconArrowLeft } from '@tabler/icons-react';
import { useSetAtom } from 'jotai';
import { NotificationAtom } from '@/atoms/notificationAtom';
import axios from 'axios';

const RegisterPage = () => {

  const navigate = useNavigate();
  const setNotificationmessage = useSetAtom(NotificationAtom);

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
    validate: {
      name: (value: string) => {
        if (!value) return 'お名前は必須です';
        return value.length < 2 ? 'お名前は2文字以上必要です' : null;
      },
      email: (value) => {
        if (!value) return 'メールアドレスは必須です';
        return /^\S+@\S+$/.test(value) ? null : 'メールアドレスが無効です';
      },
      password: (value: string) => {
        if (!value) return 'パスワードは必須です';
        return value.length < 6 ? 'パスワードは6文字以上必要です' : null;
      },
      password_confirmation: (value: string, values: { password: string }) => {
        if (!value) return 'パスワード確認は必須です';
        return value !== values.password ? 'パスワードが一致しません' : null;
      },
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      // CSRF取得
      await axios.get('/sanctum/csrf-cookie',
        { withCredentials: true, withXSRFToken: true });


      // 登録API
      await crate_axios.post('/register', {
        name: values.name,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });
      setNotificationmessage({
        title: 'Sign Up complete',
        message: 'ユーザー登録が完了しました'
      });
      navigate('/login');
    } catch (error: any) {
      console.error('登録失敗', error);
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

  return (
    <Box mx="auto" maw={500} mt="xl"
      component='form'
      onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Center>
        {/* ボタンにアイコンを追加 */}
        <ActionIcon
          component="a"
          href="/login"
          variant="subtle"
          size="xl"
          aria-label="Go back to Mantine website"
          mr="lg"
        >
          <IconArrowLeft />
        </ActionIcon>
        <Title my="xl">新規登録</Title>
      </Center>
      <Paper withBorder shadow="sm" p={22} radius="md">
        <TextInput label="氏名" {...form.getInputProps('name')} />
        <TextInput label="メールアドレス" {...form.getInputProps('email')} mt="sm" />
        <PasswordInput label="パスワード" {...form.getInputProps('password')} mt="sm" />
        <PasswordInput
          label="パスワード(確認)"
          {...form.getInputProps('password_confirmation')}
          mt="sm"

        />
        <Center>
          <Button type="submit" fullWidth mt="xl" w='50%'>
            登録
          </Button>
        </Center>

      </Paper>
    </Box >
  );
};

export default RegisterPage;
