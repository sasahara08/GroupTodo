import { useEffect, useState } from 'react';
import cx from 'clsx';
import { ActionIcon, Badge, Group, rem, ScrollArea, Table, Text, Tooltip, Image, NavLink } from '@mantine/core';
import classes from './TableScrollArea.module.css';
import type { Todo } from '@/type/Todo';
import dayjs from 'dayjs';
import { IconCheck, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { TodoModal } from './modal/TodoModal';
import { useDisclosure } from '@mantine/hooks';
import { useTodo } from '@/hooks/useTodo';

type TableScrollAreaProps = {
  todos: Todo[];
  setIsChangeTodo: React.Dispatch<React.SetStateAction<boolean>>;
};

export function TableScrollArea({ todos, setIsChangeTodo }: TableScrollAreaProps) {
  const [scrolled, setScrolled] = useState(false);
  const [display_todo_number, setDisplayTodNumber] = useState<number>();
  const [ReferenceOpened, { open: openReference, close: closeReference }] = useDisclosure(false);
  const [EditerOpened, { open: openEditer, close: closeEditer }] = useDisclosure(false);
  const { updateTodo, deleteTodo, changeCompleted } = useTodo();
  const today = dayjs();

  const open_reference_todo = (todo_id: number) => {
    setDisplayTodNumber(todo_id)
    openReference()
  }

  const open_todo_editer = (todo_id: number) => {
    setDisplayTodNumber(todo_id)
    openEditer()
  }

  return (
    <>
      <ScrollArea h={'80vh'} onScrollPositionChange={({ y }) => setScrolled(y !== 0)} mt={40}>
        <Table>
          <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
            <Table.Tr>
              <Table.Th>タスク名</Table.Th>
              <Table.Th>登録者</Table.Th>
              <Table.Th>期限</Table.Th>
              <Table.Th>ステータス</Table.Th>
              <Table.Th>操作</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {todos.length > 0 ? (
              todos.map((todo) => (
                <Table.Tr key={todo.id}>
                  <Table.Td>
                    <Text fz="sm" fw={500}>
                      <NavLink label={todo.title} onClick={() => open_reference_todo(todo.id)} />
                    </Text>
                  </Table.Td>
                  <Table.Td>{todo?.user_name}</Table.Td>
                  <Table.Td>
                    <Text fz="sm" c={
                      todo.due_date && dayjs(todo.due_date).isBefore(today) && !(todo.completed)
                        ? 'red' // 今日より前なら赤
                        : undefined // それ以外はデフォルト
                    }>
                      {todo.due_date
                        ? dayjs(todo.due_date).format('YYYY/MM/DD')
                        : '期限なし'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      variant="filled"
                      color={todo.completed ? 'teal' : 'red'}
                      size="lg"
                      radius="xs"
                    >
                      {todo.completed ? '完了' : '未完了'}
                    </Badge>
                  </Table.Td>

                  <Table.Td><Group gap={0}>
                    <Tooltip label="完了/未完了">
                      <ActionIcon
                        variant="subtle"
                        color={todo.completed ? 'teal' : 'red'}
                        onClick={() => changeCompleted(todo.id)}
                        mr={10}
                      >
                        {todo.completed ? (
                          <IconX style={{ width: rem(25), height: rem(25) }} />
                        ) : (
                          <IconCheck style={{ width: rem(25), height: rem(25) }} />
                        )}
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="編集">
                      <ActionIcon onClick={() => open_todo_editer(todo.id)} variant="subtle" color="gray" mr={10}>
                        <IconPencil style={{ width: rem(25), height: rem(25) }} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="削除">
                      <ActionIcon onClick={() => deleteTodo(todo.id)} variant="subtle" color="red" mr={10}>
                        <IconTrash style={{ width: rem(25), height: rem(25) }} />
                      </ActionIcon>
                    </Tooltip>
                  </Group></Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td>
                  Todoの登録がありません
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>


      {/* タスク参照用モーダル */}
      <TodoModal
        opened={ReferenceOpened}
        close={closeReference}
        modalTitle="タスク詳細"
        inputPlaceholder=""
        buttonText=""
        is_preview={true}
        todos={todos}
        display_todo_number={display_todo_number}
      />

      {/* タスク編集用モーダル */}
      <TodoModal
        opened={EditerOpened}
        close={closeEditer}
        propsMethod={updateTodo}
        modalTitle="タスク詳細"
        inputPlaceholder=""
        buttonText="登録"
        is_preview={false}
        todos={todos}
        display_todo_number={display_todo_number}
      />
    </>
  );
}