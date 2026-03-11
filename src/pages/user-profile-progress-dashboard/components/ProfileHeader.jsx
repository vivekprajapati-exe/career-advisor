import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProfileHeader = ({ user, onEditProfile }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
    onEditProfile();
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-element-card p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Avatar Section */}
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-muted border-4 border-primary/20">
            <Image
              src={user?.avatar}
              alt={`${user?.name}'s profile picture`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-card flex items-center justify-center">
            <Icon name="Check" size={12} color="white" />
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">{user?.name}</h1>
              <p className="text-muted-foreground mb-2">{user?.email}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="GraduationCap" size={16} />
                  <span>{user?.institution}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={16} />
                  <span>Joined {user?.joinDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={16} />
                  <span>{user?.location}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <Button
                variant="outline"
                onClick={handleEditClick}
                iconName="Edit"
                iconPosition="left"
                className="hidden sm:flex"
              >
                Edit Profile
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleEditClick}
                className="sm:hidden"
                title="Edit Profile"
              >
                <Icon name="Edit" size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Settings"
              >
                <Icon name="Settings" size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{user?.stats?.experimentsCompleted}</div>
          <div className="text-sm text-muted-foreground">Experiments</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary">{user?.stats?.hoursSpent}</div>
          <div className="text-sm text-muted-foreground">Hours</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-success">{user?.stats?.achievementsEarned}</div>
          <div className="text-sm text-muted-foreground">Achievements</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-warning">{user?.stats?.currentStreak}</div>
          <div className="text-sm text-muted-foreground">Day Streak</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;