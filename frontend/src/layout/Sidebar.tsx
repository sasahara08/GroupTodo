import { useEffect, useState } from 'react';
import {
  IconCirclePlus,
  IconLogout,
} from '@tabler/icons-react';
import { Code, Group, Title, NavLink, ScrollArea, Modal, Card } from '@mantine/core';
import classes from './Sidebar.module.css';
import { useAuth } from '@/hooks/useAuth';
import { useDisclosure } from '@mantine/hooks';
import { InputFormModal } from '@/components/modal/Modal';
import { useGroup } from '@/hooks/useGroup';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { pustComplete } from '@/atoms/isChangeTodoAtom';

// { link: '', label: 'Authentication', icon: Icon2fa },

export function Sidebar() {
  const [active, setActive] = useState<number | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const { logoutSubmit } = useAuth();
  const { sidebar_lists, fetch_group_list, create_group } = useGroup();
  const { group_id } = useParams();
  const groupId = Number(group_id);
  const [post_complete, setPustComplete] = useAtom(pustComplete);

  // 参加している / 参加していないで分ける
  const joinedGroups = (sidebar_lists || []).filter(list => list.pivot.is_member);
  const notJoinedGroups = (sidebar_lists || []).filter(list => !list.pivot.is_member);

  const joinedLinks = joinedGroups.map((list) => (
    <NavLink
      key={`joined-${list.id}`}
      label={list.name}
      component={Link}
      to={`/todo/${list.id}`}
      active={list.id === active}
      onClick={() => setActive(list.id)}
    />
  ));

  const notJoinedLinks = notJoinedGroups.map((list) => (
    <NavLink
      key={`not-joined-${list.id}`}
      label={list.name}
      component={Link}
      to={`/groupJoin/${list.id}`}
      active={list.id === active}
      onClick={() => setActive(list.id)}
    />
  ));

  useEffect(() => {
    fetch_group_list();
    if (groupId) {
      setActive(groupId)
    }
  }, [post_complete])

  return (
    <>
      <Card className={classes.navbar}>
        <div className={classes.navbarMain}>
          <Group className={classes.header} justify="left">
            <Title order={3}>Group Todo</Title>
          </Group>
          {notJoinedLinks && notJoinedLinks.length > 0 && (
            <>
              <Title order={6} style={{ margin: '8px 0' }}>未加入グループ</Title>
              <ScrollArea className={classes.header} style={{ maxHeight: 150 }}>
                {notJoinedLinks}
              </ScrollArea>
            </>
          )}
          <Title order={6} style={{ margin: '8px 0' }}>加入済みグループ</Title>
          <ScrollArea style={{ height: '100%' }}>
            {joinedLinks}
          </ScrollArea>
        </div>

        <div className={classes.footer}>
          <NavLink
            label="グループを作成"
            onClick={open}
            leftSection={<IconCirclePlus size="1rem" stroke={1.0} />}
          />
          <NavLink
            label="ログアウト"
            leftSection={<IconLogout size="1rem" stroke={1.0} />}
            onClick={(e) =>
              logoutSubmit(e)}
          />
        </div>
      </Card>

      <InputFormModal
        modalTitle={'グループ新規作成'}
        inputPlaceholder={'グループ名を入力'}
        buttonText={'登録'}
        opened={opened}
        close={close}
        propsMethod={create_group} />
    </>
  );
}
