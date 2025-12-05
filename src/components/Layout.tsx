import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Menu, X } from 'lucide-react';
import { Button } from './ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    closeMobileMenu();
    
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const headerContent = (
    <div className="flex justify-between items-center w-full">
      <Link to="/" className="animate-fade-in">
        <div className="flex items-center gap-2">
          <img src="/public/fullLogoLight.png" alt="nsuemLogo" />
        </div>
      </Link>
      
      <nav className="hidden md:flex items-center gap-10">
        <button 
          onClick={() => scrollToSection('course-content')}
          className="hover:text-nsuem-orange transition-colors duration-200"
        >
          Направления
        </button>
        <button 
          onClick={() => scrollToSection('learning-process')}
          className="hover:text-nsuem-orange transition-colors duration-200"
        >
          Обучение
        </button>
        <button 
          onClick={() => scrollToSection('faq')}
          className="hover:text-nsuem-orange transition-colors duration-200"
        >
          FAQ
        </button>
      </nav>
      
      <div className="hidden md:block">
        {user ? (
          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="flex items-center gap-2 hover:text-nsuem-orange transition-colors duration-200"
            >
              <User size={18} />
              <span className="hidden sm:inline-block">Личный кабинет</span>
            </Link>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 hover:text-nsuem-orange transition-colors duration-200"
          >
            <User size={18} />
            <span className="hidden sm:inline-block">Вход/Регистрация</span>
          </Link>
        )}
      </div>
      
      {/* Mobile menu button */}
      <button 
        className="md:hidden flex items-center text-white hover:text-nsuem-orange transition-colors"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-nsuem-dark text-white">
      {/* Main header */}
      <header className="py-6 px-8">
        <div className="container mx-auto max-w-7xl">
          {headerContent}
        </div>
      </header>
      
      {/* Floating header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 py-3 px-8 bg-nsuem-dark/95 backdrop-blur-md shadow-lg transform transition-transform duration-300 ease-in-out ${
          isScrolled ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          {headerContent}
        </div>
      </header>
      
      {/* Mobile menu */}
      <div className={`fixed inset-0 z-50 bg-nsuem-dark bg-opacity-95 md:hidden transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-10">
            <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
              <img src="/public/fullLogoLight.png" alt="nsuemLogo" />
            </Link>
            <button 
              className="text-white hover:text-nsuem-orange"
              onClick={closeMobileMenu}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          <nav className="flex flex-col gap-6 mb-10">
            <button 
              onClick={() => scrollToSection('course-content')}
              className="text-xl hover:text-nsuem-orange transition-colors duration-200 text-left"
            >
              Направления
            </button>
            <button 
              onClick={() => scrollToSection('learning-process')}
              className="text-xl hover:text-nsuem-orange transition-colors duration-200 text-left"
            >
              Обучение
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="text-xl hover:text-nsuem-orange transition-colors duration-200 text-left"
            >
              FAQ
            </button>
          </nav>
          
          <div className="mt-auto">
            {user ? (
              <div className="flex flex-col gap-4">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-xl hover:text-nsuem-orange transition-colors duration-200 py-2"
                  onClick={closeMobileMenu}
                >
                  <User size={20} />
                  <span>Личный кабинет</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="flex items-center gap-2 text-xl text-nsuem-red hover:text-red-400 transition-colors duration-200 py-2"
                >
                  <LogOut size={20} />
                  <span>Выйти</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 text-xl hover:text-nsuem-orange transition-colors duration-200 py-2"
                onClick={closeMobileMenu}
              >
                <User size={20} />
                <span>Вход/Регистрация</span>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      <main className="flex-grow bg-nsuem-gray">
        {children}
      </main>
      
      <footer className="py-8 px-8 bg-nsuem-dark">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <img src="/public/fullLogoLight.png" alt="nsuemLogo" />
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-6 text-sm text-gray-400">
              <span>© 2024 NSUEM School. Все права защищены. Студенческий проект</span>
            </div>
            
            <div className="flex gap-4">
              <a href="https://vk.com/nsuem" aria-label="vk" className="hover:text-nsuem-orange transition-colors" target="_blank">
                <img src="/public/icons/vk.svg" alt="vk"/>
              </a>
              <a href="https://t.me/prepod_inside" aria-label="telegram" className="hover:text-nsuem-orange transition-colors" target="_blank">
                <img src="/public/icons/telegram.svg" alt="telegram"/>
              </a>
              <a href="https://www.twitch.tv/prepod_inside" aria-label="vk" className="hover:text-nsuem-orange transition-colors" target="_blank">
                <img src="/public/icons/twitch.svg" alt="twitch"/>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
