import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import styled from 'styled-components';
import { signIn, signOut } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRightToBracket,
  faUpRightFromSquare,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';

const Button = styled.button`
  display: flex;
  align-items: center;
  text-align: center;
`;

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
          <Button
            onClick={(e) => {
              e.preventDefault();
              signIn();
            }}
            title="Sign in"
          >
            {isClient && (
              <FontAwesomeIcon
                icon={faRightToBracket}
                size="2x"
                style={{ color: 'white' }}
              />
            )}
          </Button>
          {isClient && (
            <FontAwesomeIcon
              icon={faUserCircle}
              size="4x"
              style={{ color: 'lightgray' }}
              title="Signed Out"
            />
          )}
        </>
      );
    } else if (session?.user) {
      return (
        <>
          <Button
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}
            title="Sign Out"
          >
            {isClient && (
              <FontAwesomeIcon
                icon={faUpRightFromSquare}
                size="2x"
                style={{ color: 'white' }}
              />
            )}
          </Button>
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
