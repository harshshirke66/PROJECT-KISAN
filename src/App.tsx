import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import Dashboard from './components/dashboard/Dashboard';
import { getCurrentUser, supabase } from './config/supabase';

type AppState = 'landing' | 'login' | 'signup' | 'dashboard';

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial auth state
    checkAuthState();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setAppState('dashboard');
        } else if (event === 'SIGNED_OUT') {
          setAppState('landing');
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthState = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setAppState('dashboard');
      } else {
        setAppState('landing');
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      setAppState('landing');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunchApp = () => {
    setAppState('login');
  };

  const handleLogin = () => {
    setAppState('dashboard');
  };

  const handleSignup = () => {
    // Don't automatically go to dashboard after signup
    // User needs to verify email first, then login
    setAppState('login');
  };

  const handleLogout = () => {
    setAppState('landing');
  };

  const handleBackToLanding = () => {
    setAppState('landing');
  };

  const handleSwitchToSignup = () => {
    setAppState('signup');
  };

  const handleSwitchToLogin = () => {
    setAppState('login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-600 font-medium">Loading KISAN...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {appState === 'landing' && (
        <LandingPage onLaunchApp={handleLaunchApp} />
      )}
      
      {appState === 'login' && (
        <LoginPage 
          onLogin={handleLogin}
          onBackToLanding={handleBackToLanding}
          onSwitchToSignup={handleSwitchToSignup}
          selectedLanguage={selectedLanguage}
        />
      )}
      
      {appState === 'signup' && (
        <SignupPage 
          onSignup={handleSignup}
          onBackToLanding={handleBackToLanding}
          onSwitchToLogin={handleSwitchToLogin}
          selectedLanguage={selectedLanguage}
        />
      )}
      
      {appState === 'dashboard' && (
        <Dashboard 
          onLogout={handleLogout}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />
      )}
    </div>
  );
}

export default App;