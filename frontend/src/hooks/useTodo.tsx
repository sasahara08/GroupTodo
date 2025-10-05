import { authAtom } from '@/atoms/authAtom';
import { pustComplete } from '@/atoms/isChangeTodoAtom';
import { NotificationAtom } from '@/atoms/notificationAtom';
import create_axios from '@/axios';
import type { FormValues, Todo } from '@/type/Todo';
import { useAtom, useSetAtom } from 'jotai';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// APIから返されるグループデータに対応する型
export type GroupData = {
    id: number;
    name: string;
    user_id: number; // ホストユーザーのID
    created_at: string;
    updated_at: string;
};

// APIレスポンス全体に対応する型
export type ApiResponse = {
    group: GroupData;
    todos: Todo[];
    is_host_user: boolean;
};

// カスタムフック：APIからTodoリストを取得・管理
export const useTodo = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [groupData, setGroupData] = useState<GroupData | null>(null);
    const [isHostUser, setIsHostUser] = useState<boolean>(false);
    const [is_change_todo, setIsChangeTodo] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [Auth, setAuth] = useAtom(authAtom);
    const [is_lock, setIsLock] = useState<boolean>(false);
    const [editer_lock_user, setEditerLockUser] = useState<string>('');
    const navigate = useNavigate();
    const setNotificationmessage = useSetAtom(NotificationAtom);
    const setPustComplete = useSetAtom(pustComplete);

    /**
     * 指定されたグループIDのTodoリストとグループ情報をAPIから取得する関数
     * @param id グループID
     */
    const fetchTodos = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await create_axios.get(`/todo/${id}`);
            const chack_host_user = res.data.is_host_user === Auth?.id;
            console.log(res)
            console.log(Auth?.id)
            console.log(chack_host_user)
            setTodos(res.data.todos);
            setGroupData(res.data.group);
            setIsHostUser(res.data.hostuser);

        } catch (err) {
            await create_axios.post('/logout', {}, { withCredentials: true });
            setAuth(null);
            setNotificationmessage({
                title: 'session timeout',
                message: 'セッションタイムアウトです。ログインしなおしてください。'
            });
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const registerTodo = async (todo_id: number | undefined, values: FormValues, group: string, file: (File | null)) => {
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('details', values.details);
            if (values.due_date) {
                formData.append("due_date", values.due_date);
            }
            if (file) {
                formData.append('file', file)
            }
            formData.append('group_id', String(group));
            const res = await create_axios.post(`/todo/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setPustComplete(true)
        } catch (error: any) {
            return error.response.data.errors
        }

    }

    const updateTodo = async (todo_id: number | undefined, values: FormValues, group: string, file: (File | null)) => {
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('details', values.details);
            if (values.due_date) {
                formData.append("due_date", values.due_date);
            }
            if (file) {
                console.log(file)
                formData.append('file', file)
            }
            formData.append('group_id', String(group));
            formData.append("_method", "PUT");
            await create_axios.post(`/todo/update/${todo_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setPustComplete(true)
        } catch (error: any) {
            console.log(error)
        }

    }

    const edit_lock = async (todo_id: number, opened:boolean) => {
        try {
            await create_axios.post(`/todo/updateLock/${todo_id}`, {opened:opened}, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(res => {
                    console.log(res)
                    setIsLock(res.data.is_lock);
                    setEditerLockUser(res.data.lock_user)
                });
        } catch (error:any) {
            console.log(error)
                    setIsLock(error.response.data.is_lock);
                    setEditerLockUser(error.response.data.lock_user)
        }
    }

    const deleteTodo = async (todo_id: number) => {
        try {
            const formData = new FormData();
            formData.append("_method", "delete");
            await create_axios.post(`/todo/destroy/${todo_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setPustComplete(true)
        } catch (error: any) {
            return error.response.data.errors
        }
    }

    const changeCompleted = async (todo_id: number) => {
        try {
            const formData = new FormData();
            formData.append("_method", "put");
            await create_axios.post(`/todo/changeCompleted/${todo_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setPustComplete(true)
        } catch (error: any) {
            return error.response.data.errors
        }
    }

    return { todos, groupData, isHostUser, is_change_todo, loading, error, is_lock, editer_lock_user, setTodos, fetchTodos, registerTodo, updateTodo, deleteTodo, setIsChangeTodo, changeCompleted, edit_lock };
};
