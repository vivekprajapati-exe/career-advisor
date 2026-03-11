import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ReactionParameters = ({ 
  parameters = {},
  onParameterChange = () => {},
  onResetParameters = () => {},
  isSimulating = false
}) => {
  const [localParams, setLocalParams] = useState({
    temperature: 298,
    pressure: 1.0,
    concentration: 0.1,
    pH: 7.0,
    volume: 100,
    catalystAmount: 0,
    ...parameters
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleParameterChange = (key, value) => {
    const newParams = { ...localParams, [key]: parseFloat(value) || 0 };
    setLocalParams(newParams);
    onParameterChange(newParams);
  };

  const resetToDefaults = () => {
    const defaults = {
      temperature: 298,
      pressure: 1.0,
      concentration: 0.1,
      pH: 7.0,
      volume: 100,
      catalystAmount: 0
    };
    setLocalParams(defaults);
    onParameterChange(defaults);
    onResetParameters();
  };

  const parameterRanges = {
    temperature: { min: 273, max: 373, step: 1, unit: 'K' },
    pressure: { min: 0.1, max: 5.0, step: 0.1, unit: 'atm' },
    concentration: { min: 0.01, max: 2.0, step: 0.01, unit: 'M' },
    pH: { min: 0, max: 14, step: 0.1, unit: '' },
    volume: { min: 10, max: 500, step: 10, unit: 'mL' },
    catalystAmount: { min: 0, max: 10, step: 0.1, unit: 'g' }
  };

  const getParameterStatus = (key, value) => {
    switch (key) {
      case 'temperature':
        if (value < 283) return { status: 'warning', message: 'Low temperature may slow reaction' };
        if (value > 350) return { status: 'danger', message: 'High temperature - safety concern' };
        return { status: 'normal', message: 'Optimal temperature range' };
      case 'pressure':
        if (value > 3.0) return { status: 'warning', message: 'High pressure conditions' };
        return { status: 'normal', message: 'Standard pressure' };
      case 'pH':
        if (value < 3 || value > 11) return { status: 'warning', message: 'Extreme pH conditions' };
        return { status: 'normal', message: 'Neutral to mild conditions' };
      default:
        return { status: 'normal', message: '' };
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-element-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Reaction Parameters</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            Advanced
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetToDefaults}
            disabled={isSimulating}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset
          </Button>
        </div>
      </div>
      <div className="space-y-6">
        {/* Basic Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icon name="Thermometer" size={16} className="text-destructive" />
              <label className="text-sm font-medium text-foreground">Temperature</label>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min={parameterRanges?.temperature?.min}
                max={parameterRanges?.temperature?.max}
                step={parameterRanges?.temperature?.step}
                value={localParams?.temperature}
                onChange={(e) => handleParameterChange('temperature', e?.target?.value)}
                disabled={isSimulating}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex items-center justify-between">
                <Input
                  type="number"
                  value={localParams?.temperature}
                  onChange={(e) => handleParameterChange('temperature', e?.target?.value)}
                  disabled={isSimulating}
                  className="w-20 text-center"
                />
                <span className="text-sm text-muted-foreground">{parameterRanges?.temperature?.unit}</span>
              </div>
              {(() => {
                const status = getParameterStatus('temperature', localParams?.temperature);
                return status?.message && (
                  <div className={`flex items-center space-x-1 text-xs ${
                    status?.status === 'danger' ? 'text-destructive' : 
                    status?.status === 'warning' ? 'text-warning' : 'text-success'
                  }`}>
                    <Icon name={status?.status === 'normal' ? "CheckCircle" : "AlertTriangle"} size={12} />
                    <span>{status?.message}</span>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Pressure */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icon name="Gauge" size={16} className="text-primary" />
              <label className="text-sm font-medium text-foreground">Pressure</label>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min={parameterRanges?.pressure?.min}
                max={parameterRanges?.pressure?.max}
                step={parameterRanges?.pressure?.step}
                value={localParams?.pressure}
                onChange={(e) => handleParameterChange('pressure', e?.target?.value)}
                disabled={isSimulating}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex items-center justify-between">
                <Input
                  type="number"
                  value={localParams?.pressure}
                  onChange={(e) => handleParameterChange('pressure', e?.target?.value)}
                  disabled={isSimulating}
                  className="w-20 text-center"
                />
                <span className="text-sm text-muted-foreground">{parameterRanges?.pressure?.unit}</span>
              </div>
            </div>
          </div>

          {/* Concentration */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icon name="Droplets" size={16} className="text-secondary" />
              <label className="text-sm font-medium text-foreground">Concentration</label>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min={parameterRanges?.concentration?.min}
                max={parameterRanges?.concentration?.max}
                step={parameterRanges?.concentration?.step}
                value={localParams?.concentration}
                onChange={(e) => handleParameterChange('concentration', e?.target?.value)}
                disabled={isSimulating}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex items-center justify-between">
                <Input
                  type="number"
                  value={localParams?.concentration}
                  onChange={(e) => handleParameterChange('concentration', e?.target?.value)}
                  disabled={isSimulating}
                  className="w-20 text-center"
                />
                <span className="text-sm text-muted-foreground">{parameterRanges?.concentration?.unit}</span>
              </div>
            </div>
          </div>

          {/* pH */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icon name="TestTube" size={16} className="text-warning" />
              <label className="text-sm font-medium text-foreground">pH Level</label>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min={parameterRanges?.pH?.min}
                max={parameterRanges?.pH?.max}
                step={parameterRanges?.pH?.step}
                value={localParams?.pH}
                onChange={(e) => handleParameterChange('pH', e?.target?.value)}
                disabled={isSimulating}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex items-center justify-between">
                <Input
                  type="number"
                  value={localParams?.pH}
                  onChange={(e) => handleParameterChange('pH', e?.target?.value)}
                  disabled={isSimulating}
                  className="w-20 text-center"
                />
                <span className="text-sm text-muted-foreground">
                  {localParams?.pH < 7 ? 'Acidic' : localParams?.pH > 7 ? 'Basic' : 'Neutral'}
                </span>
              </div>
              {(() => {
                const status = getParameterStatus('pH', localParams?.pH);
                return status?.message && (
                  <div className={`flex items-center space-x-1 text-xs ${
                    status?.status === 'warning' ? 'text-warning' : 'text-success'
                  }`}>
                    <Icon name={status?.status === 'normal' ? "CheckCircle" : "AlertTriangle"} size={12} />
                    <span>{status?.message}</span>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Advanced Parameters */}
        {showAdvanced && (
          <div className="border-t border-border pt-6">
            <h4 className="text-md font-medium text-foreground mb-4">Advanced Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Volume */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Icon name="Beaker" size={16} className="text-primary" />
                  <label className="text-sm font-medium text-foreground">Solution Volume</label>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min={parameterRanges?.volume?.min}
                    max={parameterRanges?.volume?.max}
                    step={parameterRanges?.volume?.step}
                    value={localParams?.volume}
                    onChange={(e) => handleParameterChange('volume', e?.target?.value)}
                    disabled={isSimulating}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex items-center justify-between">
                    <Input
                      type="number"
                      value={localParams?.volume}
                      onChange={(e) => handleParameterChange('volume', e?.target?.value)}
                      disabled={isSimulating}
                      className="w-20 text-center"
                    />
                    <span className="text-sm text-muted-foreground">{parameterRanges?.volume?.unit}</span>
                  </div>
                </div>
              </div>

              {/* Catalyst */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Icon name="Zap" size={16} className="text-warning" />
                  <label className="text-sm font-medium text-foreground">Catalyst Amount</label>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min={parameterRanges?.catalystAmount?.min}
                    max={parameterRanges?.catalystAmount?.max}
                    step={parameterRanges?.catalystAmount?.step}
                    value={localParams?.catalystAmount}
                    onChange={(e) => handleParameterChange('catalystAmount', e?.target?.value)}
                    disabled={isSimulating}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex items-center justify-between">
                    <Input
                      type="number"
                      value={localParams?.catalystAmount}
                      onChange={(e) => handleParameterChange('catalystAmount', e?.target?.value)}
                      disabled={isSimulating}
                      className="w-20 text-center"
                    />
                    <span className="text-sm text-muted-foreground">{parameterRanges?.catalystAmount?.unit}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Parameter Summary */}
        <div className="bg-muted rounded-lg p-4 border border-border">
          <h4 className="text-sm font-medium text-foreground mb-2">Current Conditions Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Temp:</span>
              <span className="ml-1 font-medium">{localParams?.temperature}K</span>
            </div>
            <div>
              <span className="text-muted-foreground">Press:</span>
              <span className="ml-1 font-medium">{localParams?.pressure} atm</span>
            </div>
            <div>
              <span className="text-muted-foreground">Conc:</span>
              <span className="ml-1 font-medium">{localParams?.concentration}M</span>
            </div>
            <div>
              <span className="text-muted-foreground">pH:</span>
              <span className="ml-1 font-medium">{localParams?.pH}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Vol:</span>
              <span className="ml-1 font-medium">{localParams?.volume}mL</span>
            </div>
            <div>
              <span className="text-muted-foreground">Cat:</span>
              <span className="ml-1 font-medium">{localParams?.catalystAmount}g</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactionParameters;