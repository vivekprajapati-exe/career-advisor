import React from 'react';
import Icon from '../../../components/AppIcon';

const LearningProgress = ({ progressData }) => {
  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = "var(--color-primary)" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--color-muted)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{percentage}%</span>
        </div>
      </div>
    );
  };

  const ProgressBar = ({ label, percentage, color = "var(--color-primary)" }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm text-muted-foreground">{percentage}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="bg-card rounded-lg border border-border shadow-element-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center space-x-2">
          <Icon name="TrendingUp" size={20} />
          <span>Overall Progress</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <CircularProgress 
              percentage={progressData?.overall?.completion} 
              color="var(--color-primary)"
            />
            <h4 className="mt-3 font-medium text-foreground">Course Completion</h4>
            <p className="text-sm text-muted-foreground">Overall progress across all topics</p>
          </div>
          
          <div className="text-center">
            <CircularProgress 
              percentage={progressData?.overall?.mastery} 
              color="var(--color-success)"
            />
            <h4 className="mt-3 font-medium text-foreground">Topic Mastery</h4>
            <p className="text-sm text-muted-foreground">Concepts fully understood</p>
          </div>
          
          <div className="text-center">
            <CircularProgress 
              percentage={progressData?.overall?.labSkills} 
              color="var(--color-secondary)"
            />
            <h4 className="mt-3 font-medium text-foreground">Lab Skills</h4>
            <p className="text-sm text-muted-foreground">Practical experiment proficiency</p>
          </div>
        </div>
      </div>
      {/* Topic Progress */}
      <div className="bg-card rounded-lg border border-border shadow-element-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center space-x-2">
          <Icon name="BookOpen" size={20} />
          <span>Topic Progress</span>
        </h3>
        
        <div className="space-y-4">
          {progressData?.topics?.map((topic, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${topic?.color}`}>
                    <Icon name={topic?.icon} size={20} color="white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{topic?.name}</h4>
                    <p className="text-sm text-muted-foreground">{topic?.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">{topic?.completed}/{topic?.total}</div>
                  <div className="text-xs text-muted-foreground">Lessons</div>
                </div>
              </div>
              <ProgressBar 
                label={`${topic?.name} Progress`}
                percentage={Math.round((topic?.completed / topic?.total) * 100)}
                color={topic?.colorValue}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Learning Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border shadow-element-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Icon name="Clock" size={20} />
            <span>Time Spent Learning</span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">This Week</span>
              <span className="font-medium text-foreground">{progressData?.timeSpent?.thisWeek} hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">This Month</span>
              <span className="font-medium text-foreground">{progressData?.timeSpent?.thisMonth} hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium text-foreground">{progressData?.timeSpent?.total} hours</span>
            </div>
            <div className="pt-2 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Daily Average</span>
                <span className="font-medium text-primary">{progressData?.timeSpent?.dailyAverage} hours</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border shadow-element-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Icon name="Target" size={20} />
            <span>Learning Goals</span>
          </h3>
          
          <div className="space-y-4">
            {progressData?.goals?.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">{goal?.title}</span>
                  <span className="text-xs text-muted-foreground">{goal?.deadline}</span>
                </div>
                <ProgressBar 
                  label=""
                  percentage={goal?.progress}
                  color={goal?.progress >= 100 ? "var(--color-success)" : "var(--color-primary)"}
                />
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Icon name={goal?.progress >= 100 ? "CheckCircle" : "Clock"} size={12} />
                  <span>{goal?.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningProgress;