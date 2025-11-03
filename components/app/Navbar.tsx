"use client";

import { HomeIcon, LogIn, Menu, UserPlus } from 'lucide-react';
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

const navLinks = [
  { title: 'home', icon: HomeIcon, href: '/' },
  { title: 'login', icon: LogIn, href: '/login' },
  { title: 'signup', icon: UserPlus, href: '/signup' },
];

const Navbar = () => {
  const t = useTranslations('navbar');

  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8'>
        
        {/* Logo/Brand */}
        <div className="font-bold text-xl tracking-tight">
          <Link href="/">
            Logo <span className="text-primary">App</span>
          </Link>
        </div>

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
        </nav>

        {/* Mobile Navigation */}
        <div className='md:hidden'>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            
            {/* 🚀 Change: side="top" */}
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
    </header>
  );
}

export default Navbar;  