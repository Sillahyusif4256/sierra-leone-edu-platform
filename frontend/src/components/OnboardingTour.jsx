// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { useState, useEffect, useRef } from 'react';
import Joyride, { STATUS } from 'react-joyride';

const OnboardingTour = () => {
  const [runTour, setRunTour] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Only initialize once
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    try {
      // Check if user has already seen the tour
      const hasToured = localStorage.getItem('edushare_toured');
      const isNewUser = !hasToured;
      
      // Only run tour for new users
      if (isNewUser) {
        // Check if we're on the home page
        if (window.location.pathname === '/') {
          // Small delay to ensure page is fully loaded
          const timer = setTimeout(() => {
            setRunTour(true);
          }, 3000);
          
          return () => clearTimeout(timer);
        }
      }
    } catch (error) {
      console.error('Error checking tour status:', error);
    }
  }, []);

  const steps = [
    {
      target: '.tour-browse',
      content: (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Browse Resources 📚</h3>
          <p className="text-gray-600">Find thousands of free study materials here. Filter by subject, level, or search for specific topics.</p>
        </div>
      ),
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '.tour-upload',
      content: (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Upload Resources ⬆️</h3>
          <p className="text-gray-600">Share your notes, assignments, and study materials to help other students learn!</p>
        </div>
      ),
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '.tour-ai-assistant',
      content: (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">AI Assistant 🤖</h3>
          <p className="text-gray-600">Ask our AI tutor any question about your subjects. Get instant explanations and help with homework.</p>
        </div>
      ),
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '.tour-profile',
      content: (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Your Profile 🏆</h3>
          <p className="text-gray-600">Track your progress, earn badges, and see your contributions to the community.</p>
        </div>
      ),
      disableBeacon: true,
      placement: 'bottom',
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { status } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      try {
        // Mark tour as completed
        localStorage.setItem('edushare_toured', 'true');
      } catch (error) {
        console.error('Error saving tour status:', error);
      }
      setRunTour(false);
    }
  };

  const styles = {
    options: {
      zIndex: 10000,
      primaryColor: '#1EB53A',
    },
    tooltip: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      padding: '20px',
    },
    tooltipContent: {
      padding: '0',
    },
    tooltipTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '8px',
    },
    tooltipNext: {
      backgroundColor: '#1EB53A',
      borderRadius: '8px',
      fontSize: '14px',
      padding: '8px 16px',
    },
    tooltipBack: {
      color: '#666',
      marginRight: '8px',
    },
    tooltipSkip: {
      color: '#999',
      fontSize: '14px',
    },
    spotlight: {
      borderRadius: '8px',
    },
  };

  // Don't render if not mounted or not on home page
  if (!isMounted || window.location.pathname !== '/') {
    return null;
  }

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      showSkipButton
      showProgress
      callback={handleJoyrideCallback}
      styles={styles}
      locale={{
        last: 'Finish',
        skip: 'Skip Tour',
        next: 'Next',
        back: 'Back',
      }}
    />
  );
};

export default OnboardingTour;
