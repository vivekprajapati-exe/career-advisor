import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReactionPanel = ({ 
  selectedElements, 
  placedEquipment, 
  onStartSimulation, 
  onStopSimulation,
  isSimulating,
  reactionResults,
  onSaveExperiment 
}) => {
  const [activeTab, setActiveTab] = useState('prediction');

  const mockReactionPredictions = [
    {
      id: 1,
      reactants: ["H", "O"],
      products: ["H₂O"],
      equation: "2H₂ + O₂ → 2H₂O",
      type: "Synthesis",
      energy: "Exothermic (-285.8 kJ/mol)",
      conditions: "Room temperature, catalyst optional",
      safety: "Low risk - produces water vapor",
      probability: 95
    },
    {
      id: 2,
      reactants: ["Na", "Cl"],
      products: ["NaCl"],
      equation: "2Na + Cl₂ → 2NaCl",
      type: "Synthesis",
      energy: "Exothermic (-411 kJ/mol)",
      conditions: "High temperature required",
      safety: "High risk - violent reaction, use fume hood",
      probability: 88
    }
  ];

  const mockProcedureSteps = [
    {
      step: 1,
      title: "Prepare Equipment",
      description: "Ensure all glassware is clean and dry. Set up fume hood if required.",
      safety: "Wear safety goggles and lab coat",
      completed: true
    },
    {
      step: 2,
      title: "Measure Reactants",
      description: "Use analytical balance to measure precise amounts of each reactant.",
      safety: "Handle chemicals with appropriate tools",
      completed: true
    },
    {
      step: 3,
      title: "Mix Components",
      description: "Slowly add reactants to the reaction vessel in the specified order.",
      safety: "Add slowly to control reaction rate",
      completed: false
    },
    {
      step: 4,
      title: "Monitor Reaction",
      description: "Observe color changes, temperature, and gas evolution.",
      safety: "Maintain safe distance, record observations",
      completed: false
    }
  ];

  const tabs = [
    { id: 'prediction', label: 'Predictions', icon: 'Brain' },
    { id: 'procedure', label: 'Procedure', icon: 'List' },
    { id: 'results', label: 'Results', icon: 'BarChart3' }
  ];

  const canStartSimulation = selectedElements?.length >= 2 && placedEquipment?.length > 0;

  const renderPredictions = () => (
    <div className="space-y-4">
      {mockReactionPredictions?.map((prediction) => (
        <div key={prediction?.id} className="p-4 border border-border rounded-lg bg-muted/20">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground">{prediction?.type} Reaction</h4>
            <div className="flex items-center space-x-1">
              <Icon name="Zap" size={16} className="text-warning" />
              <span className="text-sm text-muted-foreground">{prediction?.probability}%</span>
            </div>
          </div>
          
          <div className="font-data text-sm bg-card p-2 rounded border mb-3">
            {prediction?.equation}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <Icon name="Thermometer" size={16} className="text-destructive mt-0.5" />
              <span className="text-muted-foreground">{prediction?.energy}</span>
            </div>
            <div className="flex items-start space-x-2">
              <Icon name="Settings" size={16} className="text-primary mt-0.5" />
              <span className="text-muted-foreground">{prediction?.conditions}</span>
            </div>
            <div className="flex items-start space-x-2">
              <Icon name="Shield" size={16} className="text-warning mt-0.5" />
              <span className="text-muted-foreground">{prediction?.safety}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProcedure = () => (
    <div className="space-y-3">
      {mockProcedureSteps?.map((step) => (
        <div
          key={step?.step}
          className={`p-4 border rounded-lg ${
            step?.completed 
              ? 'border-success bg-success/5' :'border-border bg-card'
          }`}
        >
          <div className="flex items-start space-x-3">
            <div className={`
              w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
              ${step?.completed 
                ? 'bg-success text-success-foreground' 
                : 'bg-muted text-muted-foreground'
              }
            `}>
              {step?.completed ? <Icon name="Check" size={14} /> : step?.step}
            </div>
            
            <div className="flex-1">
              <h4 className="font-medium text-foreground mb-1">{step?.title}</h4>
              <p className="text-sm text-muted-foreground mb-2">{step?.description}</p>
              <div className="flex items-center space-x-1 text-xs text-warning">
                <Icon name="AlertTriangle" size={12} />
                <span>{step?.safety}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderResults = () => (
    <div className="space-y-4">
      {reactionResults ? (
        <div className="space-y-4">
          <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
            <h4 className="font-medium text-success mb-2">Reaction Complete</h4>
            <div className="font-data text-sm bg-card p-2 rounded border">
              {reactionResults?.equation}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-card border border-border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Thermometer" size={16} className="text-destructive" />
                <span className="text-sm font-medium">Temperature</span>
              </div>
              <p className="text-lg font-bold text-foreground">{reactionResults?.temperature}°C</p>
            </div>
            
            <div className="p-3 bg-card border border-border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Clock" size={16} className="text-primary" />
                <span className="text-sm font-medium">Duration</span>
              </div>
              <p className="text-lg font-bold text-foreground">{reactionResults?.duration}s</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            fullWidth
            iconName="Download"
            iconPosition="left"
            onClick={onSaveExperiment}
          >
            Save Results
          </Button>
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          <Icon name="FlaskConical" size={48} className="mx-auto mb-4 opacity-50" />
          <p>No results yet</p>
          <p className="text-sm">Run a simulation to see results</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg shadow-element-card h-full">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Beaker" size={20} />
          <span>Reaction Analysis</span>
        </h3>
      </div>
      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            className={`
              flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-ui
              ${activeTab === tab?.id
                ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }
            `}
            onClick={() => setActiveTab(tab?.id)}
          >
            <Icon name={tab?.icon} size={16} />
            <span className="hidden sm:inline">{tab?.label}</span>
          </button>
        ))}
      </div>
      {/* Content */}
      <div className="p-4 overflow-y-auto max-h-[calc(100vh-300px)]">
        {activeTab === 'prediction' && renderPredictions()}
        {activeTab === 'procedure' && renderProcedure()}
        {activeTab === 'results' && renderResults()}
      </div>
      {/* Simulation Controls */}
      <div className="p-4 border-t border-border">
        <div className="space-y-3">
          {!isSimulating ? (
            <Button
              variant="default"
              fullWidth
              onClick={onStartSimulation}
              disabled={!canStartSimulation}
              iconName="Play"
              iconPosition="left"
            >
              Start Simulation
            </Button>
          ) : (
            <Button
              variant="destructive"
              fullWidth
              onClick={onStopSimulation}
              iconName="Square"
              iconPosition="left"
            >
              Stop Simulation
            </Button>
          )}
          
          {!canStartSimulation && (
            <p className="text-xs text-muted-foreground text-center">
              Add elements and equipment to start simulation
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReactionPanel;