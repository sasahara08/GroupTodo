import { createBrowserRouter, redirect } from "react-router-dom";
import axios from "axios";

import { routePath } from "./pages/routePath";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import Layout from "@/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import TodoList from "@/pages/TodoList";
import GroupJoin from "@/pages/GroupJoin";

// 認証用 axios クライアント
const reqAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Laravel側のポートに合わせて
  withCredentials: true,
  withXSRFToken: true,
});

// ログイン済みならログイン/登録画面に入らせない
export const LogInCheck = async () => {
  try {
    const res = await reqAuth.get("/user");
    if (res.data?.id) {
      return redirect(routePath.Dashboard);
    }
  } catch (error: any) {
    // 未ログインならそのままページ表示可
  }
};

// 未ログインならログイン画面に飛ばす
export const NotLogInCheck = async () => {
  try {
    await reqAuth.get("/user");
  } catch (error: any) {
    if (error.status === 401) {
      return redirect(routePath.Login);
    }
  }
};

export const router = createBrowserRouter([
  {
    path: routePath.Login,
    element: <LoginPage />,
    loader: LogInCheck,
  },
  {
    path: routePath.Register,
    element: <RegisterPage />,
    loader: LogInCheck,
  },
  {
    path: routePath.DashboardRoot,
    element: <Layout />,
    children: [
      { path: routePath.Dashboard, element: <Dashboard /> },
      { path: routePath.Todo, element: <TodoList /> },
      { path: routePath.GroupJoin, element: <GroupJoin /> },
      { path: "*", element: <Dashboard /> },
    ],
    loader: NotLogInCheck,
  },
]);
