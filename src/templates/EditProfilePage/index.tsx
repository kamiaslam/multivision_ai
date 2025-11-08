"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Field from "@/components/Field";
import Image from "@/components/Image";
import { userAPI } from "@/services/api";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import Icon from "@/components/Icon";

interface UserData {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  phone: string | null;
  company: string | null;
  avatar_url: string | null;
  job_title: string | null;
  bio: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

const EditProfilePage = () => {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    avatar: ""
  });
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileFetching, setProfileFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setProfileFetching(true);
      try {
        const response = await userAPI.getCurrentUser();
        if (response.success && response.data) {
          const user = response.data;
          setUserData(user);
          
          // Parse full_name into first and last name
          const nameParts = user.full_name ? user.full_name.split(' ') : ['', ''];
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          setProfileData({
            firstName,
            lastName,
            email: user.email || '',
            avatar: user.avatar_url || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        toast.error('Failed to load user profile data');
      } finally {
        setProfileFetching(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveProfile = async () => {
    setProfileLoading(true);
    try {
      const updateData = {
        full_name: `${profileData.firstName} ${profileData.lastName}`.trim(),
      };

      const response = await userAPI.updateUser(updateData);
      if (response.success) {
        toast.success('Profile updated successfully');
        if (userData) {
          setUserData((prev: UserData | null) => prev ? { ...prev, ...updateData } : null);
        }
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update user data:', error);
      toast.error('Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const updateProfileField = (field: string, value: string) => {
    // For name fields, filter out special characters
    if (field === 'firstName' || field === 'lastName') {
      // Allow only letters, spaces, hyphens, and apostrophes
      const filteredValue = value.replace(/[^a-zA-Z\s\-']/g, '');
      setProfileData(prev => ({
        ...prev,
        [field]: filteredValue
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPG, PNG, or GIF)');
      return;
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 2MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewImage(result);
      setProfileData(prev => ({
        ...prev,
        avatar: result
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handle remove avatar
  const handleRemoveAvatar = () => {
    setPreviewImage(null);
    setProfileData(prev => ({
      ...prev,
      avatar: ""
    }));
    toast.success('Profile picture removed');
  };

  // Handle upload button click
  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/jpg,image/png,image/gif';
    input.onchange = (e) => handleFileUpload(e as any);
    input.click();
  };

  // Get user initials from full_name, username, or email (matching TopNav logic)
  const getUserInitials = () => {
    // First try full name (first + last name combined)
    const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();
    if (fullName && fullName !== ' ') {
      const names = fullName.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    
    // Fallback to username if available
    if (userData?.username) {
      return userData.username.charAt(0).toUpperCase();
    }
    
    // Fallback to email if no username
    if (profileData.email) {
      return profileData.email.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  // Get display name (matching TopNav logic)
  const getDisplayName = () => {
    const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();
    if (fullName && fullName !== ' ') {
      return fullName;
    }
    if (userData?.username) {
      return userData.username;
    }
    return 'User';
  };

  return (
    <Layout title="Edit Profile">
      <div className="space-y-6">
        {/* Header with Save Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-t-primary">Edit Profile</h1>
            <p className="text-[var(--text-secondary)] text-sm">Manage your account settings and preferences</p>
          </div>
          <Button 
            onClick={handleSaveProfile}
            disabled={profileLoading}
            className="px-6"
          >
            <Icon name="save" className="w-4 h-4 mr-2" />
            {profileLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {profileFetching ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture Card */}
            <Card title="Profile Picture" className="p-6">
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-6">
                  {/* Modern Avatar with proper sizing and styling */}
                  <div className="relative group cursor-pointer" onClick={handleUploadClick}>
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-b-surface2 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                      {(profileData.avatar || previewImage) ? (
                        <Image
                          className="w-full h-full object-cover"
                          src={previewImage || profileData.avatar}
                          width={128}
                          height={128}
                          alt={`${getDisplayName()}'s avatar`}
                          priority={true}
                          quality={100}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-01 via-primary-02 to-primary-04 flex items-center justify-center text-white font-bold text-3xl shadow-inner">
                          {getUserInitials()}
                        </div>
                      )}
                    </div>
                    
                    {/* Upload overlay on hover */}
                    <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Icon name="camera" className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* User info */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-t-primary">{getDisplayName()}</h3>
                    <p className="text-sm text-t-secondary">{profileData.email}</p>
                  </div>

                  {/* Action buttons with modern styling */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Button 
                      isStroke 
                      onClick={handleUploadClick}
                      disabled={uploading}
                      className="flex-1 text-sm px-4 py-2.5 border-2 border-dashed border-s-stroke2 hover:border-primary-01 hover:bg-primary-01/5 transition-all duration-300"
                    >
                      <Icon name="upload" className="w-4 h-4 mr-2" />
                      {uploading ? "Uploading..." : "Upload Photo"}
                    </Button>
                    {(profileData.avatar || previewImage) && (
                      <Button 
                        isStroke 
                        onClick={handleRemoveAvatar}
                        disabled={uploading}
                        className="flex-1 text-sm px-4 py-2.5 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
                      >
                        <Icon name="trash" className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* Help text */}
                  <div className="text-center">
                    <p className="text-xs text-t-tertiary">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Personal Information Card */}
            <div className="lg:col-span-2">
              <Card title="Personal Information" className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Field
                        label="First Name"
                        placeholder="Enter first name"
                        value={profileData.firstName}
                        onChange={(e) => updateProfileField('firstName', e.target.value)}
                      />
                      <p className="text-xs text-t-tertiary mt-1">
                        Only letters, spaces, hyphens, and apostrophes allowed
                      </p>
                    </div>
                    <div>
                      <Field
                        label="Last Name"
                        placeholder="Enter last name"
                        value={profileData.lastName}
                        onChange={(e) => updateProfileField('lastName', e.target.value)}
                      />
                      <p className="text-xs text-t-tertiary mt-1">
                        Only letters, spaces, hyphens, and apostrophes allowed
                      </p>
                    </div>
                  </div>

                  <Field
                    label="Email Address"
                    type="email"
                    placeholder="Enter email address"
                    value={profileData.email}
                    onChange={(e) => updateProfileField('email', e.target.value)}
                  />

                  {/* User Status Information */}
                  {userData && (
                    <div className="space-y-3 pt-4 border-t border-[var(--stroke-border)]">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--text-secondary)]">Account Status</span>
                        <Badge className={userData.is_active ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"}>
                          {userData.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--text-secondary)]">Email Verification</span>
                        <Badge className={userData.is_verified ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}>
                          {userData.is_verified ? "Verified" : "Not Verified"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--text-secondary)]">Member Since</span>
                        <span className="text-sm text-t-primary">
                          {new Date(userData.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--text-secondary)]">Last Updated</span>
                        <span className="text-sm text-t-primary">
                          {new Date(userData.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EditProfilePage;
