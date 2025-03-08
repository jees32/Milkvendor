"use client"

import React from 'react';
import { Headerlogo } from './headerlogo';
import { Navigation } from './navigation';
import { UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Loader2 } from 'lucide-react';
import { WelcomeMsg } from './welcome-message';
import { useUser } from '@clerk/nextjs';
import { LandingPage } from './landing-page';
import { usePathname } from 'next/navigation';
import Link from 'next/link'; // Import Link to navigate to the sign-in page
import { LogIn } from 'lucide-react'; // Import an icon, e.g., LogIn from lucide-react
import { Button } from './button';
import { buttonVariants } from '@/components/ui/button';
import { type VariantProps } from 'class-variance-authority';

export const Header = () => {
  const { user, isSignedIn, isLoaded: userLoaded } = useUser();
  const pathName = usePathname();

  // Show loading state if user data is still being fetched
  if (!userLoaded) {
    return (
      <header className='bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-4 lg:px-14 pb-36'>
        <div className='max-w-screen-2xl mx-auto'>
          <div className='w-full flex items-center justify-between mb-10'>
            <div className='flex items-center lg:gap-x-6'>
              <Headerlogo />
              <Navigation />
            </div>
            <ClerkLoading>
              <Loader2 className='size-8 animate-spin text-slate-400' />
            </ClerkLoading>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className='bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-4 lg:px-14 pb-36'>
      <div className='max-w-screen-2xl mx-auto'>
        <div className='w-full flex items-center justify-between mb-10'>
          <div className='flex items-center lg:gap-x-6'>
            <Headerlogo />
            <Navigation />
          </div>

          {/* Conditionally render SignIn button or UserButton */}
          {isSignedIn ? (
            <ClerkLoaded>
              <UserButton afterSignOutUrl='/' />
            </ClerkLoaded>
          ) : (
            <ClerkLoaded>
           
               <Link className="flex text-white" href="/sign-in">                
                  <LogIn className="mr-2" />
                  Sign In                
              </Link>
            </ClerkLoaded>
          )}
        </div>
      </div>

      {/* Conditional page content */}
      {pathName === '/' ? (
        <LandingPage />
      ) : pathName === '/upgrade' ? (
        <h2 className='text-3xl text-white'>Upgrade your plan for better insights!</h2>
      ) : (
        <WelcomeMsg />
      )}
    </header>
  );
};
