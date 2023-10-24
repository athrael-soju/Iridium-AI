import React, { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import {
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { ActionIcon } from '@/components';
import styled from 'styled-components';

const Image = styled.img`
  display: flex;
  align-items: center;
  text-align: center;
  max-width: 50px;
  border-radius: 50%;
`;

const User = () => {
  const [isClient, setIsClient] = useState(false);
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {},
  });

  useEffect(() => {
    // Component will mount only on client side
    setIsClient(true);
  }, []);

  const renderUser = () => {
    if (!session) {
      return (
        <>
          <ActionIcon
            icon={ArrowRightOnRectangleIcon}
            onClick={() => signIn()}
            title="Sign in"
          />
          <ActionIcon
            icon={UserCircleIcon}
            onClick={() => signIn()}
            title="Sign in"
          />
        </>
      );
    } else if (session?.user) {
      return (
        <>
          <ActionIcon
            icon={ArrowLeftOnRectangleIcon}
            onClick={() => signOut()}
            title="Sign Out"
          />
          <Image
            src={session.user.image ?? ''}
            alt="User"
            title={session.user.email ?? ''}
          />
        </>
      );
    }
  };

  return renderUser();
};

export default User;
