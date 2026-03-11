import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import UserProfileProgressDashboard from './pages/user-profile-progress-dashboard';
import ReactionSimulationResults from './pages/reaction-simulation-results';
import ElementInformationDetail from './pages/element-information-detail';
import VirtualLaboratoryWorkspace from './pages/virtual-laboratory-workspace';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<ElementInformationDetail />} />
        <Route path="/user-profile-progress-dashboard" element={<UserProfileProgressDashboard />} />
        <Route path="/reaction-simulation-results" element={<ReactionSimulationResults />} />
        <Route path="/element-information-detail" element={<ElementInformationDetail />} />
        <Route path="/virtual-laboratory-workspace" element={<VirtualLaboratoryWorkspace />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
