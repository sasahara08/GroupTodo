import { Box, Flex, Burger } from '@mantine/core';
import { Sidebar } from './Sidebar';
import { Outlet, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import apiClient from 'axios';
import axios from 'axios';
import { authAtom } from '@/atoms/authAtom';
import { useAuth } from '@/hooks/useAuth';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

const Layout = () => {
  const [auth, setAuth] = useAtom(authAtom);
  const { logoutSubmit } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const { group_id } = useParams();
  const [sidebarOpened, { toggle: toggleSidebar, close: closeSidebar }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Flex direction="row" style={{ height: '100vh', position: 'relative' }} p='1'>
      {/* ハンバーガーメニューボタン（モバイルのみ） */}
      {isMobile && (
        <Box style={{ position: 'fixed', top: 16, left: 16, zIndex: 1000 }}>
          <Burger opened={sidebarOpened} onClick={toggleSidebar} size="sm" />
        </Box>
      )}

      {/* サイドバー */}
      <Box
        style={{
          borderRight: isMobile ? 'none' : '1px solid #ccc',
          position: isMobile ? 'fixed' : 'relative',
          left: isMobile ? (sidebarOpened ? 0 : '-100%') : 0,
          top: 0,
          height: '100vh',
          zIndex: 999,
          transition: 'left 0.3s ease',
          backgroundColor: 'var(--mantine-color-body)',
        }}
      >
        <Sidebar onClose={closeSidebar} isMobile={isMobile} />
      </Box>

      {/* オーバーレイ（モバイルでサイドバーが開いているとき） */}
      {isMobile && sidebarOpened && (
        <Box
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
          }}
        />
      )}

      {/* メインコンテンツ */}
      <Box style={{ flex: 1, padding: isMobile ? '8px' : '16px', overflow: 'auto' }}>
        <Outlet />
      </Box>
    </Flex>
  );
};

export default Layout;
