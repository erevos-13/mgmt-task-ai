import { FC, useState, useRef } from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/auth.service';

const Profile: FC = () => {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProfileMutation = useMutation({
    mutationFn: (formData: FormData) => authService.updateProfile(formData),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      setIsEditing(false);
      setSelectedImage(null);
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('email', formData.email);
    formDataToSend.append('firstName', formData.firstName);
    formDataToSend.append('lastName', formData.lastName);

    if (selectedImage) {
      formDataToSend.append('imageUrl', selectedImage);
    }

    updateProfileMutation.mutate(formDataToSend);
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email.substring(0, 2).toUpperCase();
  };

  const getFullName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return 'Not set';
  };

  const renderProfileImage = () => {
    if (selectedImage) {
      return (
        <img
          src={URL.createObjectURL(selectedImage)}
          alt="Profile"
          className="h-full w-full object-cover"
        />
      );
    } else if (user?.profileImage) {
      return (
        <img
          src={user.profileImage}
          alt="Profile"
          className="h-full w-full object-cover"
        />
      );
    } else {
      return (
        <span className="text-2xl font-medium text-gray-700 dark:text-gray-200">
          {getInitials()}
        </span>
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Profile
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {getFullName()}
            </p>
          </div>
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
            <div className="h-20 w-20 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
              {renderProfileImage()}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageSelect}
            />
            <button
              type="button"
              disabled={!isEditing}
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Change Picture
            </button>
            {selectedImage && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedImage.name}
              </span>
            )}
          </div>

          {/* Profile Information */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your last name"
                />
              </div>
              <div className="md:col-span-2">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Role Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-600 rounded-md text-gray-700 dark:text-gray-300 capitalize">
                {user?.role.toLowerCase()}
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
                      firstName: user?.firstName || '',
                      lastName: user?.lastName || '',
                    });
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50"
                >
                  {updateProfileMutation.isPending
                    ? 'Saving...'
                    : 'Save Changes'}
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
