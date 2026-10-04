import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import MobileHeader from '../components/navigation/MobileHeader';
import BottomNav from '../components/navigation/BottomNav';
import CreateModal from '../components/modals/CreateModal';

export default function MainLayout() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900 dark:bg-[#080c14] dark:text-gray-100 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <Sidebar onOpenCreateModal={() => setIsCreateOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <MobileHeader />
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav onOpenCreateModal={() => setIsCreateOpen(true)} />

      {/* Global Create Post / Story / Reel Modal */}
      <CreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
