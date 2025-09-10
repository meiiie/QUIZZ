import { type FC } from 'react';
import type { StudentProfile } from '../model/types';

export interface UserAvatarProps {
  user: StudentProfile | { name: string; avatar?: string };
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

const UserAvatar: FC<UserAvatarProps> = ({
  user,
  size = 'md',
  showName = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarClasses = [
    'rounded-full flex items-center justify-center font-medium',
    sizeClasses[size],
    user.avatar ? 'overflow-hidden' : 'bg-blue-500 text-white',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={`flex items-center gap-3 ${showName ? '' : ''}`}>
      <div className={avatarClasses}>
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(user.name)}</span>
        )}
      </div>
      {showName && (
        <span className="text-gray-900 font-medium">
          {user.name}
        </span>
      )}
    </div>
  );
};

export default UserAvatar;
