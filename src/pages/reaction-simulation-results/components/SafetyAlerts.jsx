import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SafetyAlerts = ({ 
  reactionData = {},
  currentConditions = {},
  onDismissAlert = () => {},
  onViewSafetyInfo = () => {}
}) => {
  const [alerts, setAlerts] = useState([]);
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  // Mock safety alerts based on conditions
  useEffect(() => {
    const newAlerts = [];
    const { temperature = 298, pressure = 1.0, pH = 7.0, concentration = 0.1 } = currentConditions;

    // Temperature alerts
    if (temperature > 350) {
      newAlerts?.push({
        id: 'high-temp',
        type: 'danger',
        title: 'High Temperature Warning',
        message: `Temperature ${temperature}K exceeds safe operating limits. Risk of equipment damage and dangerous vapor formation.`,
        icon: 'AlertTriangle',
        actions: ['Reduce Temperature', 'Emergency Stop'],
        timestamp: new Date()
      });
    } else if (temperature > 320) {
      newAlerts?.push({
        id: 'elevated-temp',
        type: 'warning',
        title: 'Elevated Temperature',
        message: `Temperature ${temperature}K is above recommended range. Monitor closely for safety.`,
        icon: 'Thermometer',
        actions: ['Monitor', 'Adjust'],
        timestamp: new Date()
      });
    }

    // Pressure alerts
    if (pressure > 3.0) {
      newAlerts?.push({
        id: 'high-pressure',
        type: 'danger',
        title: 'High Pressure Alert',
        message: `Pressure ${pressure} atm exceeds safety limits. Risk of equipment failure.`,
        icon: 'AlertCircle',
        actions: ['Release Pressure', 'Emergency Stop'],
        timestamp: new Date()
      });
    }

    // pH alerts
    if (pH < 2 || pH > 12) {
      newAlerts?.push({
        id: 'extreme-ph',
        type: 'warning',
        title: 'Extreme pH Conditions',
        message: `pH ${pH?.toFixed(1)} indicates highly ${pH < 2 ? 'acidic' : 'basic'} conditions. Use appropriate safety equipment.`,
        icon: 'Shield',
        actions: ['Neutralize', 'Safety Check'],
        timestamp: new Date()
      });
    }

    // Concentration alerts
    if (concentration > 1.5) {
      newAlerts?.push({
        id: 'high-concentration',
        type: 'info',
        title: 'High Concentration Notice',
        message: `Concentration ${concentration}M is very high. Ensure proper ventilation and safety protocols.`,
        icon: 'Info',
        actions: ['Dilute', 'Ventilate'],
        timestamp: new Date()
      });
    }

    // Chemical-specific alerts
    if (reactionData?.reactants?.some(r => r?.formula?.includes('Cl'))) {
      newAlerts?.push({
        id: 'chlorine-warning',
        type: 'warning',
        title: 'Chlorine Compound Present',
        message: 'Chlorine-containing compounds detected. Ensure adequate ventilation and avoid mixing with acids.',
        icon: 'Wind',
        actions: ['Ventilate', 'Safety Protocol'],
        timestamp: new Date()
      });
    }

    // Filter out dismissed alerts
    const activeAlerts = newAlerts?.filter(alert => !dismissedAlerts?.has(alert?.id));
    setAlerts(activeAlerts);
  }, [currentConditions, reactionData, dismissedAlerts]);

  const handleDismissAlert = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
    onDismissAlert(alertId);
  };

  const getAlertStyles = (type) => {
    switch (type) {
      case 'danger':
        return {
          container: 'bg-destructive/10 border-destructive/20 border-l-4 border-l-destructive',
          icon: 'text-destructive',
          title: 'text-destructive',
          message: 'text-destructive/80'
        };
      case 'warning':
        return {
          container: 'bg-warning/10 border-warning/20 border-l-4 border-l-warning',
          icon: 'text-warning',
          title: 'text-warning',
          message: 'text-warning/80'
        };
      case 'info':
        return {
          container: 'bg-primary/10 border-primary/20 border-l-4 border-l-primary',
          icon: 'text-primary',
          title: 'text-primary',
          message: 'text-primary/80'
        };
      default:
        return {
          container: 'bg-muted border-border border-l-4 border-l-muted-foreground',
          icon: 'text-muted-foreground',
          title: 'text-foreground',
          message: 'text-muted-foreground'
        };
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp?.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  if (alerts?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-element-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Safety Status</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span className="text-sm text-success">All Clear</span>
          </div>
        </div>
        
        <div className="text-center py-8">
          <Icon name="Shield" size={48} className="text-success mx-auto mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">No Safety Alerts</h4>
          <p className="text-muted-foreground mb-4">
            All reaction conditions are within safe operating parameters.
          </p>
          <Button
            variant="outline"
            onClick={onViewSafetyInfo}
            iconName="BookOpen"
            iconPosition="left"
          >
            View Safety Guidelines
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-element-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Safety Alerts</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
          <span className="text-sm text-destructive font-medium">
            {alerts?.length} Active Alert{alerts?.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      <div className="space-y-4">
        {alerts?.map((alert) => {
          const styles = getAlertStyles(alert?.type);
          
          return (
            <div
              key={alert?.id}
              className={`rounded-lg p-4 border ${styles?.container}`}
            >
              <div className="flex items-start space-x-3">
                <Icon 
                  name={alert?.icon} 
                  size={20} 
                  className={`mt-0.5 ${styles?.icon}`} 
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-sm font-semibold ${styles?.title}`}>
                      {alert?.title}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(alert?.timestamp)}
                    </span>
                  </div>
                  
                  <p className={`text-sm ${styles?.message} mb-3`}>
                    {alert?.message}
                  </p>
                  
                  {alert?.actions && alert?.actions?.length > 0 && (
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-xs text-muted-foreground">Recommended actions:</span>
                      <div className="flex flex-wrap gap-1">
                        {alert?.actions?.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="xs"
                            className="text-xs"
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDismissAlert(alert?.id)}
                  className="text-muted-foreground hover:text-foreground"
                  title="Dismiss alert"
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Safety Actions */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="destructive"
              size="sm"
              iconName="Square"
              iconPosition="left"
            >
              Emergency Stop
            </Button>
            <Button
              variant="warning"
              size="sm"
              iconName="Pause"
              iconPosition="left"
            >
              Pause Reaction
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onViewSafetyInfo}
              iconName="BookOpen"
              iconPosition="left"
            >
              Safety Manual
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Phone"
              iconPosition="left"
            >
              Emergency Contact
            </Button>
          </div>
        </div>
      </div>
      {/* Safety Tips */}
      <div className="mt-4 p-3 bg-muted rounded-lg border border-border">
        <div className="flex items-start space-x-2">
          <Icon name="Lightbulb" size={16} className="text-warning mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <strong>Safety Reminder:</strong> Always wear appropriate PPE, ensure proper ventilation, 
            and have emergency procedures readily available. When in doubt, stop the reaction and consult safety protocols.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyAlerts;