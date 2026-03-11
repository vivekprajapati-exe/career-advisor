import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LiveDataPanel = ({ 
  reactionData = {},
  isSimulating = false,
  currentTime = 0
}) => {
  const [activeTab, setActiveTab] = useState('rate');
  const [dataHistory, setDataHistory] = useState([]);

  // Mock live data generation
  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(() => {
        const newDataPoint = {
          time: currentTime,
          reactionRate: Math.max(0, 100 * Math.exp(-currentTime / 30) + Math.random() * 10),
          temperature: 298 + Math.sin(currentTime / 10) * 5 + Math.random() * 2,
          pH: 7.0 + Math.sin(currentTime / 15) * 1.5 + Math.random() * 0.5,
          concentration: Math.max(0, 0.1 - currentTime * 0.002 + Math.random() * 0.01),
          pressure: 1.0 + Math.sin(currentTime / 20) * 0.1 + Math.random() * 0.05,
          energy: -50 + Math.sin(currentTime / 8) * 20 + Math.random() * 5
        };

        setDataHistory(prev => {
          const updated = [...prev, newDataPoint];
          return updated?.slice(-50); // Keep last 50 points
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isSimulating, currentTime]);

  const tabs = [
    { id: 'rate', label: 'Reaction Rate', icon: 'TrendingUp' },
    { id: 'equilibrium', label: 'Equilibrium', icon: 'Scale' },
    { id: 'energy', label: 'Energy', icon: 'Zap' },
    { id: 'conditions', label: 'Conditions', icon: 'Settings' }
  ];

  const getCurrentValues = () => {
    const latest = dataHistory?.[dataHistory?.length - 1];
    return latest || {
      reactionRate: 0,
      temperature: 298,
      pH: 7.0,
      concentration: 0.1,
      pressure: 1.0,
      energy: -50
    };
  };

  const currentValues = getCurrentValues();

  const renderRateChart = () => (
    <div className="space-y-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dataHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="reactionRate" 
              stroke="var(--color-primary)" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted rounded-lg p-3">
          <div className="text-sm text-muted-foreground">Current Rate</div>
          <div className="text-lg font-semibold text-foreground">
            {currentValues?.reactionRate?.toFixed(2)} mol/s
          </div>
        </div>
        <div className="bg-muted rounded-lg p-3">
          <div className="text-sm text-muted-foreground">Average Rate</div>
          <div className="text-lg font-semibold text-foreground">
            {dataHistory?.length > 0 
              ? (dataHistory?.reduce((sum, d) => sum + d?.reactionRate, 0) / dataHistory?.length)?.toFixed(2)
              : '0.00'
            } mol/s
          </div>
        </div>
      </div>
    </div>
  );

  const renderEquilibriumChart = () => (
    <div className="space-y-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dataHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="concentration" 
              stroke="var(--color-secondary)" 
              fill="var(--color-secondary)"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-muted rounded-lg p-3 text-center">
          <div className="text-xs text-muted-foreground">Reactants</div>
          <div className="text-sm font-semibold text-destructive">
            {(currentValues?.concentration * 100)?.toFixed(1)}%
          </div>
        </div>
        <div className="bg-muted rounded-lg p-3 text-center">
          <div className="text-xs text-muted-foreground">Products</div>
          <div className="text-sm font-semibold text-success">
            {((0.1 - currentValues?.concentration) * 100 / 0.1)?.toFixed(1)}%
          </div>
        </div>
        <div className="bg-muted rounded-lg p-3 text-center">
          <div className="text-xs text-muted-foreground">Equilibrium</div>
          <div className="text-sm font-semibold text-warning">
            {currentValues?.reactionRate < 5 ? 'Near' : 'Far'}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEnergyChart = () => (
    <div className="space-y-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dataHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="energy" 
              stroke="var(--color-warning)" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted rounded-lg p-3">
          <div className="text-sm text-muted-foreground">Current Energy</div>
          <div className="text-lg font-semibold text-foreground">
            {currentValues?.energy?.toFixed(1)} kJ/mol
          </div>
        </div>
        <div className="bg-muted rounded-lg p-3">
          <div className="text-sm text-muted-foreground">Energy Change</div>
          <div className="text-lg font-semibold text-foreground">
            {dataHistory?.length > 1 
              ? (currentValues?.energy - dataHistory?.[0]?.energy)?.toFixed(1)
              : '0.0'
            } kJ/mol
          </div>
        </div>
      </div>
    </div>
  );

  const renderConditionsPanel = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Temperature */}
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Thermometer" size={16} className="text-destructive" />
            <span className="text-sm font-medium text-foreground">Temperature</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {currentValues?.temperature?.toFixed(1)}K
          </div>
          <div className="text-xs text-muted-foreground">
            {(currentValues?.temperature - 273.15)?.toFixed(1)}°C
          </div>
        </div>

        {/* pH */}
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TestTube" size={16} className="text-warning" />
            <span className="text-sm font-medium text-foreground">pH Level</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {currentValues?.pH?.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground">
            {currentValues?.pH < 7 ? 'Acidic' : currentValues?.pH > 7 ? 'Basic' : 'Neutral'}
          </div>
        </div>

        {/* Pressure */}
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Gauge" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Pressure</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {currentValues?.pressure?.toFixed(2)} atm
          </div>
          <div className="text-xs text-muted-foreground">
            {(currentValues?.pressure * 101.325)?.toFixed(0)} kPa
          </div>
        </div>

        {/* Concentration */}
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Droplets" size={16} className="text-secondary" />
            <span className="text-sm font-medium text-foreground">Concentration</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {currentValues?.concentration?.toFixed(3)} M
          </div>
          <div className="text-xs text-muted-foreground">
            Molarity
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center space-x-2 p-2 bg-success/10 rounded-lg border border-success/20">
          <Icon name="CheckCircle" size={16} className="text-success" />
          <span className="text-sm text-success">Stable</span>
        </div>
        <div className="flex items-center space-x-2 p-2 bg-warning/10 rounded-lg border border-warning/20">
          <Icon name="AlertTriangle" size={16} className="text-warning" />
          <span className="text-sm text-warning">Monitoring</span>
        </div>
        <div className="flex items-center space-x-2 p-2 bg-primary/10 rounded-lg border border-primary/20">
          <Icon name="Activity" size={16} className="text-primary" />
          <span className="text-sm text-primary">Active</span>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'rate':
        return renderRateChart();
      case 'equilibrium':
        return renderEquilibriumChart();
      case 'energy':
        return renderEnergyChart();
      case 'conditions':
        return renderConditionsPanel();
      default:
        return renderRateChart();
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-element-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Live Data Analysis</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
          <span className="text-sm text-muted-foreground">
            {isSimulating ? 'Recording' : 'Paused'}
          </span>
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
      <div className="min-h-[300px]">
        {renderTabContent()}
      </div>
      {/* Data Export */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Data points: {dataHistory?.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            disabled={dataHistory?.length === 0}
          >
            Export Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveDataPanel;