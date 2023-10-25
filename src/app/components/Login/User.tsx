import { Dropdown, MenuProps } from 'antd';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { signIn, signOut, useSession } from 'next-auth/react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { ActionIcon } from '@/components';

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
    onClick: () => signOut(),
  },
];

const User = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {},
  });

  const renderUser = () => {
    if (!session) {
      return (
        <ActionIcon
          width="40px"
          icon={UserCircleIcon}
          onClick={() => signIn()}
          title="Guest - Sign in"
        />
      );
    } else if (session?.user) {
      return (
        <>
          <Dropdown menu={{ items }}>
            <img
              src={session.user.image ?? ''}
              alt="User"
              title={session.user.email + ' - Sign Out' || ''}
              onClick={() => signOut()}
            />
          </Dropdown>
          <style jsx>{`
            img {
              display: flex;
              cursor: pointer;
              align-items: center;
              text-align: center;
              max-width: 40px;
              border-radius: 50%;
            }
          `}</style>
        </>
      );
    }
  };

  return renderUser();
};

export default User;
