import { useEffect } from 'react';
import { Container, Title, Group, Button, Progress, Text, Box } from '@mantine/core';
import { IconCirclePlus, IconCrown, IconUser, IconUserPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { TableScrollArea } from '@/components/TableScrollArea';
import { InputFormModal } from '@/components/modal/Modal';
import { TodoModal } from '@/components/modal/TodoModal';
import { useParams } from 'react-router-dom';
import { useTodo } from '@/hooks/useTodo';
import type { Todo } from '@/type/Todo';
import { useAtom, useAtomValue } from 'jotai';
import { pustComplete } from '@/atoms/isChangeTodoAtom';
import { MemberManagementModal } from '@/components/modal/MemberManagementModal';
import { useNotify } from '@/hooks/useNotifivations';
import { NotificationAtom } from '@/atoms/notificationAtom';

export default function TodoList() {
  const [taskOpened, { open: openTask, close: closeTask }] = useDisclosure(false);
  const [memberOpened, { open: openMember, close: closeMember }] = useDisclosure(false);
  const [display_notification] = useNotify();
  const notification = useAtomValue(NotificationAtom);

  const { group_id } = useParams();
  const {
    todos,
    groupData,
    isHostUser,
    is_change_todo,
    loading,
    error,
    setTodos,
    fetchTodos,
    registerTodo,
  } = useTodo();

  // Todo進捗
  const calculateProgress = (todos: Todo[]): number => {
    if (todos.length === 0) return 0;
    const completedTodos = todos.filter(todo => todo.completed).length;
    return Math.floor((completedTodos / todos.length) * 100);
  };
  const progressValue = todos ? calculateProgress(todos) : 0;

  // jotaiのAtomを使用
  const [isChangeTodo, setIsChangeTodo] = useAtom(pustComplete);

  useEffect(() => {
    if (group_id) {
      fetchTodos(group_id);
      setIsChangeTodo(false);
    }
    if (notification) {
      display_notification(notification)
    }
  }, [isChangeTodo, group_id]);

  if (loading) return <Container my="md"><Title order={1}>Loading...</Title></Container>;
  if (error) return <Container my="md"><Title order={1}>{error}</Title></Container>;
  if (!groupData) return <Container my="md"><Title order={1}>グループが見つかりません</Title></Container>;

  return (
    <Container my="md" maw={'100%'}>
      {/* ヘッダー */}
      <Group justify="space-between" align="flex-end" mb="lg">
        <Title order={1}>{groupData.name}</Title>
        <Group>
          {/* アイコン表示 */}
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '2px 8px',
              border: '1px solid',
              borderColor: isHostUser ? 'gold' : 'gray',
              borderRadius: '12px',
              gap: '4px',
            }}
          >
            {isHostUser ? (
              <Group align="center" mr={15}>
                <IconCrown size={18} color="gold" />
                <Text fz="sm">ホスト</Text>
              </Group>
            ) : (
              <Group align="center" mr={15}>
                <IconUser size={18} color="gray" />
                <Text fz="sm">ゲスト</Text>
              </Group>
            )}
          </Box>
          <Button leftSection={<IconCirclePlus size="1rem" />} onClick={openTask}>タスク追加</Button>
          <Button leftSection={<IconUserPlus size="1rem" />} onClick={openMember}>グループ管理</Button>
        </Group>
      </Group>

      {/* 進捗 */}
      <Progress.Root size="xl" mb="lg" radius="md">
        <Progress.Section value={progressValue}>
          <Progress.Label>{progressValue}%</Progress.Label>
        </Progress.Section>
      </Progress.Root>

      {/* Todoテーブル */}
      <TableScrollArea todos={todos} setIsChangeTodo={setIsChangeTodo} />

      {/* タスク追加モーダル */}
      <TodoModal
        opened={taskOpened}
        close={closeTask}
        propsMethod={registerTodo}
        modalTitle="Todo登録"
        inputPlaceholder="新しいタスク名"
        buttonText="タスクを作成"
        is_preview={false}
      />

      {/* メンバー管理モーダル */}
      <MemberManagementModal
        opened={memberOpened}
        close={closeMember}
        isHost={isHostUser}
      />
    </Container >
  );
}
