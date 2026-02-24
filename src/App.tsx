import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';
import LoadingScreen from './components/LoadingScreen';
import AuthForm from './components/AuthForm';
import DailyWisdom from './components/DailyWisdom';
import SettingsPanel from './components/SettingsPanel';
import { WisdomArchive } from './components/WisdomArchive';
import Welcome from './pages/Welcome';
import Homepage from './pages/Homepage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import DeleteAccount from './pages/DeleteAccount';
import { wisdomQ1 } from './data/wisdom-q1';
import { wisdomQ2 } from './data/wisdom-q2';
import { wisdomQ3 } from './data/wisdom-q3';
import { wisdomQ4 } from './data/wisdom-q4';

const allWisdom = [...wisdomQ1, ...wisdomQ2, ...wisdomQ3, ...wisdomQ4];

function AppShell() {
  const { user, loading, profile } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  if (loading) return <LoadingScreen />;
  if (!user) return <AuthForm />;

  return (
    <>
      <DailyWisdom
        onOpenSettings={() => setShowSettings(true)}
        onOpenArchive={() => setShowArchive(true)}
      />
      <AnimatePresence>
        {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
        {showArchive && (
          <WisdomArchive
            allWisdom={allWisdom}
            isPremium={profile?.is_premium ?? false}
            onClose={() => setShowArchive(false)}
            onUpgrade={() => {
              setShowArchive(false);
              setShowSettings(true);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/app" element={<AppShell />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/delete-account" element={<DeleteAccount />} />
    </Routes>
  );
}
