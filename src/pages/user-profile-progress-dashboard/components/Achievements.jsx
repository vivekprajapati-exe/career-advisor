import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const Achievements = ({ achievements, badges, certificates }) => {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All", icon: "Award" },
    { id: "experiments", label: "Experiments", icon: "Beaker" },
    { id: "learning", label: "Learning", icon: "BookOpen" },
    { id: "milestones", label: "Milestones", icon: "Target" },
    { id: "social", label: "Social", icon: "Users" }
  ];

  const filteredAchievements = activeCategory === "all" 
    ? achievements 
    : achievements?.filter(achievement => achievement?.category === activeCategory);

  const getBadgeColor = (rarity) => {
    switch (rarity) {
      case "legendary": return "bg-gradient-to-br from-yellow-400 to-orange-500";
      case "epic": return "bg-gradient-to-br from-purple-500 to-pink-500";
      case "rare": return "bg-gradient-to-br from-blue-500 to-cyan-500";
      case "common": return "bg-gradient-to-br from-gray-400 to-gray-600";
      default: return "bg-gradient-to-br from-green-500 to-emerald-500";
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return "var(--color-success)";
    if (progress >= 75) return "var(--color-primary)";
    if (progress >= 50) return "var(--color-warning)";
    return "var(--color-muted-foreground)";
  };

  const handleShare = (achievement) => {
    if (navigator.share) {
      navigator.share({
        title: `I earned the ${achievement?.title} achievement!`,
        text: achievement?.description,
        url: window.location?.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const text = `I earned the ${achievement?.title} achievement in ChemLab Virtual! ${achievement?.description}`;
      navigator.clipboard?.writeText(text);
      alert("Achievement details copied to clipboard!");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="bg-card rounded-lg border border-border shadow-element-card p-4">
        <div className="flex flex-wrap gap-2">
          {categories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => setActiveCategory(category?.id)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-ui
                ${activeCategory === category?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                }
              `}
            >
              <Icon name={category?.icon} size={16} />
              <span>{category?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Achievement Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border shadow-element-card p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {achievements?.filter(a => a?.earned)?.length}
          </div>
          <div className="text-sm text-muted-foreground">Earned</div>
        </div>
        <div className="bg-card rounded-lg border border-border shadow-element-card p-4 text-center">
          <div className="text-2xl font-bold text-warning mb-1">
            {achievements?.filter(a => !a?.earned && a?.progress > 0)?.length}
          </div>
          <div className="text-sm text-muted-foreground">In Progress</div>
        </div>
        <div className="bg-card rounded-lg border border-border shadow-element-card p-4 text-center">
          <div className="text-2xl font-bold text-secondary mb-1">{badges?.length}</div>
          <div className="text-sm text-muted-foreground">Badges</div>
        </div>
        <div className="bg-card rounded-lg border border-border shadow-element-card p-4 text-center">
          <div className="text-2xl font-bold text-success mb-1">{certificates?.length}</div>
          <div className="text-sm text-muted-foreground">Certificates</div>
        </div>
      </div>
      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements?.map((achievement) => (
          <div
            key={achievement?.id}
            className={`
              bg-card rounded-lg border shadow-element-card p-4 transition-ui
              ${achievement?.earned 
                ? 'border-success/50 bg-success/5' 
                : achievement?.progress > 0 
                  ? 'border-warning/50 bg-warning/5' :'border-border'
              }
            `}
          >
            <div className="flex items-start space-x-3">
              {/* Achievement Icon */}
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
                ${achievement?.earned 
                  ? getBadgeColor(achievement?.rarity)
                  : 'bg-muted'
                }
              `}>
                <Icon 
                  name={achievement?.icon} 
                  size={24} 
                  color={achievement?.earned ? "white" : "var(--color-muted-foreground)"}
                />
              </div>

              {/* Achievement Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-medium text-sm ${
                    achievement?.earned ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {achievement?.title}
                  </h3>
                  {achievement?.earned && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleShare(achievement)}
                      className="h-6 w-6"
                      title="Share achievement"
                    >
                      <Icon name="Share2" size={12} />
                    </Button>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {achievement?.description}
                </p>

                {/* Progress Bar */}
                {!achievement?.earned && (
                  <div className="space-y-1 mb-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-muted-foreground">
                        {achievement?.currentValue}/{achievement?.targetValue}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${achievement?.progress}%`,
                          backgroundColor: getProgressColor(achievement?.progress)
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Achievement Meta */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className={`
                      px-2 py-0.5 rounded-full text-xs font-medium
                      ${achievement?.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                        achievement?.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                        achievement?.rarity === 'rare'? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }
                    `}>
                      {achievement?.rarity}
                    </span>
                    <span className="text-muted-foreground">{achievement?.points} pts</span>
                  </div>
                  {achievement?.earned && (
                    <span className="text-success text-xs">
                      {formatDate(achievement?.earnedAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Certificates Section */}
      {certificates?.length > 0 && (
        <div className="bg-card rounded-lg border border-border shadow-element-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Icon name="Award" size={20} />
            <span>Certificates</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates?.map((certificate) => (
              <div key={certificate?.id} className="border border-border rounded-lg p-4 bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="Award" size={24} color="white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{certificate?.title}</h4>
                    <p className="text-sm text-muted-foreground">{certificate?.issuer}</p>
                    <p className="text-xs text-muted-foreground">
                      Issued: {formatDate(certificate?.issuedAt)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(certificate?.downloadUrl, '_blank')}
                    iconName="Download"
                    iconPosition="left"
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Empty State */}
      {filteredAchievements?.length === 0 && (
        <div className="bg-card rounded-lg border border-border shadow-element-card p-12 text-center">
          <Icon name="Award" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Achievements Yet</h3>
          <p className="text-muted-foreground mb-4">
            Start conducting experiments and learning chemistry to earn your first achievements!
          </p>
          <Button
            variant="default"
            onClick={() => window.location.href = '/virtual-laboratory-workspace'}
            iconName="Beaker"
            iconPosition="left"
          >
            Start Experimenting
          </Button>
        </div>
      )}
    </div>
  );
};

export default Achievements;