import React from 'react'
import { Button } from './button';
import Link from 'next/link';
import clsx from "clsx";



type Props={
    href:string;
    label:string;
    isActive?:boolean;

};

export const NavButton=({
    href,
    label,
    isActive,
}:Props) => {
  return (
    <Button
    variant='outline'
    size="sm"
    asChild
    className={clsx("sm:w-full w-auto justify-between bg-transparent text-white font-normal hover:bg-slate-500 hover:text-white border-none    focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none",
      isActive && "bg-slate-400 text-white ",
    )}
    >
    
        <Link href={href}>
            {label}
        </Link>
    </Button>
  );
}

