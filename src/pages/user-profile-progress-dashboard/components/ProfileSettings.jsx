import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ProfileSettings = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    name: user?.name,
    email: user?.email,
    institution: user?.institution,
    location: user?.location,
    bio: user?.bio || "",
    learningLevel: user?.learningLevel || "intermediate",
    notifications: {
      email: user?.notifications?.email || true,
      achievements: user?.notifications?.achievements || true,
      reminders: user?.notifications?.reminders || false
    },
    privacy: {
      profileVisible: user?.privacy?.profileVisible || true,
      progressVisible: user?.privacy?.progressVisible || false,
      experimentsVisible: user?.privacy?.experimentsVisible || false
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const learningLevelOptions = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "expert", label: "Expert" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev?.[category],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      setSaveMessage("Profile updated successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveMessage("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-card rounded-lg border border-border shadow-element-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="User" size={20} />
          <span>Basic Information</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            type="text"
            value={formData?.name}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            required
          />
          
          <Input
            label="Email Address"
            type="email"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            required
          />
          
          <Input
            label="Institution"
            type="text"
            value={formData?.institution}
            onChange={(e) => handleInputChange('institution', e?.target?.value)}
            placeholder="School, University, or Organization"
          />
          
          <Input
            label="Location"
            type="text"
            value={formData?.location}
            onChange={(e) => handleInputChange('location', e?.target?.value)}
            placeholder="City, Country"
          />
        </div>

        <div className="mt-4">
          <Input
            label="Bio"
            type="text"
            value={formData?.bio}
            onChange={(e) => handleInputChange('bio', e?.target?.value)}
            placeholder="Tell us about yourself and your chemistry interests"
            className="w-full"
          />
        </div>

        <div className="mt-4">
          <Select
            label="Learning Level"
            options={learningLevelOptions}
            value={formData?.learningLevel}
            onChange={(value) => handleInputChange('learningLevel', value)}
            description="This helps us recommend appropriate experiments"
          />
        </div>
      </div>
      {/* Notification Preferences */}
      <div className="bg-card rounded-lg border border-border shadow-element-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Bell" size={20} />
          <span>Notification Preferences</span>
        </h3>
        
        <div className="space-y-3">
          <Checkbox
            label="Email Notifications"
            description="Receive updates about new features and experiments"
            checked={formData?.notifications?.email}
            onChange={(e) => handleNestedChange('notifications', 'email', e?.target?.checked)}
          />
          
          <Checkbox
            label="Achievement Notifications"
            description="Get notified when you earn new badges and achievements"
            checked={formData?.notifications?.achievements}
            onChange={(e) => handleNestedChange('notifications', 'achievements', e?.target?.checked)}
          />
          
          <Checkbox
            label="Learning Reminders"
            description="Receive reminders to continue your chemistry learning"
            checked={formData?.notifications?.reminders}
            onChange={(e) => handleNestedChange('notifications', 'reminders', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Privacy Settings */}
      <div className="bg-card rounded-lg border border-border shadow-element-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Shield" size={20} />
          <span>Privacy Settings</span>
        </h3>
        
        <div className="space-y-3">
          <Checkbox
            label="Public Profile"
            description="Allow others to view your basic profile information"
            checked={formData?.privacy?.profileVisible}
            onChange={(e) => handleNestedChange('privacy', 'profileVisible', e?.target?.checked)}
          />
          
          <Checkbox
            label="Share Progress"
            description="Allow educators to view your learning progress"
            checked={formData?.privacy?.progressVisible}
            onChange={(e) => handleNestedChange('privacy', 'progressVisible', e?.target?.checked)}
          />
          
          <Checkbox
            label="Share Experiments"
            description="Allow others to view your completed experiments"
            checked={formData?.privacy?.experimentsVisible}
            onChange={(e) => handleNestedChange('privacy', 'experimentsVisible', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Save Actions */}
      <div className="flex items-center justify-between bg-card rounded-lg border border-border shadow-element-card p-4">
        {saveMessage && (
          <div className={`flex items-center space-x-2 text-sm ${
            saveMessage?.includes('successfully') ? 'text-success' : 'text-error'
          }`}>
            <Icon name={saveMessage?.includes('successfully') ? 'CheckCircle' : 'AlertCircle'} size={16} />
            <span>{saveMessage}</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2 ml-auto">
          <Button
            variant="outline"
            onClick={() => window.location?.reload()}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            loading={isSaving}
            iconName="Save"
            iconPosition="left"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;