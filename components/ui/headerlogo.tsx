import Link from "next/link"
import Image from "next/image"
import { Sparkle } from 'lucide-react';
export const Headerlogo= () => {
  return (
    
        <div className="items-center hidden lg:flex gap-2 mr-5">
            <Sparkle className="text-white h-8 w-8"/>
            <p className="font-semibold text-white">Finance</p>
        </div>

    
  )
}

