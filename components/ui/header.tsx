
import React from 'react'
import { Headerlogo } from './headerlogo';
import { Navigation } from './navigation';
import { UserButton,ClerkLoading,ClerkLoaded } from "@clerk/nextjs"
import { Loader2 } from 'lucide-react';
import { WelcomeMsg } from './welcome-message';
import { useUser,isLoaded } from '@clerk/nextjs';

export const Header=() => {
  return (
    <header className='bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-4
    lg:px-14 pb-36'>
        <div className='max-w.screen-2xl mx-auto'>  
            <div className='w-full flex items-center justify-between mb-10'>
                <div className='flex items-center lg-gap-x-16'>
                    <Headerlogo/>
                    <Navigation/>
                </div>
                <ClerkLoaded>
                <UserButton afterSignOutUrl='/'/>
                </ClerkLoaded>
                <ClerkLoading>
                    <Loader2 className='size-8 animate-spin text-slate-400'/>
                </ClerkLoading>
            </div>
           </div>
            <WelcomeMsg/>
          
        </header>
  );
};

