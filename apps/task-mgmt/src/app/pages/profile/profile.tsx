import { FC, useState } from 'react';
import { useAuthStore } from '../../stores/auth.store';

const Profile: FC = () => {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: user?.name || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Add API call to update user profile
      setUser({ ...user!, ...formData });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Profile
          </h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <span className="text-2xl font-medium text-gray-700 dark:text-gray-200">
                {user?.email.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <button
              disabled={!isEditing}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Change Picture
            </button>
          </div>

          {/* Profile Information */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Role Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-600 rounded-md text-gray-700 dark:text-gray-300">
                {user?.role}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      email: user?.email || '',
                      name: user?.name || '',
                    });
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
