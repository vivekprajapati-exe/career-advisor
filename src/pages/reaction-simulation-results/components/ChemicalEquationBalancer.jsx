import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ChemicalEquationBalancer = ({ 
  initialEquation = {},
  onEquationChange = () => {},
  onBalance = () => {},
  isSimulating = false
}) => {
  const [equation, setEquation] = useState({
    reactants: [
      { formula: 'H2O', coefficient: 1, name: 'Water' },
      { formula: 'NaCl', coefficient: 1, name: 'Sodium Chloride' }
    ],
    products: [
      { formula: 'Na+', coefficient: 1, name: 'Sodium Ion' },
      { formula: 'Cl-', coefficient: 1, name: 'Chloride Ion' },
      { formula: 'H3O+', coefficient: 1, name: 'Hydronium Ion' }
    ],
    ...initialEquation
  });

  const [isBalanced, setIsBalanced] = useState(false);
  const [balanceStatus, setBalanceStatus] = useState('');
  const [showMolecularView, setShowMolecularView] = useState(false);

  // Mock balancing logic
  useEffect(() => {
    const checkBalance = () => {
      // Simple mock balance check
      const totalReactantCoeff = equation?.reactants?.reduce((sum, r) => sum + r?.coefficient, 0);
      const totalProductCoeff = equation?.products?.reduce((sum, p) => sum + p?.coefficient, 0);
      
      const balanced = Math.abs(totalReactantCoeff - totalProductCoeff) <= 1;
      setIsBalanced(balanced);
      setBalanceStatus(balanced ? 'Equation is balanced' : 'Equation needs balancing');
    };

    checkBalance();
  }, [equation]);

  const updateCoefficient = (type, index, value) => {
    const newEquation = { ...equation };
    const coefficient = Math.max(1, parseInt(value) || 1);
    
    if (type === 'reactants') {
      newEquation.reactants[index].coefficient = coefficient;
    } else {
      newEquation.products[index].coefficient = coefficient;
    }
    
    setEquation(newEquation);
    onEquationChange(newEquation);
  };

  const addCompound = (type) => {
    const newEquation = { ...equation };
    const newCompound = {
      formula: 'X',
      coefficient: 1,
      name: 'New Compound'
    };
    
    if (type === 'reactants') {
      newEquation?.reactants?.push(newCompound);
    } else {
      newEquation?.products?.push(newCompound);
    }
    
    setEquation(newEquation);
  };

  const removeCompound = (type, index) => {
    const newEquation = { ...equation };
    
    if (type === 'reactants' && newEquation?.reactants?.length > 1) {
      newEquation?.reactants?.splice(index, 1);
    } else if (type === 'products' && newEquation?.products?.length > 1) {
      newEquation?.products?.splice(index, 1);
    }
    
    setEquation(newEquation);
  };

  const autoBalance = () => {
    // Mock auto-balancing
    const newEquation = { ...equation };
    
    // Simple balancing logic for demonstration
    newEquation?.reactants?.forEach((reactant, index) => {
      newEquation.reactants[index].coefficient = index + 1;
    });
    
    newEquation?.products?.forEach((product, index) => {
      newEquation.products[index].coefficient = index + 1;
    });
    
    setEquation(newEquation);
    onBalance(newEquation);
  };

  const resetEquation = () => {
    const resetEq = {
      reactants: [
        { formula: 'H2O', coefficient: 1, name: 'Water' },
        { formula: 'NaCl', coefficient: 1, name: 'Sodium Chloride' }
      ],
      products: [
        { formula: 'Na+', coefficient: 1, name: 'Sodium Ion' },
        { formula: 'Cl-', coefficient: 1, name: 'Chloride Ion' },
        { formula: 'H3O+', coefficient: 1, name: 'Hydronium Ion' }
      ]
    };
    setEquation(resetEq);
  };

  const renderCompound = (compound, type, index) => (
    <div key={`${type}-${index}`} className="flex items-center space-x-2 bg-muted rounded-lg p-3 border border-border">
      {/* Coefficient Input */}
      <div className="flex items-center space-x-1">
        <Input
          type="number"
          value={compound?.coefficient}
          onChange={(e) => updateCoefficient(type, index, e?.target?.value)}
          disabled={isSimulating}
          className="w-16 text-center text-sm"
          min="1"
        />
      </div>

      {/* Formula */}
      <div className="flex-1">
        <div className="font-mono text-lg font-semibold text-foreground">
          {compound?.formula}
        </div>
        <div className="text-xs text-muted-foreground">
          {compound?.name}
        </div>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeCompound(type, index)}
        disabled={isSimulating || (type === 'reactants' ? equation?.reactants?.length <= 1 : equation?.products?.length <= 1)}
        className="text-destructive hover:text-destructive"
      >
        <Icon name="X" size={16} />
      </Button>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg shadow-element-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Chemical Equation Balancer</h3>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
            isBalanced 
              ? 'bg-success/10 text-success border border-success/20' :'bg-warning/10 text-warning border border-warning/20'
          }`}>
            <Icon name={isBalanced ? "CheckCircle" : "AlertCircle"} size={12} />
            <span>{balanceStatus}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMolecularView(!showMolecularView)}
            iconName={showMolecularView ? "Eye" : "EyeOff"}
            iconPosition="left"
          >
            {showMolecularView ? "Hide" : "Show"} 3D
          </Button>
        </div>
      </div>
      {/* Equation Display */}
      <div className="mb-6">
        <div className="flex items-center justify-center space-x-4 p-6 bg-muted rounded-lg border border-border">
          {/* Reactants */}
          <div className="flex items-center space-x-2">
            {equation?.reactants?.map((reactant, index) => (
              <React.Fragment key={`reactant-${index}`}>
                {index > 0 && <span className="text-muted-foreground font-medium">+</span>}
                <span className="font-mono text-lg">
                  {reactant?.coefficient > 1 && (
                    <span className="text-primary font-bold">{reactant?.coefficient}</span>
                  )}
                  <span className="text-foreground">{reactant?.formula}</span>
                </span>
              </React.Fragment>
            ))}
          </div>

          {/* Arrow */}
          <div className="flex items-center space-x-2">
            <Icon name="ArrowRight" size={24} className="text-primary" />
          </div>

          {/* Products */}
          <div className="flex items-center space-x-2">
            {equation?.products?.map((product, index) => (
              <React.Fragment key={`product-${index}`}>
                {index > 0 && <span className="text-muted-foreground font-medium">+</span>}
                <span className="font-mono text-lg">
                  {product?.coefficient > 1 && (
                    <span className="text-primary font-bold">{product?.coefficient}</span>
                  )}
                  <span className="text-foreground">{product?.formula}</span>
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      {/* Molecular View */}
      {showMolecularView && (
        <div className="mb-6 p-4 bg-muted rounded-lg border border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">3D Molecular Structure</h4>
          <div className="h-32 bg-background rounded border border-border flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Icon name="Atom" size={32} className="mx-auto mb-2" />
              <div className="text-sm">3D molecular visualization would appear here</div>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reactants */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium text-foreground">Reactants</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addCompound('reactants')}
              disabled={isSimulating}
              iconName="Plus"
              iconPosition="left"
            >
              Add
            </Button>
          </div>
          <div className="space-y-3">
            {equation?.reactants?.map((reactant, index) => 
              renderCompound(reactant, 'reactants', index)
            )}
          </div>
        </div>

        {/* Products */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium text-foreground">Products</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addCompound('products')}
              disabled={isSimulating}
              iconName="Plus"
              iconPosition="left"
            >
              Add
            </Button>
          </div>
          <div className="space-y-3">
            {equation?.products?.map((product, index) => 
              renderCompound(product, 'products', index)
            )}
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button
            variant="default"
            onClick={autoBalance}
            disabled={isSimulating || isBalanced}
            iconName="Scale"
            iconPosition="left"
          >
            Auto Balance
          </Button>
          <Button
            variant="outline"
            onClick={resetEquation}
            disabled={isSimulating}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Copy"
            iconPosition="left"
          >
            Copy Equation
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Share"
            iconPosition="left"
          >
            Share
          </Button>
        </div>
      </div>
      {/* Balance Information */}
      <div className="mt-4 p-3 bg-muted rounded-lg border border-border">
        <div className="text-sm text-muted-foreground">
          <strong>Balancing Tips:</strong> Adjust coefficients to ensure equal numbers of each type of atom on both sides. 
          Start with the most complex molecule and work towards simpler ones.
        </div>
      </div>
    </div>
  );
};

export default ChemicalEquationBalancer;