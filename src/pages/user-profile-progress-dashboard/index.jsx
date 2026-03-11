import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import ProfileHeader from './components/ProfileHeader';
import TabNavigation from './components/TabNavigation';
import ProfileSettings from './components/ProfileSettings';
import LearningProgress from './components/LearningProgress';
import ExperimentHistory from './components/ExperimentHistory';
import Achievements from './components/Achievements';

const UserProfileProgressDashboard = () => {
  const [activeTab, setActiveTab] = useState("progress");
  const [isLoading, setIsLoading] = useState(true);

  // Mock user data
  const userData = {
    id: "user_001",
    name: "Dr. Sarah Chen",
    email: "sarah.chen@university.edu",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    institution: "Stanford University",
    location: "California, USA",
    joinDate: "September 2023",
    bio: "Chemistry PhD student passionate about organic synthesis and computational chemistry. Love exploring new reaction mechanisms and teaching chemistry concepts.",
    learningLevel: "advanced",
    notifications: {
      email: true,
      achievements: true,
      reminders: false
    },
    privacy: {
      profileVisible: true,
      progressVisible: true,
      experimentsVisible: false
    },
    stats: {
      experimentsCompleted: 127,
      hoursSpent: 89,
      achievementsEarned: 23,
      currentStreak: 12
    }
  };

  // Mock progress data
  const progressData = {
    overall: {
      completion: 78,
      mastery: 65,
      labSkills: 82
    },
    topics: [
      {
        name: "Organic Chemistry",
        description: "Carbon-based compounds and reactions",
        icon: "Atom",
        color: "bg-green-500",
        colorValue: "var(--color-success)",
        completed: 24,
        total: 30
      },
      {
        name: "Inorganic Chemistry",
        description: "Non-carbon elements and compounds",
        icon: "Zap",
        color: "bg-blue-500",
        colorValue: "var(--color-primary)",
        completed: 18,
        total: 25
      },
      {
        name: "Physical Chemistry",
        description: "Chemical phenomena through physics",
        icon: "Activity",
        color: "bg-purple-500",
        colorValue: "var(--color-secondary)",
        completed: 15,
        total: 22
      },
      {
        name: "Analytical Chemistry",
        description: "Composition and structure analysis",
        icon: "Search",
        color: "bg-orange-500",
        colorValue: "var(--color-warning)",
        completed: 12,
        total: 20
      }
    ],
    timeSpent: {
      thisWeek: 8.5,
      thisMonth: 32,
      total: 89,
      dailyAverage: 1.2
    },
    goals: [
      {
        title: "Complete Organic Chemistry Module",
        progress: 80,
        deadline: "Dec 31, 2024",
        status: "6 lessons remaining"
      },
      {
        title: "Master 50 Reaction Mechanisms",
        progress: 94,
        deadline: "Nov 30, 2024",
        status: "3 reactions to go"
      },
      {
        title: "Earn Advanced Lab Skills Badge",
        progress: 67,
        deadline: "Jan 15, 2025",
        status: "Complete 5 more complex experiments"
      }
    ]
  };

  // Mock experiment history
  const experimentHistory = [
    {
      id: "exp_001",
      name: "Aldol Condensation Reaction",
      description: "Synthesis of α,β-unsaturated carbonyl compounds through aldol condensation mechanism",
      category: "organic",
      thumbnail: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop",
      completedAt: "2024-08-20T14:30:00Z",
      duration: 45,
      successRating: 92,
      reactions: 3,
      keyResults: ["High yield", "Pure product", "Correct mechanism"]
    },
    {
      id: "exp_002",
      name: "Acid-Base Titration",
      description: "Determination of unknown acid concentration using standardized NaOH solution",
      category: "analytical",
      thumbnail: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=400&h=300&fit=crop",
      completedAt: "2024-08-18T10:15:00Z",
      duration: 30,
      successRating: 88,
      reactions: 1,
      keyResults: ["Accurate endpoint", "Precise calculations", "Good technique"]
    },
    {
      id: "exp_003",
      name: "Crystallization of Aspirin",
      description: "Purification of acetylsalicylic acid through recrystallization techniques",
      category: "organic",
      thumbnail: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=300&fit=crop",
      completedAt: "2024-08-15T16:45:00Z",
      duration: 60,
      successRating: 95,
      reactions: 2,
      keyResults: ["Pure crystals", "High recovery", "Correct melting point"]
    },
    {
      id: "exp_004",
      name: "Flame Test Analysis",
      description: "Identification of metal ions through characteristic flame colors",
      category: "inorganic",
      thumbnail: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=400&h=300&fit=crop",
      completedAt: "2024-08-12T13:20:00Z",
      duration: 25,
      successRating: 76,
      reactions: 6,
      keyResults: ["Most ions identified", "Good observations", "Some uncertainty"]
    }
  ];

  // Mock achievements data
  const achievementsData = [
    {
      id: "ach_001",
      title: "First Experiment",
      description: "Complete your first virtual chemistry experiment",
      icon: "Beaker",
      category: "experiments",
      rarity: "common",
      points: 10,
      earned: true,
      earnedAt: "2024-08-01T09:00:00Z",
      progress: 100,
      currentValue: 1,
      targetValue: 1
    },
    {
      id: "ach_002",
      title: "Reaction Master",
      description: "Successfully complete 100 chemical reactions",
      icon: "Zap",
      category: "experiments",
      rarity: "rare",
      points: 50,
      earned: true,
      earnedAt: "2024-08-15T14:30:00Z",
      progress: 100,
      currentValue: 127,
      targetValue: 100
    },
    {
      id: "ach_003",
      title: "Perfect Score",
      description: "Achieve 100% success rate in an experiment",
      icon: "Target",
      category: "experiments",
      rarity: "epic",
      points: 75,
      earned: false,
      progress: 95,
      currentValue: 95,
      targetValue: 100
    },
    {
      id: "ach_004",
      title: "Knowledge Seeker",
      description: "Read 50 element information pages",
      icon: "BookOpen",
      category: "learning",
      rarity: "common",
      points: 25,
      earned: true,
      earnedAt: "2024-08-10T11:15:00Z",
      progress: 100,
      currentValue: 67,
      targetValue: 50
    },
    {
      id: "ach_005",
      title: "Lab Marathon",
      description: "Spend 100 hours in the virtual laboratory",
      icon: "Clock",
      category: "milestones",
      rarity: "legendary",
      points: 100,
      earned: false,
      progress: 89,
      currentValue: 89,
      targetValue: 100
    },
    {
      id: "ach_006",
      title: "Social Chemist",
      description: "Share 10 experiments with other users",
      icon: "Share2",
      category: "social",
      rarity: "rare",
      points: 40,
      earned: false,
      progress: 30,
      currentValue: 3,
      targetValue: 10
    }
  ];

  const badgesData = [
    { id: "badge_001", name: "Organic Expert", rarity: "epic" },
    { id: "badge_002", name: "Safety First", rarity: "common" },
    { id: "badge_003", name: "Precision Master", rarity: "rare" }
  ];

  const certificatesData = [
    {
      id: "cert_001",
      title: "Basic Chemistry Fundamentals",
      issuer: "ChemLab Virtual Academy",
      issuedAt: "2024-08-01T00:00:00Z",
      downloadUrl: "#"
    },
    {
      id: "cert_002",
      title: "Organic Chemistry Specialist",
      issuer: "ChemLab Virtual Academy",
      issuedAt: "2024-08-15T00:00:00Z",
      downloadUrl: "#"
    }
  ];

  const tabs = [
    { id: "progress", label: "Learning Progress", icon: "TrendingUp" },
    { id: "history", label: "Experiment History", icon: "History" },
    { id: "achievements", label: "Achievements", icon: "Award" },
    { id: "settings", label: "Profile Settings", icon: "Settings" }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleEditProfile = () => {
    setActiveTab("settings");
  };

  const handleSaveProfile = async (formData) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Profile updated:", formData);
        resolve();
      }, 1000);
    });
  };

  const handleReplayExperiment = (experiment) => {
    console.log("Replaying experiment:", experiment?.id);
    // Navigate to lab with experiment data
    window.location.href = `/virtual-laboratory-workspace?replay=${experiment?.id}`;
  };

  const handleShareExperiment = (experiment) => {
    if (navigator.share) {
      navigator.share({
        title: `Check out my ${experiment?.name} experiment!`,
        text: experiment?.description,
        url: `${window.location?.origin}/reaction-simulation-results?id=${experiment?.id}`
      });
    } else {
      const shareText = `Check out my ${experiment?.name} experiment! ${experiment?.description} - ${window.location?.origin}/reaction-simulation-results?id=${experiment?.id}`;
      navigator.clipboard?.writeText(shareText);
      alert("Experiment link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 pb-20 md:pb-0">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-12 bg-muted rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 bg-muted rounded"></div>
                <div className="h-64 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Profile & Progress Dashboard - ChemLab Virtual</title>
        <meta name="description" content="Track your chemistry learning progress, view experiment history, and manage your profile in ChemLab Virtual." />
        <meta name="keywords" content="chemistry profile, learning progress, experiment history, achievements, virtual lab" />
      </Helmet>

      <Header />
      
      <div className="pt-16 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs />
          
          <ProfileHeader 
            user={userData} 
            onEditProfile={handleEditProfile}
          />
          
          <TabNavigation 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          />
          
          <div className="min-h-[400px]">
            {activeTab === "progress" && (
              <LearningProgress progressData={progressData} />
            )}
            
            {activeTab === "history" && (
              <ExperimentHistory 
                experiments={experimentHistory}
                onReplay={handleReplayExperiment}
                onShare={handleShareExperiment}
              />
            )}
            
            {activeTab === "achievements" && (
              <Achievements 
                achievements={achievementsData}
                badges={badgesData}
                certificates={certificatesData}
              />
            )}
            
            {activeTab === "settings" && (
              <ProfileSettings 
                user={userData}
                onSave={handleSaveProfile}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileProgressDashboard;