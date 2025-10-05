import { useEffect, useState } from 'react';
import create_axios from '../axios.ts';
import { useAtom } from 'jotai';
import { authAtom } from '@/atoms/authAtom.ts';

export default function Dashboard() {
  const [auth, setAuth] = useAtom(authAtom);

  const fetchUser = async () => {
    try {
      const res = await create_axios.get('/user');
      setAuth(res.data);
    } catch (err) {
      console.error('ユーザー情報取得失敗', err);
    }
  }

  useEffect(() => {
    fetchUser();
  },[]);

  if (!auth) {
  return <p>Loading...</p>;
}

return <div>Welcome, {auth.name}!</div>;

}
