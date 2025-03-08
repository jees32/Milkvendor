"use client";
import {useMedia} from 'react-use'
import { usePathname } from "next/navigation";
import { NavButton } from "./nav-button";
import { useState } from 'react';
import {
    Sheet,
    SheetContent, 
    SheetTrigger,
  } from "@/components/ui/sheet"
import { useRouter } from 'next/navigation';
import { Button } from './button';
import { Menu } from 'lucide-react';

const routes=[
    {
        href:"/",
        label:"Home"
    },
    {
        href:"/dashboard",
        label:"Dashboard"
    },
    {
        href:"/accounts",
        label:"Accounts"
    },
    {
        href:"/transactions",
        label:"Transactions"
    },
    {
        href:"/upgrade",
        label:"Upgrade"
    },
    
    
  

];


export const Navigation = () => {
    const [isOpen,setIsOpen]=useState(false);
    const pathname=usePathname();
    const router=useRouter();
    const isMobile=useMedia("(max-width: 1024px)",false);

    const onClick=(href:string)=>{
        router.push(href)
        setIsOpen(false)

    };

    if( isMobile) {
        return(
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger>
                    <Button
                    variant="outline"
                    size="sm"
                    className='font-normal bg-white/10 hover:bg-white/20
                    hover:text-white border-none *:focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none '>
                    <Menu className='size-4 '/>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className='px-2'>
                    <nav className='flex flex-col gap-y-2 pt-6'>
                        {routes.map((route) => (
                            <Button key={route.href} 
                            variant={route.href===pathname?"secondary" : "ghost"}                            
                            onClick={() =>onClick(route.href)                               
                            }
                            className='w-full justify-start'>
                                {route.label}
                            </Button>
                        )
                    )}

                    </nav>

                </SheetContent>
            </Sheet>
        )
    }

    // if (isMobile) {
    //     return (
    //       <Sheet>
    //         <SheetTrigger asChild>
    //           <div
    //             className="font-normal bg-white/10 hover:bg-white/20
    //             hover:text-white border-none focus-visible:ring-transparent
    //             outline-none cursor-pointer p-2 rounded"
    //           >
    //             <Menu className="size-4" />
    //           </div>
    //         </SheetTrigger>
      
    //         <SheetContent side="left" className="px-2">
    //           <nav className="flex flex-col gap-y-2 pt-6">
    //             {routes.map((route) => (
    //               <Button
    //                 key={route.href}
    //                 variant={route.href === pathname ? "secondary" : "ghost"}
    //                 onClick={() => onClick(route.href)}
    //                 className="w-full justify-start"
    //               >
    //                 {route.label}
    //               </Button>
    //             ))}
    //           </nav>
    //         </SheetContent>
    //       </Sheet>
    //     );
    //   }

  return (
    <>
    <nav className="flex items-center gap-x-2 overflow-x-auto">
        {routes.map((route) =>(
            <NavButton 
            key={route.label}
            href={route.href}
            label={route.label}
            isActive={pathname === route.href}
            
            />
        )

        )}

    </nav>
    </>
  )
}

