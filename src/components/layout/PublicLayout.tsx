import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { IdeaWizardModal } from '../modals/IdeaWizardModal';

export const PublicLayout: React.FC = () => {
  const { pathname } = useLocation();
  const [wizardOpen, setWizardOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const handleOpenWizard = () => setWizardOpen(true);
    window.addEventListener('open-idea-wizard', handleOpenWizard);
    return () => {
      window.removeEventListener('open-idea-wizard', handleOpenWizard);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#EFEFF2] text-[#1E232A] flex flex-col font-sans antialiased selection:bg-[#1E232A] selection:text-white">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
      <IdeaWizardModal isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
    </div>
  );
};
