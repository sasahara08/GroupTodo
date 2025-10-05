import {
  Modal,
  Container,
  Title,
  Group,
  Text,
  TextInput,
  Button,
  ScrollArea,
  Paper,
  Box,
  Flex,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCirclePlus, IconTrash } from '@tabler/icons-react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useGroup } from '@/hooks/useGroup';
import { useAtom, useAtomValue } from 'jotai';
import { authAtom } from '@/atoms/authAtom';
import { useNotify } from '@/hooks/useNotifivations';
import { NotificationAtom } from '@/atoms/notificationAtom';

type Props = {
  opened: boolean;
  close: () => void;
  isHost: boolean;
};

export function MemberManagementModal({
  opened,
  close,
  isHost
}: Props) {
  const form = useForm({
    initialValues: { email: '' },
    validate: {
      email: (value) => (!value ? 'メールアドレスを入力してください' : null),
    },
  });

  const { group_id } = useParams();
  const [auth] = useAtom(authAtom);
  const { members, fetch_member, add_member, removeMember } = useGroup();
  const [display_notification] = useNotify();  const [notification] = useAtom(NotificationAtom);

  const handleAdd = async (values: { email: string }) => {
    try {
      await add_member(group_id, values.email)
        .then(res => {
          if (res.status === 201 && notification) {
            form.reset();
            close();
            display_notification(notification)
          }
        })
    } catch (error: any) {
      if (error.data.message) {
        form.setErrors({ email: error.data.message });
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    form.reset()
    if (opened && members) {
      fetch_member(group_id)
    }
  }, [opened])

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      size={600}
      title={
        <Title order={2} mt={10} ml={20}>
          {isHost ? "メンバー管理（ホスト）" : "メンバーリスト"}
        </Title>
      }
    >


      <Container size={800} my={10}>
        {/* ホストのみ追加フォーム */}
        {isHost && (
          <Paper p="md" mb="lg" shadow="sm" withBorder>
            <Title order={4} mb="sm">メンバー追加</Title>
            <form onSubmit={form.onSubmit(handleAdd)}>
              <Group mb="md" style={{ width: '100%' }}>
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="追加するメンバーのEmail"
                  {...form.getInputProps('email')}
                  error={
                    form.errors.email && (
                      <span style={{ marginLeft: 10, fontSize: '0.9rem', color: 'red' }}>
                        {form.errors.email}
                      </span>
                    )
                  }
                />
              </Group>
              <Flex justify="flex-end">
                <Button leftSection={<IconCirclePlus size={14} />} type="submit" size="sm">
                  追加
                </Button>
              </Flex>
            </form>
          </Paper>
        )}

        {/* メンバー一覧 */}
        <Paper p="md" shadow="sm" mt={30} withBorder>
          {isHost && <Title order={4} mb="sm">メンバーリスト</Title>}
          <ScrollArea style={{ maxHeight: 400 }}>
            {members.map((member) => (
              <Paper key={member.id} p="sm" mb="sm" shadow="xs" withBorder>
                <Group>
                  <Text style={{ flex: 1 }}>{member.name}</Text>
                  {(isHost && (auth?.id !== member.id)) && (
                    <Button
                      size="sm"
                      color="red"
                      variant="light"
                      leftSection={<IconTrash size={14} />}
                      onClick={() => removeMember(group_id, member.id)}
                    >
                      削除
                    </Button>
                  )}
                </Group>
              </Paper>
            ))}
          </ScrollArea>
        </Paper>
      </Container>
    </Modal>
  );
}
