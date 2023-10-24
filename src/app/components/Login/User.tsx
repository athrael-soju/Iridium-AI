import { signIn, signOut, useSession } from 'next-auth/react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { ActionUserIcon } from '@/components';
import styled from 'styled-components';

const Image = styled.img`
  display: flex;
  align-items: center;
  text-align: center;
  max-width: 40px;
  border-radius: 50%;
`;

const User = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {},
  });

  const renderUser = () => {
    if (!session) {
      return (
        <ActionUserIcon
          icon={UserCircleIcon}
          onClick={() => signIn()}
          title="Guest - Sign in"
        />
      );
    } else if (session?.user) {
      return (
        <Image
          src={session.user.image ?? ''}
          alt="User"
          title={session.user.email + ' - Sign Out' || ''}
          onClick={() => signOut()}
        />
      );
    }
  };

  return renderUser();
};

export default User;
