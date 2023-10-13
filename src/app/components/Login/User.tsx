import React, { useEffect, useState } from 'react';
import { signIn, signOut } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRightToBracket,
  faUpRightFromSquare,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';

type Session = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

interface UserProps {
  session: Session | null | undefined;
}

const User: React.FC<UserProps> = ({ session }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Component will mount only on client side
    setIsClient(true);
  }, []);

  const renderUser = () => {
    if (!session) {
      return (
        <div className="flex items-end gap-2">
          <button
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
                style={{ color: '#D2D6DC' }}
              />
            )}
          </button>
          {isClient && (
            <FontAwesomeIcon
              icon={faUserCircle}
              size="4x"
              style={{ color: '#D2D6DC' }}
              title="Signed Out"
            />
          )}
        </div>
      );
    } else if (session?.user) {
      return (
        <div className="flex items-end gap-2">
          <button
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
          </button>
          <div className="relative" style={{ width: '4em', height: '4em' }}>
            <picture>
              <img
                src={session.user.image ?? ''}
                alt="User"
                className="absolute top-0 left-0 w-full h-full rounded-full object-cover"
                title={session.user.email ?? ''}
                style={{ width: '4em', height: '4em' }}
              />
            </picture>
          </div>
        </div>
      );
    }
  };

  return renderUser();
};

export default User;
