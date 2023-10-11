import React from 'react';
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
  const renderUser = () => {
    if (!session) {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              signIn();
            }}
            title="Sign in"
          >
            <FontAwesomeIcon
              icon={faRightToBracket}
              size="2x"
              style={{ color: 'white' }}
            />
          </button>
          <FontAwesomeIcon
            icon={faUserCircle}
            size="2x"
            style={{ color: 'lightgray' }}
            title="Signed Out"
          />
        </div>
      );
    } else if (session && session.user) {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}
            title="Sign Out"
          >
            <FontAwesomeIcon
              icon={faUpRightFromSquare}
              size="2x"
              style={{ color: 'white' }}
            />
          </button>
          <div className="relative w-8 h-8">
            <FontAwesomeIcon
              icon={faUserCircle}
              size="2x"
              className="absolute top-0 left-0"
            />
            <picture>
              <img
                src={session.user.image || ''}
                alt="User"
                className="absolute top-0 left-0 w-full h-full rounded-full object-cover"
                title={session.user.email || ''}
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
