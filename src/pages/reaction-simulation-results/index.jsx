import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import all components
import ReactionAnimation from './components/ReactionAnimation';
import ReactionParameters from './components/ReactionParameters';
import LiveDataPanel from './components/LiveDataPanel';
import ChemicalEquationBalancer from './components/ChemicalEquationBalancer';
import SafetyAlerts from './components/SafetyAlerts';
import ResultsSummary from './components/ResultsSummary';
import SocialFeatures from './components/SocialFeatures';

const ReactionSimulationResults = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [parameters, setParameters] = useState({});
  const [reactionData, setReactionData] = useState({});
  const [activePanel, setActivePanel] = useState('animation');

  const simulationDuration = 120; // 2 minutes

  // Mock reaction data
  useEffect(() => {
    setReactionData({
      id: 'reaction-001',
      name: 'Sodium Chloride Dissolution',
      equation: 'NaCl + H₂O → Na⁺ + Cl⁻ + H₃O⁺',
      reactants: [
        { formula: 'NaCl', name: 'Sodium Chloride', amount: 5.85, unit: 'g' },
        { formula: 'H2O', name: 'Water', amount: 100, unit: 'mL' }
      ],
      products: [
        { formula: 'Na+', name: 'Sodium Ion', amount: 2.30, unit: 'g' },
        { formula: 'Cl-', name: 'Chloride Ion', amount: 3.55, unit: 'g' }
      ],
      conditions: {
        temperature: 298,
        pressure: 1.0,
        pH: 7.0,
        concentration: 0.1
      }
    });
  }, []);

  // Animation control
  useEffect(() => {
    let interval;
    if (isSimulating && currentTime < simulationDuration) {
      interval = setInterval(() => {
        setCurrentTime(prev => Math.min(prev + (0.5 * animationSpeed), simulationDuration));
      }, 500);
    } else if (currentTime >= simulationDuration) {
      setIsSimulating(false);
    }
    return () => clearInterval(interval);
  }, [isSimulating, currentTime, animationSpeed, simulationDuration]);

  const handlePlayPause = () => {
    setIsSimulating(!isSimulating);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsSimulating(false);
  };

  const handleTimeChange = (newTime) => {
    setCurrentTime(newTime);
  };

  const handleParameterChange = (newParams) => {
    setParameters(newParams);
  };

  const handleSpeedChange = (speed) => {
    setAnimationSpeed(speed);
  };

  const handleExportReport = () => {
    console.log('Exporting lab report...');
  };

  const handleSaveResults = () => {
    console.log('Saving results...');
  };

  const handleShareResults = () => {
    console.log('Sharing results...');
  };

  const panels = [
    { id: 'animation', label: 'Animation', icon: 'Play' },
    { id: 'data', label: 'Live Data', icon: 'BarChart3' },
    { id: 'equation', label: 'Equation', icon: 'Calculator' },
    { id: 'safety', label: 'Safety', icon: 'Shield' },
    { id: 'results', label: 'Results', icon: 'Target' },
    { id: 'social', label: 'Share', icon: 'Share2' }
  ];

  const customBreadcrumbs = [
    { label: 'Home', path: '/', icon: 'Home' },
    { label: 'Virtual Laboratory', path: '/virtual-laboratory-workspace' },
    { label: 'Reaction Results', path: '/reaction-simulation-results', current: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 pb-20 md:pb-6">
        <div className="container mx-auto px-4 lg:px-6 py-6">
          <Breadcrumbs customBreadcrumbs={customBreadcrumbs} />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Reaction Simulation & Results
              </h1>
              <p className="text-muted-foreground">
                Analyze chemical processes with detailed visualization and data analysis tools
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-2 bg-muted rounded-lg border border-border">
                <div className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
                <span className="text-sm text-muted-foreground">
                  {isSimulating ? 'Simulating' : 'Paused'}
                </span>
              </div>
              
              <Button
                variant="outline"
                onClick={() => window.history?.back()}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Back to Lab
              </Button>
            </div>
          </div>

          {/* Mobile Panel Selector */}
          <div className="lg:hidden mb-6">
            <div className="flex overflow-x-auto space-x-1 bg-muted rounded-lg p-1">
              {panels?.map(panel => (
                <Button
                  key={panel?.id}
                  variant={activePanel === panel?.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActivePanel(panel?.id)}
                  iconName={panel?.icon}
                  iconPosition="left"
                  className="whitespace-nowrap"
                >
                  {panel?.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-6">
            {/* Left Panel - Parameters */}
            <div className="lg:col-span-3 space-y-6">
              <ReactionParameters
                parameters={parameters}
                onParameterChange={handleParameterChange}
                isSimulating={isSimulating}
              />
              
              <SafetyAlerts
                reactionData={reactionData}
                currentConditions={parameters}
              />
            </div>

            {/* Center Panel - Animation */}
            <div className="lg:col-span-6 space-y-6">
              <ReactionAnimation
                reactionData={reactionData}
                isPlaying={isSimulating}
                currentTime={currentTime}
                duration={simulationDuration}
                onTimeChange={handleTimeChange}
                onPlayPause={handlePlayPause}
                onRestart={handleRestart}
                animationSpeed={animationSpeed}
              />
              
              <ChemicalEquationBalancer
                initialEquation={reactionData}
                isSimulating={isSimulating}
              />
            </div>

            {/* Right Panel - Data & Results */}
            <div className="lg:col-span-3 space-y-6">
              <LiveDataPanel
                reactionData={reactionData}
                isSimulating={isSimulating}
                currentTime={currentTime}
              />
            </div>
          </div>

          {/* Mobile Layout - Single Panel */}
          <div className="lg:hidden">
            {activePanel === 'animation' && (
              <div className="space-y-6">
                <ReactionAnimation
                  reactionData={reactionData}
                  isPlaying={isSimulating}
                  currentTime={currentTime}
                  duration={simulationDuration}
                  onTimeChange={handleTimeChange}
                  onPlayPause={handlePlayPause}
                  onRestart={handleRestart}
                  animationSpeed={animationSpeed}
                />
                <ReactionParameters
                  parameters={parameters}
                  onParameterChange={handleParameterChange}
                  isSimulating={isSimulating}
                />
              </div>
            )}
            
            {activePanel === 'data' && (
              <LiveDataPanel
                reactionData={reactionData}
                isSimulating={isSimulating}
                currentTime={currentTime}
              />
            )}
            
            {activePanel === 'equation' && (
              <ChemicalEquationBalancer
                initialEquation={reactionData}
                isSimulating={isSimulating}
              />
            )}
            
            {activePanel === 'safety' && (
              <SafetyAlerts
                reactionData={reactionData}
                currentConditions={parameters}
              />
            )}
            
            {activePanel === 'results' && (
              <ResultsSummary
                reactionData={reactionData}
                onExportReport={handleExportReport}
                onSaveResults={handleSaveResults}
                onShareResults={handleShareResults}
              />
            )}
            
            {activePanel === 'social' && (
              <SocialFeatures
                reactionData={reactionData}
                onShareReaction={handleShareResults}
                onSaveToFavorites={handleSaveResults}
              />
            )}
          </div>

          {/* Desktop Results & Social Sections */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-6 mt-6">
            <ResultsSummary
              reactionData={reactionData}
              onExportReport={handleExportReport}
              onSaveResults={handleSaveResults}
              onShareResults={handleShareResults}
            />
            
            <SocialFeatures
              reactionData={reactionData}
              onShareReaction={handleShareResults}
              onSaveToFavorites={handleSaveResults}
            />
          </div>

          {/* Quick Actions Footer */}
          <div className="mt-8 p-4 bg-muted rounded-lg border border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-muted-foreground">
                  Experiment: <span className="font-medium text-foreground">{reactionData?.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Progress: <span className="font-medium text-foreground">
                    {Math.round((currentTime / simulationDuration) * 100)}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="RotateCcw"
                  iconPosition="left"
                  onClick={handleRestart}
                >
                  New Experiment
                </Button>
                
                <Button
                  variant="default"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                  onClick={handleExportReport}
                >
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/element-information-detail"
              className="flex items-center space-x-3 p-4 bg-card border border-border rounded-lg hover:bg-muted transition-ui"
            >
              <Icon name="Atom" size={24} className="text-primary" />
              <div>
                <div className="font-medium text-foreground">Element Information</div>
                <div className="text-sm text-muted-foreground">Explore periodic table properties</div>
              </div>
            </Link>
            
            <Link
              to="/virtual-laboratory-workspace"
              className="flex items-center space-x-3 p-4 bg-card border border-border rounded-lg hover:bg-muted transition-ui"
            >
              <Icon name="FlaskConical" size={24} className="text-secondary" />
              <div>
                <div className="font-medium text-foreground">Virtual Laboratory</div>
                <div className="text-sm text-muted-foreground">Conduct new experiments</div>
              </div>
            </Link>
            
            <Link
              to="/user-profile-progress-dashboard"
              className="flex items-center space-x-3 p-4 bg-card border border-border rounded-lg hover:bg-muted transition-ui"
            >
              <Icon name="User" size={24} className="text-warning" />
              <div>
                <div className="font-medium text-foreground">Profile & Progress</div>
                <div className="text-sm text-muted-foreground">Track learning achievements</div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReactionSimulationResults;