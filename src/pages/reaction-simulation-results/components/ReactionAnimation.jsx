import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReactionAnimation = ({ 
  reactionData, 
  isPlaying, 
  currentTime, 
  duration,
  onTimeChange,
  onPlayPause,
  onRestart,
  animationSpeed = 1
}) => {
  const [molecules, setMolecules] = useState([]);
  const [bonds, setBonds] = useState([]);
  const [energyLevel, setEnergyLevel] = useState(0);

  // Mock animation data
  const mockMolecules = [
    { id: 'h2o-1', type: 'H2O', x: 100, y: 150, color: '#3B82F6', size: 20 },
    { id: 'nacl-1', type: 'NaCl', x: 300, y: 150, color: '#EF4444', size: 18 },
    { id: 'na-1', type: 'Na+', x: 200, y: 100, color: '#F59E0B', size: 15 },
    { id: 'cl-1', type: 'Cl-', x: 200, y: 200, color: '#10B981', size: 15 },
    { id: 'h3o-1', type: 'H3O+', x: 400, y: 120, color: '#8B5CF6', size: 16 }
  ];

  const mockBonds = [
    { id: 'bond-1', from: 'h2o-1', to: 'nacl-1', strength: 0.8, type: 'ionic' },
    { id: 'bond-2', from: 'na-1', to: 'cl-1', strength: 0.3, type: 'breaking' }
  ];

  useEffect(() => {
    setMolecules(mockMolecules);
    setBonds(mockBonds);
  }, [reactionData]);

  useEffect(() => {
    if (isPlaying) {
      const progress = currentTime / duration;
      setEnergyLevel(Math.sin(progress * Math.PI * 2) * 50 + 50);
      
      // Animate molecule positions based on time
      setMolecules(prev => prev?.map(mol => ({
        ...mol,
        x: mol?.x + Math.sin(progress * Math.PI + mol?.id?.length) * 20,
        y: mol?.y + Math.cos(progress * Math.PI + mol?.id?.length) * 10
      })));
    }
  }, [currentTime, isPlaying, duration]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-element-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Reaction Animation</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Speed: {animationSpeed}x</span>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Icon name="Zap" size={16} />
            <span>Energy: {Math.round(energyLevel)}%</span>
          </div>
        </div>
      </div>
      {/* Animation Viewport */}
      <div className="relative bg-muted rounded-lg border-2 border-border mb-4" style={{ height: '400px' }}>
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* Energy field background */}
          <defs>
            <radialGradient id="energyGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={`rgba(59, 130, 246, ${energyLevel / 200})`} />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#energyGradient)" />

          {/* Bonds */}
          {bonds?.map(bond => {
            const fromMol = molecules?.find(m => m?.id === bond?.from);
            const toMol = molecules?.find(m => m?.id === bond?.to);
            if (!fromMol || !toMol) return null;

            return (
              <line
                key={bond?.id}
                x1={fromMol?.x}
                y1={fromMol?.y}
                x2={toMol?.x}
                y2={toMol?.y}
                stroke={bond?.type === 'breaking' ? '#EF4444' : '#6B7280'}
                strokeWidth={bond?.strength * 4}
                strokeDasharray={bond?.type === 'breaking' ? '5,5' : 'none'}
                opacity={bond?.strength}
              />
            );
          })}

          {/* Molecules */}
          {molecules?.map(molecule => (
            <g key={molecule?.id}>
              <circle
                cx={molecule?.x}
                cy={molecule?.y}
                r={molecule?.size}
                fill={molecule?.color}
                stroke="#FFFFFF"
                strokeWidth="2"
                opacity="0.9"
              />
              <text
                x={molecule?.x}
                y={molecule?.y + 4}
                textAnchor="middle"
                className="text-xs font-medium fill-white"
              >
                {molecule?.type}
              </text>
            </g>
          ))}
        </svg>

        {/* Reaction equation overlay */}
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-border">
          <div className="text-sm font-mono">
            <span className="text-primary">H₂O</span>
            <span className="mx-2 text-muted-foreground">+</span>
            <span className="text-destructive">NaCl</span>
            <span className="mx-2 text-muted-foreground">→</span>
            <span className="text-warning">Na⁺</span>
            <span className="mx-1 text-muted-foreground">+</span>
            <span className="text-success">Cl⁻</span>
            <span className="mx-1 text-muted-foreground">+</span>
            <span className="text-secondary">H₃O⁺</span>
          </div>
        </div>

        {/* Temperature indicator */}
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-border">
          <div className="flex items-center space-x-2 text-sm">
            <Icon name="Thermometer" size={16} className="text-destructive" />
            <span className="font-medium">298 K</span>
          </div>
        </div>
      </div>
      {/* Timeline Controls */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onRestart}
            title="Restart Animation"
          >
            <Icon name="RotateCcw" size={18} />
          </Button>

          <Button
            variant={isPlaying ? "outline" : "default"}
            size="icon"
            onClick={onPlayPause}
            title={isPlaying ? "Pause" : "Play"}
          >
            <Icon name={isPlaying ? "Pause" : "Play"} size={18} />
          </Button>

          <div className="flex-1">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(e) => onTimeChange(parseFloat(e?.target?.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${(currentTime / duration) * 100}%, var(--color-muted) ${(currentTime / duration) * 100}%, var(--color-muted) 100%)`
              }}
            />
          </div>

          <div className="text-sm text-muted-foreground font-mono min-w-[60px]">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center justify-center space-x-2">
          <span className="text-sm text-muted-foreground">Speed:</span>
          {[0.5, 1, 1.5, 2]?.map(speed => (
            <Button
              key={speed}
              variant={animationSpeed === speed ? "default" : "outline"}
              size="sm"
              onClick={() => {/* Speed change handled by parent */}}
              className="min-w-[50px]"
            >
              {speed}x
            </Button>
          ))}
        </div>
      </div>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: var(--color-primary);
          cursor: pointer;
          border: 2px solid var(--color-background);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: var(--color-primary);
          cursor: pointer;
          border: 2px solid var(--color-background);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default ReactionAnimation;