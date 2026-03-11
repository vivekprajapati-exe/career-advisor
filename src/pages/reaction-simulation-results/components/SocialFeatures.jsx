import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SocialFeatures = ({ 
  reactionData = {},
  onShareReaction = () => {},
  onSaveToFavorites = () => {},
  onCommentSubmit = () => {}
}) => {
  const [activeTab, setActiveTab] = useState('share');
  const [comment, setComment] = useState('');
  const [shareSettings, setShareSettings] = useState({
    includeData: true,
    includeImages: true,
    includeNotes: false,
    visibility: 'public'
  });

  // Mock social data
  const mockComments = [
    {
      id: 1,
      user: 'Dr. Sarah Chen',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      comment: 'Excellent yield! Have you tried varying the temperature to see if you can improve efficiency further?',
      timestamp: '2 hours ago',
      likes: 5,
      isLiked: false
    },
    {
      id: 2,
      user: 'Alex Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      comment: 'Great work on the safety protocols. The step-by-step documentation is very helpful for beginners.',
      timestamp: '4 hours ago',
      likes: 3,
      isLiked: true
    },
    {
      id: 3,
      user: 'Prof. Michael Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/58.jpg',
      comment: 'This is a perfect example for my undergraduate class. Mind if I use this in my teaching materials?',
      timestamp: '1 day ago',
      likes: 8,
      isLiked: false
    }
  ];

  const mockClassmates = [
    { id: 1, name: 'Emma Wilson', avatar: 'https://randomuser.me/api/portraits/women/25.jpg', status: 'online' },
    { id: 2, name: 'James Park', avatar: 'https://randomuser.me/api/portraits/men/30.jpg', status: 'offline' },
    { id: 3, name: 'Lisa Zhang', avatar: 'https://randomuser.me/api/portraits/women/28.jpg', status: 'online' },
    { id: 4, name: 'David Miller', avatar: 'https://randomuser.me/api/portraits/men/35.jpg', status: 'away' }
  ];

  const tabs = [
    { id: 'share', label: 'Share', icon: 'Share2' },
    { id: 'comments', label: 'Comments', icon: 'MessageCircle' },
    { id: 'classmates', label: 'Classmates', icon: 'Users' }
  ];

  const handleShare = (platform) => {
    const shareData = {
      platform,
      reactionData,
      settings: shareSettings
    };
    onShareReaction(shareData);
  };

  const handleCommentSubmit = () => {
    if (comment?.trim()) {
      onCommentSubmit(comment);
      setComment('');
    }
  };

  const renderShareTab = () => (
    <div className="space-y-6">
      {/* Share Settings */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Share Settings</h4>
        
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={shareSettings?.includeData}
              onChange={(e) => setShareSettings(prev => ({ ...prev, includeData: e?.target?.checked }))}
              className="rounded border-border"
            />
            <span className="text-sm text-foreground">Include experimental data</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={shareSettings?.includeImages}
              onChange={(e) => setShareSettings(prev => ({ ...prev, includeImages: e?.target?.checked }))}
              className="rounded border-border"
            />
            <span className="text-sm text-foreground">Include screenshots and images</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={shareSettings?.includeNotes}
              onChange={(e) => setShareSettings(prev => ({ ...prev, includeNotes: e?.target?.checked }))}
              className="rounded border-border"
            />
            <span className="text-sm text-foreground">Include personal notes</span>
          </label>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Visibility</label>
          <select
            value={shareSettings?.visibility}
            onChange={(e) => setShareSettings(prev => ({ ...prev, visibility: e?.target?.value }))}
            className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="public">Public - Anyone can view</option>
            <option value="classmates">Classmates only</option>
            <option value="instructors">Instructors only</option>
            <option value="private">Private - Link sharing only</option>
          </select>
        </div>
      </div>

      {/* Share Platforms */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Share To</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => handleShare('classroom')}
            iconName="GraduationCap"
            iconPosition="left"
            className="justify-start"
          >
            Class Forum
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleShare('email')}
            iconName="Mail"
            iconPosition="left"
            className="justify-start"
          >
            Email
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleShare('link')}
            iconName="Link"
            iconPosition="left"
            className="justify-start"
          >
            Copy Link
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleShare('export')}
            iconName="Download"
            iconPosition="left"
            className="justify-start"
          >
            Export File
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Quick Actions</h4>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveToFavorites}
            iconName="Heart"
            iconPosition="left"
          >
            Save to Favorites
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Bookmark"
            iconPosition="left"
          >
            Bookmark
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Copy"
            iconPosition="left"
          >
            Duplicate Experiment
          </Button>
        </div>
      </div>
    </div>
  );

  const renderCommentsTab = () => (
    <div className="space-y-6">
      {/* Comment Input */}
      <div className="space-y-3">
        <Input
          type="text"
          placeholder="Share your thoughts about this experiment..."
          value={comment}
          onChange={(e) => setComment(e?.target?.value)}
          className="w-full"
        />
        <div className="flex justify-end">
          <Button
            variant="default"
            size="sm"
            onClick={handleCommentSubmit}
            disabled={!comment?.trim()}
            iconName="Send"
            iconPosition="left"
          >
            Post Comment
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">
          Comments ({mockComments?.length})
        </h4>
        
        {mockComments?.map(commentItem => (
          <div key={commentItem?.id} className="bg-muted rounded-lg p-4 border border-border">
            <div className="flex items-start space-x-3">
              <img
                src={commentItem?.avatar}
                alt={commentItem?.user}
                className="w-8 h-8 rounded-full object-cover"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-foreground text-sm">
                    {commentItem?.user}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {commentItem?.timestamp}
                  </span>
                </div>
                
                <p className="text-sm text-foreground mb-2">
                  {commentItem?.comment}
                </p>
                
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="xs"
                    iconName="ThumbsUp"
                    iconPosition="left"
                    className={commentItem?.isLiked ? 'text-primary' : 'text-muted-foreground'}
                  >
                    {commentItem?.likes}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="xs"
                    iconName="MessageCircle"
                    iconPosition="left"
                    className="text-muted-foreground"
                  >
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderClassmatesTab = () => (
    <div className="space-y-6">
      {/* Online Classmates */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Classmates</h4>
        
        <div className="space-y-3">
          {mockClassmates?.map(classmate => (
            <div key={classmate?.id} className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={classmate?.avatar}
                    alt={classmate?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                    classmate?.status === 'online' ? 'bg-success' :
                    classmate?.status === 'away' ? 'bg-warning' : 'bg-muted-foreground'
                  }`} />
                </div>
                
                <div>
                  <div className="font-medium text-foreground text-sm">
                    {classmate?.name}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {classmate?.status}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="xs"
                  iconName="MessageCircle"
                  title="Send message"
                />
                <Button
                  variant="outline"
                  size="xs"
                  iconName="Share2"
                  title="Share experiment"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Groups */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Study Groups</h4>
        
        <div className="space-y-3">
          <div className="p-3 bg-muted rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground text-sm">Organic Chemistry Study Group</span>
              <span className="text-xs text-success">Active</span>
            </div>
            <div className="text-xs text-muted-foreground mb-2">12 members • 3 online</div>
            <Button variant="outline" size="xs" iconName="Users" iconPosition="left">
              Join Discussion
            </Button>
          </div>
          
          <div className="p-3 bg-muted rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground text-sm">Lab Partners - Section A</span>
              <span className="text-xs text-muted-foreground">Quiet</span>
            </div>
            <div className="text-xs text-muted-foreground mb-2">8 members • 1 online</div>
            <Button variant="outline" size="xs" iconName="Users" iconPosition="left">
              View Group
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'share':
        return renderShareTab();
      case 'comments':
        return renderCommentsTab();
      case 'classmates':
        return renderClassmatesTab();
      default:
        return renderShareTab();
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-element-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Social & Collaboration</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full" />
          <span className="text-sm text-muted-foreground">Connected</span>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-muted rounded-lg p-1">
        {tabs?.map(tab => (
          <Button
            key={tab?.id}
            variant={activeTab === tab?.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab?.id)}
            iconName={tab?.icon}
            iconPosition="left"
            className="flex-1"
          >
            <span className="hidden sm:inline">{tab?.label}</span>
            <span className="sm:hidden">{tab?.icon}</span>
          </Button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default SocialFeatures;