import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { TopBanner } from './components/TopBanner';
import { CategoryGrid } from './components/CategoryGrid';
import { MatchScreen } from './components/MatchScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { ShopScreen } from './components/ShopScreen';
import { MyMatchesScreen } from './components/MyMatchesScreen';
import { BottomNav } from './components/BottomNav';
import { FloatingMascot } from './components/FloatingMascot';
import { WalletModal } from './components/WalletModal';
import { JoinMatchModal } from './components/JoinMatchModal';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel';

const MainAppContent: React.FC = () => {
  const { 
    activeTab, 
    selectedCategory, 
    setSelectedCategory, 
    isAdminRoute, 
    setIsAdminRoute 
  } = useApp();

  // Listen to hash / route changes for /admin
  useEffect(() => {
    const handleLocationCheck = () => {
      const path = (window.location.pathname || '').toLowerCase();
      const hash = (window.location.hash || '').toLowerCase();
      const search = (window.location.search || '').toLowerCase();
      const href = (window.location.href || '').toLowerCase();
      const isPathAdmin = path.includes('admin') || hash.includes('admin') || search.includes('admin') || href.includes('admin');
      setIsAdminRoute(isPathAdmin);
    };
    handleLocationCheck();
    window.addEventListener('popstate', handleLocationCheck);
    window.addEventListener('hashchange', handleLocationCheck);
    
    // Also poll location briefly on load to catch slow mobile URL updates
    const timer = setInterval(handleLocationCheck, 500);
    const timeout = setTimeout(() => clearInterval(timer), 3000);

    return () => {
      window.removeEventListener('popstate', handleLocationCheck);
      window.removeEventListener('hashchange', handleLocationCheck);
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [setIsAdminRoute]);

  // If viewing Admin route, show Admin Panel
  if (isAdminRoute) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-slate-200/60 py-0 sm:py-4">
      {/* Centered Mobile Container */}
      <div className="max-w-md mx-auto min-h-screen bg-[#f8fafc] text-slate-800 shadow-2xl relative flex flex-col border-x border-slate-200/80 overflow-hidden font-sans">
        {/* Top App Bar with glowing brand, balance chip, marquee */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1">
          {selectedCategory ? (
            <MatchScreen
              category={selectedCategory}
              onBack={() => setSelectedCategory(null)}
            />
          ) : (
            <>
              {activeTab === 'play' && (
                <div>
                  <TopBanner />
                  <CategoryGrid />
                </div>
              )}

              {activeTab === 'shop' && <ShopScreen />}

              {activeTab === 'my_matches' && <MyMatchesScreen />}

              {activeTab === 'results' && <ResultsScreen />}

              {activeTab === 'profile' && <ProfileScreen />}
            </>
          )}
        </main>

        {/* Customer Support Floating Mascot */}
        <FloatingMascot />

        {/* Fixed Bottom Navigation */}
        <BottomNav />

        {/* Global Modals */}
        <WalletModal />
        <JoinMatchModal />
        <AuthModal />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
