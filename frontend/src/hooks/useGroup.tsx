import { authAtom } from '@/atoms/authAtom';
import { pustComplete } from '@/atoms/isChangeTodoAtom';
import { NotificationAtom } from '@/atoms/notificationAtom';
import create_axios from '@/axios';
import type { Member } from '@/type/Member';
import { useSetAtom } from 'jotai';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Group_info = {
  id: number,
  name: string,
  is_member: boolean
  pivot:{
    group_id :number,
    is_member:number,
    user_id:number,
  }
}

/**
 * 汎用的な通知表示のためのカスタムフック。
 * @returns {function} notifications.show()のラッパー関数。
 */

export const useGroup = () => {

  const [sidebar_lists, SetSideBarList] = useState<Group_info[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [groupName, setGroupName] = useState<string>('')
  const setNotificationmessage = useSetAtom(NotificationAtom);
  const navigate = useNavigate();
  const setPustComplete = useSetAtom(pustComplete);

  const fetch_group_list = async () => {
    await create_axios.get('/group/getlist')
      .then(res => {
        console.log('test',res);
        SetSideBarList(res.data.user_groups)
      })
      .catch(error => {
        console.log('testerror',error);
        console.log(error)
      })
  }

    const get_geroup_name = async (group_id?:string) => {
    await create_axios.get(`/group/getName/${group_id}`)
      .then(res => {
        console.log(res)
        setGroupName(res.data.group_name)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const create_group = async (name: string) => {
    try {
      // ログイン API 呼び出し
      await create_axios.post('/group/regist', { name: name }, {
      })
        .then(res => {
          SetSideBarList(res.data.user_groups)
        })
    } catch (error) {
      console.log('error', error)
      throw error;
    }
  }

  const fetch_member = async (id: string | undefined) => {
    try {
      // ログイン API 呼び出し
      await create_axios.get(`/group/memberList/${id}`)
        .then(res => {
          SetSideBarList(res.data.user_groups)
          setMembers(res.data.users)
        })
    } catch (error) {
      throw error;
    }
  }

  const add_member = async (id: string | undefined, email: string) => {
    try {
      // ログイン API 呼び出し
      const res = await create_axios.post(`/group/addMember/${id}`, { email: email })
      console.log('add_memberres')
      setNotificationmessage({
        title: '招待完了',
        message: res.data.message
      });
      return res
    } catch (error: any) {
      console.log(error)
      throw error.response;
    }
  }

  const join_group = async (group_id?: string) => {
    const formData = new FormData();
    formData.append("_method", "PUT");
    await create_axios.post(`/group/joinGroup/${group_id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => {
        setNotificationmessage({
          title: '参加完了',
          message: res.data.message
        });
        setPustComplete(true)
        navigate(`/todo/${group_id}`);
        
      });
  }

    const removeMember = async (group_id: string | undefined, user_id: string) => {
    try {
      const formData = new FormData();
      formData.append("_method", "delete");
      formData.append('userId', user_id);
      const res = await create_axios.delete(`/group/removeMember/${group_id}`, {
        data: { user_id }
      });

      setNotificationmessage({
        title: '削除完了',
        message: res.data.message
      });

      // メンバー一覧を更新
      await fetch_member(group_id);

      return res;
    } catch (error: any) {
      console.error(error);
      setNotificationmessage({
        title: '削除失敗',
        message: error.response?.data?.message || 'メンバー削除に失敗しました'
      });
      throw error.response;
    }
  };


  return { sidebar_lists, members, groupName, SetSideBarList, fetch_group_list, create_group, fetch_member, add_member, join_group, get_geroup_name, removeMember };
};


