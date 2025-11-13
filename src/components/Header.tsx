import React from 'react';
import { ThemeTab, SiteContent } from '../types';
import { LoginIcon } from './icons/LoginIcon';
import { LogoutIcon } from './icons/LogoutIcon';

interface HeaderProps {
  tabs: ThemeTab[];
  activeTab: string;
  setActiveTab: (id: string) => void;
  isLoggedIn: boolean;
  onLoginToggle: () => void;
  siteContent: SiteContent;
}

export const Header: React.FC<HeaderProps> = ({ tabs, activeTab, setActiveTab, isLoggedIn, onLoginToggle, siteContent }) => {
  return (
    <header className="bg-primary text-base-content shadow-md sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => setActiveTab('home')}
        >
          {siteContent.logoUrl && <img src={siteContent.logoUrl} alt={`${siteContent.companyName} Logo`} className="h-10 w-auto" />}
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            {siteContent.companyName}
          </h1>
        </div>
        <nav className="hidden md:flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'bg-accent text-white' : 'hover:bg-secondary'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </nav>
        <button
          onClick={onLoginToggle}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-accent text-white hover:opacity-90"
          aria-label={isLoggedIn ? 'Sair do modo admin' : 'Entrar no modo admin'}
        >
          {isLoggedIn ? <LogoutIcon className="w-5 h-5" /> : <LoginIcon className="w-5 h-5" />}
          <span className="hidden sm:inline">{isLoggedIn ? 'Sair' : 'Login'}</span>
        </button>
      </div>
      {/* Mobile Nav */}
      <nav className="md:hidden flex justify-center gap-2 p-2 bg-secondary overflow-x-auto">
         {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap ${
                activeTab === tab.id ? 'bg-accent text-white' : 'bg-base-100'
              }`}
            >
              {tab.title}
            </button>
          ))}
      </nav>
    </header>
  );
};
