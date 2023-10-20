'use client';

import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { signIn, signOut, useSession } from 'next-auth/react';

import React from 'react';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';

const items: MenuProps['items'] = [
  {
    key: '2',
    label: 'settings',
    icon: <SettingOutlined />,
  },
  {
    key: '4',
    danger: true,
    icon: <LogoutOutlined />,
    label: 'log out',
  },
];

const User: React.FC = () => (
  <Dropdown menu={{ items }}>
    <a onClick={(e) => e?.preventDefault()}>
      <Space>
        Hover me
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default User;
