import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResultsSummary = ({ 
  reactionData = {},
  simulationResults = {},
  onExportReport = () => {},
  onSaveResults = () => {},
  onShareResults = () => {}
}) => {
  const [activeSection, setActiveSection] = useState('yield');

  // Mock results data
  const mockResults = {
    yield: {
      theoretical: 85.6,
      actual: 78.2,
      efficiency: 91.4,
      unit: '%'
    },
    byproducts: [
      { name: 'Water vapor', amount: 12.3, unit: 'mL', significance: 'Expected' },
      { name: 'Trace salts', amount: 0.8, unit: 'g', significance: 'Minor' },
      { name: 'Unreacted NaCl', amount: 2.1, unit: 'g', significance: 'Residual' }
    ],
    energetics: {
      totalEnergyChange: -45.2,
      activationEnergy: 23.8,
      heatReleased: 67.4,
      unit: 'kJ/mol'
    },
    kinetics: {
      reactionRate: 0.045,
      halfLife: 15.4,
      rateConstant: 0.0029,
      unit: 'mol/L·s'
    },
    equilibrium: {
      equilibriumConstant: 1.85e-4,
      position: 'Favors products',
      completion: 94.2,
      unit: '%'
    },
    ...simulationResults
  };

  const sections = [
    { id: 'yield', label: 'Yield Analysis', icon: 'Target' },
    { id: 'byproducts', label: 'Byproducts', icon: 'Beaker' },
    { id: 'energetics', label: 'Energy', icon: 'Zap' },
    { id: 'kinetics', label: 'Kinetics', icon: 'TrendingUp' },
    { id: 'equilibrium', label: 'Equilibrium', icon: 'Scale' }
  ];

  const renderYieldAnalysis = () => (
    <div className="space-y-6">
      {/* Yield Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {mockResults?.yield?.theoretical}%
          </div>
          <div className="text-sm text-muted-foreground">Theoretical Yield</div>
        </div>
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-success mb-1">
            {mockResults?.yield?.actual}%
          </div>
          <div className="text-sm text-muted-foreground">Actual Yield</div>
        </div>
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-warning mb-1">
            {mockResults?.yield?.efficiency}%
          </div>
          <div className="text-sm text-muted-foreground">Efficiency</div>
        </div>
      </div>

      {/* Yield Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Yield Progress</span>
          <span className="font-medium">{mockResults?.yield?.actual}% of {mockResults?.yield?.theoretical}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className="bg-success h-3 rounded-full transition-all duration-500"
            style={{ width: `${(mockResults?.yield?.actual / mockResults?.yield?.theoretical) * 100}%` }}
          />
        </div>
      </div>

      {/* Analysis */}
      <div className="bg-muted rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-2">Yield Analysis</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• The reaction achieved {mockResults?.yield?.efficiency}% efficiency, which is considered excellent for this type of reaction.</p>
          <p>• The difference between theoretical and actual yield ({(mockResults?.yield?.theoretical - mockResults?.yield?.actual)?.toFixed(1)}%) is within expected parameters.</p>
          <p>• Factors affecting yield: temperature optimization, reaction time, and catalyst effectiveness.</p>
        </div>
      </div>
    </div>
  );

  const renderByproducts = () => (
    <div className="space-y-4">
      {mockResults?.byproducts?.map((byproduct, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border">
          <div className="flex items-center space-x-3">
            <Icon name="TestTube" size={20} className="text-secondary" />
            <div>
              <div className="font-medium text-foreground">{byproduct?.name}</div>
              <div className="text-sm text-muted-foreground">{byproduct?.significance}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-foreground">
              {byproduct?.amount} {byproduct?.unit}
            </div>
            <div className={`text-xs px-2 py-1 rounded-full ${
              byproduct?.significance === 'Expected' ? 'bg-success/10 text-success' :
              byproduct?.significance === 'Minor'? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'
            }`}>
              {byproduct?.significance}
            </div>
          </div>
        </div>
      ))}
      
      <div className="bg-muted rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-2">Byproduct Summary</h4>
        <div className="text-sm text-muted-foreground">
          Total byproducts identified: {mockResults?.byproducts?.length}. 
          Most byproducts are expected and within normal ranges for this reaction type.
        </div>
      </div>
    </div>
  );

  const renderEnergetics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingDown" size={16} className="text-success" />
            <span className="text-sm font-medium text-foreground">Energy Change</span>
          </div>
          <div className="text-2xl font-bold text-success">
            {mockResults?.energetics?.totalEnergyChange} {mockResults?.energetics?.unit}
          </div>
          <div className="text-xs text-muted-foreground">Exothermic reaction</div>
        </div>
        
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Mountain" size={16} className="text-warning" />
            <span className="text-sm font-medium text-foreground">Activation Energy</span>
          </div>
          <div className="text-2xl font-bold text-warning">
            {mockResults?.energetics?.activationEnergy} {mockResults?.energetics?.unit}
          </div>
          <div className="text-xs text-muted-foreground">Energy barrier</div>
        </div>
      </div>

      {/* Energy Diagram */}
      <div className="bg-muted rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-3">Energy Profile</h4>
        <div className="h-32 bg-background rounded border border-border flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Icon name="BarChart3" size={32} className="mx-auto mb-2" />
            <div className="text-sm">Energy diagram visualization</div>
          </div>
        </div>
      </div>

      <div className="bg-muted rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-2">Energy Analysis</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Heat released: {mockResults?.energetics?.heatReleased} {mockResults?.energetics?.unit}</p>
          <p>• The reaction is exothermic, releasing energy to the surroundings</p>
          <p>• Activation energy is moderate, allowing reaction to proceed at room temperature</p>
        </div>
      </div>
    </div>
  );

  const renderKinetics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-lg font-bold text-primary mb-1">
            {mockResults?.kinetics?.reactionRate}
          </div>
          <div className="text-xs text-muted-foreground">Reaction Rate<br/>{mockResults?.kinetics?.unit}</div>
        </div>
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-lg font-bold text-secondary mb-1">
            {mockResults?.kinetics?.halfLife} min
          </div>
          <div className="text-xs text-muted-foreground">Half-life</div>
        </div>
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-lg font-bold text-warning mb-1">
            {mockResults?.kinetics?.rateConstant}
          </div>
          <div className="text-xs text-muted-foreground">Rate Constant</div>
        </div>
      </div>

      <div className="bg-muted rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-2">Kinetic Analysis</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• The reaction follows first-order kinetics</p>
          <p>• Rate is moderately fast, suitable for laboratory conditions</p>
          <p>• Half-life indicates steady progress toward equilibrium</p>
        </div>
      </div>
    </div>
  );

  const renderEquilibrium = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Scale" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Equilibrium Constant</span>
          </div>
          <div className="text-xl font-bold text-primary">
            {mockResults?.equilibrium?.equilibriumConstant?.toExponential(2)}
          </div>
          <div className="text-xs text-muted-foreground">{mockResults?.equilibrium?.position}</div>
        </div>
        
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Target" size={16} className="text-success" />
            <span className="text-sm font-medium text-foreground">Completion</span>
          </div>
          <div className="text-xl font-bold text-success">
            {mockResults?.equilibrium?.completion}%
          </div>
          <div className="text-xs text-muted-foreground">Reaction progress</div>
        </div>
      </div>

      <div className="bg-muted rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-2">Equilibrium Analysis</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Equilibrium strongly favors product formation</p>
          <p>• High completion percentage indicates efficient conversion</p>
          <p>• System reaches equilibrium within reasonable time frame</p>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'yield':
        return renderYieldAnalysis();
      case 'byproducts':
        return renderByproducts();
      case 'energetics':
        return renderEnergetics();
      case 'kinetics':
        return renderKinetics();
      case 'equilibrium':
        return renderEquilibrium();
      default:
        return renderYieldAnalysis();
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-element-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Results Summary</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveResults}
            iconName="Save"
            iconPosition="left"
          >
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onShareResults}
            iconName="Share"
            iconPosition="left"
          >
            Share
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onExportReport}
            iconName="Download"
            iconPosition="left"
          >
            Export Report
          </Button>
        </div>
      </div>
      {/* Section Navigation */}
      <div className="flex flex-wrap gap-1 mb-6 bg-muted rounded-lg p-1">
        {sections?.map(section => (
          <Button
            key={section?.id}
            variant={activeSection === section?.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveSection(section?.id)}
            iconName={section?.icon}
            iconPosition="left"
            className="flex-1 min-w-0"
          >
            <span className="hidden sm:inline">{section?.label}</span>
            <span className="sm:hidden">{section?.icon}</span>
          </Button>
        ))}
      </div>
      {/* Section Content */}
      <div className="min-h-[400px]">
        {renderSectionContent()}
      </div>
      {/* Overall Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
          <div className="flex items-start space-x-3">
            <Icon name="CheckCircle" size={20} className="text-success mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground mb-1">Experiment Summary</h4>
              <p className="text-sm text-muted-foreground">
                The reaction completed successfully with {mockResults?.yield?.actual}% yield and {mockResults?.yield?.efficiency}% efficiency. 
                All safety parameters were maintained within acceptable ranges. 
                Results are consistent with theoretical predictions and literature values.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsSummary;