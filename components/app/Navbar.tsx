"use client";

import { HomeIcon, LogIn, Menu, UserPlus, Languages } from 'lucide-react';
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
// --- New Imports for Language Dropdown ---
import { useRouter, usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'; // Assuming you have shadcn/ui DropdownMenu
// ------------------------------------------

// --- Assuming your supported locales are defined somewhere, e.g., in a config file ---
const SUPPORTED_LOCALES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },

  // Add more locales as needed
];
// -----------------------------------------------------------------------------------

const navLinks = [
  { title: 'home', icon: HomeIcon, href: '/' },
  { title: 'login', icon: LogIn, href: '/login' },
  { title: 'signup', icon: UserPlus, href: '/signup' },
];

const Navbar = () => {
  const t = useTranslations('navbar');

  // --- Hooks for Language Dropdown ---
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  // -----------------------------------

  // Function to handle locale change
  const onLocaleChange = (newLocale: string) => {
    // Replace the current locale segment in the URL with the new locale
    // e.g., /en/login becomes /fr/login
    const newPathname = `/${newLocale}${pathname.substring(3)}`; 
    router.replace(newPathname);
  };

  // Language Dropdown Component
  const LanguageSwitcher = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Languages className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {SUPPORTED_LOCALES.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => onLocaleChange(locale.code)}
            // Highlight the currently active locale
            className={
              currentLocale === locale.code ? 'font-bold bg-muted' : ''
            }
          >
            {locale.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8'>

        {/* Logo/Brand */}
        <div className="font-bold text-xl tracking-tight">
          <Link href="/">
            Logo <span className="text-primary">App</span>
          </Link>
        </div>
        
        <div className='flex items-center space-x-4'>
            {/* Desktop Navigation */}
            <nav className='hidden md:flex items-center space-x-4'>
              {navLinks.map((nav, i) => (
                <Button asChild variant="ghost" key={i}>
                  <Link href={nav.href} className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary">
                    <nav.icon className="h-4 w-4" /> 
                    <span>{t(nav.title)}</span>
                  </Link>
                </Button>
              ))}
              {/* --- New: Language Switcher for Desktop --- */}
              <LanguageSwitcher />
              {/* ------------------------------------------ */}
            </nav>

            {/* Mobile Navigation */}
            <div className='md:hidden flex items-center space-x-2'> 
                {/* --- New: Language Switcher for Mobile (outside the sheet trigger) --- */}
                <LanguageSwitcher />
                {/* --------------------------------------------------------------------- */}
                <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                      </Button>
                    </SheetTrigger>
                    
                    <SheetContent side="left"> 
                      <div className="flex flex-col space-y-2 p-6">
                        {navLinks.map((nav, i) => {
                          const Icon = nav.icon;
                          return (
                            <Link 
                              href={nav.href} 
                              key={i} 
                              className="flex items-center space-x-4 p-3 rounded-md transition-colors hover:bg-muted font-semibold text-base"
                            >
                              <Icon className="h-5 w-5 text-primary" />
                              <span>{t(nav.title)}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;