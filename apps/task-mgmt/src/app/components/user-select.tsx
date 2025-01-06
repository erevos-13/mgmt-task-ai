import { FC, useState, useRef, useEffect } from 'react';
import { User } from '../models/user';

interface UserSelectProps {
  users: User[];
  value: string;
  onChange: (email: string) => void;
}

export const UserSelect: FC<UserSelectProps> = ({ users, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedUser = users.find((user) => user.email === value);

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white cursor-pointer flex justify-between items-center"
      >
        <span>{selectedUser ? selectedUser.email : 'Select User'}</span>
        <svg
          className={`w-5 h-5 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 rounded-md shadow-lg">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ul className="max-h-60 overflow-auto">
            {filteredUsers.map((user) => (
              <li
                key={user.id}
                onClick={() => {
                  onChange(user.email);
                  setIsOpen(false);
                  setSearch('');
                }}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 ${
                  user.email === value ? 'bg-indigo-50 dark:bg-indigo-900' : ''
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 dark:text-white">
                    {user.email}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {user.role.toLowerCase()}
                  </span>
                </div>
              </li>
            ))}
            {filteredUsers.length === 0 && (
              <li className="px-3 py-2 text-gray-500 dark:text-gray-400">
                No users found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
