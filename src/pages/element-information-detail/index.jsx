import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import ElementHeader from './components/ElementHeader';
import PropertySection from './components/PropertySection';
import PhysicalProperties from './components/PhysicalProperties';
import ChemicalProperties from './components/ChemicalProperties';
import SafetyInformation from './components/SafetyInformation';
import HistoricalContext from './components/HistoricalContext';
import MolecularViewer from './components/MolecularViewer';
import RelatedExperiments from './components/RelatedExperiments';
import Icon from '../../components/AppIcon';

const ElementInformationDetail = () => {
  const { elementId } = useParams();
  const navigate = useNavigate();
  const [element, setElement] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock element data
  const mockElements = [
    {
      id: 1,
      symbol: "H",
      name: "Hydrogen",
      atomicNumber: 1,
      atomicMass: 1.008,
      category: "Nonmetal",
      categoryColor: "bg-blue-500",
      electronConfiguration: "1s¹",
      valenceElectrons: 1,
      meltingPoint: 14.01,
      boilingPoint: 20.28,
      density: 0.00008988,
      phase: "Gas",
      crystalStructure: "Hexagonal",
      thermalConductivity: 0.1805,
      oxidationStates: [-1, 1],
      electronegativity: 2.20,
      atomicRadius: 53,
      ionizationEnergy: 1312,
      electronAffinity: 72.8,
      hazardLevel: "moderate",
      safetyDescription: "Highly flammable gas. Can form explosive mixtures with air.",
      safetyPrecautions: [
        "Store in well-ventilated areas away from ignition sources",
        "Use proper gas handling equipment",
        "Monitor for leaks regularly",
        "Avoid static electricity buildup"
      ],
      firstAid: {
        inhalation: "Move to fresh air immediately",
        skin: "Remove contaminated clothing, flush with water",
        eyes: "Flush with water for 15 minutes"
      },
      storageRequirements: "Store in cool, dry, well-ventilated area away from oxidizing materials",
      discoveryYear: 1766,
      discoveredBy: "Henry Cavendish",
      etymology: `Named from Greek 'hydro' (water) and 'genes' (generator), meaning water-former`,
      historicalUses: [
        "Early balloons and airships",
        "Welding and cutting torches",
        "Weather balloons"
      ],
      modernApplications: [
        "Fuel cells and clean energy",
        "Ammonia production",
        "Petroleum refining",
        "Semiconductor manufacturing"
      ],
      funFacts: [
        "Most abundant element in the universe",
        "Lightest element on the periodic table",
        "Burns with an invisible flame in daylight"
      ],
      bondLength: "74 pm",
      bondAngle: "N/A (diatomic)"
    },
    {
      id: 6,
      symbol: "C",
      name: "Carbon",
      atomicNumber: 6,
      atomicMass: 12.011,
      category: "Nonmetal",
      categoryColor: "bg-gray-600",
      electronConfiguration: "1s² 2s² 2p²",
      valenceElectrons: 4,
      meltingPoint: 3823,
      boilingPoint: 4098,
      density: 2.267,
      phase: "Solid",
      crystalStructure: "Diamond/Graphite",
      thermalConductivity: 129,
      oxidationStates: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
      electronegativity: 2.55,
      atomicRadius: 67,
      ionizationEnergy: 1086,
      electronAffinity: 153.9,
      hazardLevel: "low",
      safetyDescription: "Generally safe in solid form. Carbon dust may be irritating.",
      safetyPrecautions: [
        "Avoid inhalation of carbon dust",
        "Use dust masks when handling powdered forms",
        "Store in dry conditions",
        "Handle with clean, dry hands"
      ],
      firstAid: {
        inhalation: "Move to fresh air, seek medical attention if breathing difficulties persist",
        skin: "Wash with soap and water",
        eyes: "Flush with clean water for 15 minutes"
      },
      storageRequirements: "Store in dry, cool place away from strong oxidizing agents",
      discoveryYear: "Ancient",
      discoveredBy: "Known since ancient times",
      etymology: `From Latin 'carbo' meaning charcoal`,
      historicalUses: [
        "Cave paintings and art",
        "Fuel for heating and cooking",
        "Steel production"
      ],
      modernApplications: [
        "Steel and iron production",
        "Carbon fiber composites",
        "Electronics and semiconductors",
        "Nanotechnology applications"
      ],
      funFacts: [
        "Forms more compounds than any other element",
        "Basis of all known life",
        "Can form diamond, graphite, and fullerenes"
      ],
      bondLength: "154 pm",
      bondAngle: "109.5° (tetrahedral)"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const foundElement = mockElements?.find(el => el?.id === parseInt(elementId)) || mockElements?.[0];
      setElement(foundElement);
      setLoading(false);
    }, 500);
  }, [elementId]);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, this would save to localStorage or API
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${element?.name} - ChemLab Virtual`,
        text: `Learn about ${element?.name} and its properties`,
        url: window.location?.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard?.writeText(window.location?.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleAddToWorkspace = () => {
    // In a real app, this would add the element to the current lab workspace
    navigate('/virtual-laboratory-workspace', { 
      state: { selectedElement: element } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 pb-20 md:pb-0">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Icon name="Loader2" size={24} className="animate-spin" />
                <span>Loading element information...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!element) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 pb-20 md:pb-0">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <Icon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Element Not Found</h1>
              <p className="text-muted-foreground mb-4">The requested element could not be found.</p>
              <button
                onClick={() => navigate('/')}
                className="text-primary hover:underline"
              >
                Return to Periodic Table
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const customBreadcrumbs = [
    { label: 'Home', path: '/', icon: 'Home' },
    { label: 'Periodic Table', path: '/' },
    { label: element?.name, path: `/element-information-detail/${element?.id}`, current: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs customBreadcrumbs={customBreadcrumbs} />
          
          <ElementHeader
            element={element}
            onBookmark={handleBookmark}
            onShare={handleShare}
            onAddToWorkspace={handleAddToWorkspace}
            isBookmarked={isBookmarked}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <PropertySection title="Physical Properties" icon="Thermometer" defaultExpanded>
                <PhysicalProperties element={element} />
              </PropertySection>

              <PropertySection title="Chemical Properties" icon="Atom" defaultExpanded>
                <ChemicalProperties element={element} />
              </PropertySection>

              <PropertySection title="Safety Information" icon="Shield">
                <SafetyInformation element={element} />
              </PropertySection>

              <PropertySection title="Historical Context" icon="BookOpen">
                <HistoricalContext element={element} />
              </PropertySection>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <MolecularViewer element={element} />
              <RelatedExperiments element={element} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementInformationDetail;