import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import LabToolbar from '../../components/ui/LabToolbar';
import LabEquipment from './components/LabEquipment';
import WorkspaceCanvas from './components/WorkspaceCanvas';
import ElementQueue from './components/ElementQueue';
import ReactionPanel from './components/ReactionPanel';
import EquipmentProperties from './components/EquipmentProperties';
import Icon from '../../components/AppIcon';

const VirtualLaboratoryWorkspace = () => {
  const [selectedElements, setSelectedElements] = useState([]);
  const [placedEquipment, setPlacedEquipment] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedWorkspaceItem, setSelectedWorkspaceItem] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [reactionResults, setReactionResults] = useState(null);
  const [reactionAnimation, setReactionAnimation] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [safetyMode, setSafetyMode] = useState(true);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activePanel, setActivePanel] = useState('equipment'); // For mobile

  // Save state to history for undo/redo
  const saveToHistory = () => {
    const state = {
      selectedElements: [...selectedElements],
      placedEquipment: [...placedEquipment],
      timestamp: Date.now()
    };
    
    const newHistory = history?.slice(0, historyIndex + 1);
    newHistory?.push(state);
    setHistory(newHistory);
    setHistoryIndex(newHistory?.length - 1);
    setHasUnsavedChanges(true);
  };

  // Equipment handlers
  const handleEquipmentSelect = (equipment) => {
    setSelectedEquipment(equipment?.id);
  };

  const handleEquipmentPlace = (equipment) => {
    setPlacedEquipment(prev => [...prev, equipment]);
    saveToHistory();
  };

  const handleWorkspaceItemSelect = (item) => {
    setSelectedWorkspaceItem(item);
  };

  const handleEquipmentRemove = (instanceId) => {
    setPlacedEquipment(prev => prev?.filter(item => item?.instanceId !== instanceId));
    if (selectedWorkspaceItem?.instanceId === instanceId) {
      setSelectedWorkspaceItem(null);
    }
    saveToHistory();
  };

  const handlePropertiesUpdate = (instanceId, properties) => {
    setPlacedEquipment(prev =>
      prev?.map(item =>
        item?.instanceId === instanceId
          ? { ...item, properties }
          : item
      )
    );
    setHasUnsavedChanges(true);
  };

  // Element handlers
  const handleElementAdd = (element) => {
    setSelectedElements(prev => [...prev, element]);
    saveToHistory();
  };

  const handleElementRemove = (index) => {
    setSelectedElements(prev => prev?.filter((_, i) => i !== index));
    saveToHistory();
  };

  const handleClearQueue = () => {
    setSelectedElements([]);
    saveToHistory();
  };

  const handleAddToEquipment = (element, equipment) => {
    const updatedEquipment = placedEquipment?.map(item => {
      if (item?.instanceId === equipment?.instanceId) {
        return {
          ...item,
          properties: {
            ...item?.properties,
            contents: [...item?.properties?.contents, { ...element, amount: 1 }]
          }
        };
      }
      return item;
    });
    
    setPlacedEquipment(updatedEquipment);
    setHasUnsavedChanges(true);
  };

  // Simulation handlers
  const handleStartSimulation = () => {
    if (!safetyMode || selectedElements?.length >= 2) {
      setIsSimulating(true);
      
      // Create mock animation
      const animation = {
        particles: Array.from({ length: 10 }, (_, i) => ({
          x: Math.random() * 400 + 100,
          y: Math.random() * 300 + 100,
          color: ['#FF6B6B', '#4ECDC4', '#45B7D1']?.[Math.floor(Math.random() * 3)],
          delay: i * 200
        })),
        effects: [
          { x: 250, y: 200, symbol: '💨', delay: 1000, className: 'text-blue-500' },
          { x: 300, y: 180, symbol: '⚡', delay: 1500, className: 'text-yellow-500' }
        ]
      };
      
      setReactionAnimation(animation);
      
      // Simulate reaction completion
      setTimeout(() => {
        setIsSimulating(false);
        setReactionResults({
          equation: "2H₂ + O₂ → 2H₂O",
          temperature: 85,
          duration: 3.2,
          yield: 94.5,
          products: ["Water vapor"]
        });
        setReactionAnimation(null);
      }, 5000);
    }
  };

  const handleStopSimulation = () => {
    setIsSimulating(false);
    setReactionAnimation(null);
  };

  // Toolbar handlers
  const handleSave = () => {
    // Mock save functionality
    console.log('Saving experiment...', {
      elements: selectedElements,
      equipment: placedEquipment,
      results: reactionResults
    });
    setHasUnsavedChanges(false);
  };

  const handleClear = () => {
    setSelectedElements([]);
    setPlacedEquipment([]);
    setSelectedWorkspaceItem(null);
    setReactionResults(null);
    setReactionAnimation(null);
    saveToHistory();
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history?.[historyIndex - 1];
      setSelectedElements(prevState?.selectedElements);
      setPlacedEquipment(prevState?.placedEquipment);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history?.length - 1) {
      const nextState = history?.[historyIndex + 1];
      setSelectedElements(nextState?.selectedElements);
      setPlacedEquipment(nextState?.placedEquipment);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleSafetyToggle = () => {
    setSafetyMode(!safetyMode);
  };

  const handleSaveExperiment = () => {
    // Mock save experiment results
    const experimentData = {
      timestamp: new Date()?.toISOString(),
      elements: selectedElements,
      equipment: placedEquipment,
      results: reactionResults
    };
    
    console.log('Saving experiment results:', experimentData);
    // In a real app, this would save to backend or local storage
  };

  // Mobile panel switching
  const mobilePanels = [
    { id: 'equipment', label: 'Equipment', icon: 'Wrench' },
    { id: 'workspace', label: 'Workspace', icon: 'Beaker' },
    { id: 'elements', label: 'Elements', icon: 'Atom' },
    { id: 'reaction', label: 'Analysis', icon: 'BarChart3' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 pb-20 md:pb-4">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs />
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Virtual Laboratory Workspace
            </h1>
            <p className="text-muted-foreground">
              Conduct safe chemical experiments through interactive simulations and equipment manipulation
            </p>
          </div>

          <LabToolbar
            onSave={handleSave}
            onClear={handleClear}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onSafetyToggle={handleSafetyToggle}
            safetyMode={safetyMode}
            hasUnsavedChanges={hasUnsavedChanges}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history?.length - 1}
            isSimulating={isSimulating}
          />

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-6 h-[calc(100vh-300px)]">
            {/* Left Panel - Equipment */}
            <div className="col-span-3">
              <LabEquipment
                onEquipmentSelect={handleEquipmentSelect}
                selectedEquipment={selectedEquipment}
              />
            </div>

            {/* Center - Workspace */}
            <div className="col-span-6">
              <WorkspaceCanvas
                placedEquipment={placedEquipment}
                onEquipmentPlace={handleEquipmentPlace}
                onEquipmentSelect={handleWorkspaceItemSelect}
                selectedWorkspaceItem={selectedWorkspaceItem}
                onEquipmentRemove={handleEquipmentRemove}
                isSimulating={isSimulating}
                reactionAnimation={reactionAnimation}
              />
            </div>

            {/* Right Panel - Elements & Analysis */}
            <div className="col-span-3 space-y-6">
              <div className="h-1/2">
                <ElementQueue
                  selectedElements={selectedElements}
                  onElementRemove={handleElementRemove}
                  onElementAdd={handleElementAdd}
                  onClearQueue={handleClearQueue}
                  onAddToEquipment={handleAddToEquipment}
                  selectedWorkspaceItem={selectedWorkspaceItem}
                />
              </div>
              
              <div className="h-1/2">
                <ReactionPanel
                  selectedElements={selectedElements}
                  placedEquipment={placedEquipment}
                  onStartSimulation={handleStartSimulation}
                  onStopSimulation={handleStopSimulation}
                  isSimulating={isSimulating}
                  reactionResults={reactionResults}
                  onSaveExperiment={handleSaveExperiment}
                />
              </div>
            </div>
          </div>

          {/* Tablet Layout */}
          <div className="hidden md:grid lg:hidden md:grid-cols-8 gap-6 h-[calc(100vh-300px)]">
            <div className="col-span-2">
              <LabEquipment
                onEquipmentSelect={handleEquipmentSelect}
                selectedEquipment={selectedEquipment}
              />
            </div>

            <div className="col-span-4">
              <WorkspaceCanvas
                placedEquipment={placedEquipment}
                onEquipmentPlace={handleEquipmentPlace}
                onEquipmentSelect={handleWorkspaceItemSelect}
                selectedWorkspaceItem={selectedWorkspaceItem}
                onEquipmentRemove={handleEquipmentRemove}
                isSimulating={isSimulating}
                reactionAnimation={reactionAnimation}
              />
            </div>

            <div className="col-span-2">
              <div className="space-y-4">
                <ElementQueue
                  selectedElements={selectedElements}
                  onElementRemove={handleElementRemove}
                  onElementAdd={handleElementAdd}
                  onClearQueue={handleClearQueue}
                  onAddToEquipment={handleAddToEquipment}
                  selectedWorkspaceItem={selectedWorkspaceItem}
                />
                
                <EquipmentProperties
                  selectedItem={selectedWorkspaceItem}
                  onPropertiesUpdate={handlePropertiesUpdate}
                  onItemRemove={handleEquipmentRemove}
                />
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            {/* Mobile Panel Navigation */}
            <div className="flex bg-card border border-border rounded-lg mb-4 overflow-x-auto">
              {mobilePanels?.map((panel) => (
                <button
                  key={panel?.id}
                  className={`
                    flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-ui whitespace-nowrap
                    ${activePanel === panel?.id
                      ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground'
                    }
                  `}
                  onClick={() => setActivePanel(panel?.id)}
                >
                  <Icon name={panel?.icon} size={16} />
                  <span>{panel?.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Panel Content */}
            <div className="h-[calc(100vh-400px)]">
              {activePanel === 'equipment' && (
                <LabEquipment
                  onEquipmentSelect={handleEquipmentSelect}
                  selectedEquipment={selectedEquipment}
                />
              )}
              
              {activePanel === 'workspace' && (
                <div className="space-y-4">
                  <WorkspaceCanvas
                    placedEquipment={placedEquipment}
                    onEquipmentPlace={handleEquipmentPlace}
                    onEquipmentSelect={handleWorkspaceItemSelect}
                    selectedWorkspaceItem={selectedWorkspaceItem}
                    onEquipmentRemove={handleEquipmentRemove}
                    isSimulating={isSimulating}
                    reactionAnimation={reactionAnimation}
                  />
                  
                  {selectedWorkspaceItem && (
                    <EquipmentProperties
                      selectedItem={selectedWorkspaceItem}
                      onPropertiesUpdate={handlePropertiesUpdate}
                      onItemRemove={handleEquipmentRemove}
                    />
                  )}
                </div>
              )}
              
              {activePanel === 'elements' && (
                <ElementQueue
                  selectedElements={selectedElements}
                  onElementRemove={handleElementRemove}
                  onElementAdd={handleElementAdd}
                  onClearQueue={handleClearQueue}
                  onAddToEquipment={handleAddToEquipment}
                  selectedWorkspaceItem={selectedWorkspaceItem}
                />
              )}
              
              {activePanel === 'reaction' && (
                <ReactionPanel
                  selectedElements={selectedElements}
                  placedEquipment={placedEquipment}
                  onStartSimulation={handleStartSimulation}
                  onStopSimulation={handleStopSimulation}
                  isSimulating={isSimulating}
                  reactionResults={reactionResults}
                  onSaveExperiment={handleSaveExperiment}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VirtualLaboratoryWorkspace;