import { Box, Flex } from '@mantine/core';
import { Sidebar } from './Sidebar';
import { Outlet, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import apiClient from 'axios';
import axios from 'axios';
import { authAtom } from '@/atoms/authAtom';
import { useAuth } from '@/hooks/useAuth';

const Layout = () => {
  const [auth, setAuth] = useAtom(authAtom);
  const { logoutSubmit } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const { group_id } = useParams();



  return (
    <Flex direction="row" style={{ height: '100vh' }} p='1'>
      <Box
        style={{
          borderRight: '1px solid #ccc',
          w: 200
        }}
      >
        <Sidebar />
      </Box>
      <Box style={{ flex: 1, padding: '16px', overflow: 'auto' }}>
        <Outlet />
      </Box>
    </Flex>
  );
};

export default Layout;
