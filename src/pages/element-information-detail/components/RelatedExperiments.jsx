import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RelatedExperiments = ({ element }) => {
  const experiments = [
    {
      id: 1,
      title: `${element?.name} Oxidation Reactions`,
      description: `Explore how ${element?.name} reacts with oxygen and other oxidizing agents to form various compounds.`,
      difficulty: "Intermediate",
      duration: "45 minutes",
      safetyLevel: element?.hazardLevel,
      materials: [`${element?.name}`, "Oxygen", "Bunsen Burner", "Test Tubes"],
      icon: "Flame"
    },
    {
      id: 2,
      title: `${element?.name} Compound Formation`,
      description: `Learn about the different compounds that ${element?.name} can form and their properties.`,
      difficulty: "Beginner",
      duration: "30 minutes",
      safetyLevel: "low",
      materials: [`${element?.name}`, "Various Reagents", "Beakers", "pH Strips"],
      icon: "Beaker"
    },
    {
      id: 3,
      title: `${element?.name} Spectral Analysis`,
      description: `Analyze the emission spectrum of ${element?.name} and identify characteristic wavelengths.`,
      difficulty: "Advanced",
      duration: "60 minutes",
      safetyLevel: "moderate",
      materials: [`${element?.name} Sample`, "Spectrometer", "Flame Source"],
      icon: "Zap"
    }
  ];

  const getDifficultyColor = (difficulty) => {
    const colors = {
      "Beginner": "text-success",
      "Intermediate": "text-warning",
      "Advanced": "text-error"
    };
    return colors?.[difficulty] || "text-muted-foreground";
  };

  const getSafetyColor = (level) => {
    const colors = {
      "low": "text-success",
      "moderate": "text-warning",
      "high": "text-error",
      "extreme": "text-destructive"
    };
    return colors?.[level] || "text-muted-foreground";
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-element-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground flex items-center space-x-2">
          <Icon name="FlaskConical" size={24} />
          <span>Related Experiments</span>
        </h3>
        
        <Link to="/virtual-laboratory-workspace">
          <Button variant="outline" iconName="ArrowRight" iconPosition="right">
            View All
          </Button>
        </Link>
      </div>
      <div className="space-y-4">
        {experiments?.map((experiment) => (
          <div key={experiment?.id} className="border border-border rounded-lg p-4 hover:shadow-lab-equipment transition-ui">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={experiment?.icon} size={24} className="text-primary" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-medium text-foreground mb-2">{experiment?.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{experiment?.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 mb-3">
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{experiment?.duration}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Icon name="TrendingUp" size={14} className={getDifficultyColor(experiment?.difficulty)} />
                    <span className={`text-xs ${getDifficultyColor(experiment?.difficulty)}`}>
                      {experiment?.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Icon name="Shield" size={14} className={getSafetyColor(experiment?.safetyLevel)} />
                    <span className={`text-xs ${getSafetyColor(experiment?.safetyLevel)}`}>
                      {experiment?.safetyLevel} risk
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-xs font-medium text-foreground mb-1">Required Materials:</div>
                  <div className="flex flex-wrap gap-1">
                    {experiment?.materials?.map((material, index) => (
                      <span key={index} className="inline-block bg-muted text-xs px-2 py-1 rounded">
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link to="/virtual-laboratory-workspace">
                    <Button variant="default" size="sm" iconName="Play" iconPosition="left">
                      Start Experiment
                    </Button>
                  </Link>
                  
                  <Button variant="outline" size="sm" iconName="BookOpen" iconPosition="left">
                    View Guide
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Lightbulb" size={16} className="text-warning" />
          <span className="text-sm font-medium text-foreground">Experiment Tips</span>
        </div>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Always review safety protocols before starting any experiment</li>
          <li>• Ensure you have all required materials and equipment ready</li>
          <li>• Take notes during the experiment for better learning outcomes</li>
          <li>• Use the simulation mode first to understand the process</li>
        </ul>
      </div>
    </div>
  );
};

export default RelatedExperiments;