import { useEffect, useState } from 'react';
import create_axios from '../axios.ts';
import { useAtom } from 'jotai';
import { authAtom } from '@/atoms/authAtom.ts';
import { Button, Group, Paper, Title, Text } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { useGroup } from '@/hooks/useGroup.tsx';

export default function groupJoin() {
  const [auth, setAuth] = useAtom(authAtom);
  const { group_id } = useParams();
  const { groupName, join_group, get_geroup_name } = useGroup()

  const handleJoin = async () => {
    try {
      join_group(group_id);
    } catch (err) {
      console.error('ユーザー情報取得失敗', err);
    }
  }

  useEffect(() => {
    get_geroup_name(group_id)
  }, [])

  return (
    <Paper p="md" shadow="sm" withBorder>
      <Title order={4}>グループ名：{groupName}</Title>
      <Text my="sm">このグループに参加しますか？</Text>
      <Group>
        <Button
          onClick={handleJoin}
        >
          参加する
        </Button>
      </Group>
    </Paper>
  );

}
