import { authAtom } from '@/atoms/authAtom';
import create_axios from '../axios';
import { useSetAtom } from 'jotai/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type login_input = {
  email: string;
  password: string;
};

export const useAuth = () => {
  const setAuth = useSetAtom(authAtom);
  const navigate = useNavigate();

  // ログイン処理
  const loginSubmit = async (values: login_input) => {
    try {
      // CSRF Cookie を取得（baseURL なしの axios を使用）
      await axios.get('/sanctum/csrf-cookie',
        { withCredentials: true, withXSRFToken: true });

      // ログイン API 呼び出し
      await create_axios.post('/login', values, {
        withCredentials: true,
      })

      // ユーザー情報取得
      create_axios.get('/user', { withCredentials: true })
        .then(res => {
          setAuth(res.data);
        });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('ログイン失敗', error);
      throw error;
    }
  };

  // ログアウト処理
  const logoutSubmit = async (e: React.MouseEvent | null) => {
    if(e){
      e.preventDefault();
    }
    try {
      // CSRF Cookie を再取得
      await axios.get('/sanctum/csrf-cookie', { withCredentials: true });

      // logout API 呼び出し
      await create_axios.post('/logout', {}, { withCredentials: true });

      setAuth(null); // jotai に保存
      navigate('/login');
    } catch (error: any) {
      console.error('ログアウト失敗', error);
    }
  };

  return { loginSubmit, logoutSubmit };
};
