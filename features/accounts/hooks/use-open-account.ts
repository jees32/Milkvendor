import {create} from "zustand";

type openAccountState = {
    id?:string;
    isOpen:boolean;
    onOpen: (id:string)=> void;
    onClose: ()=> void;
};


export const useOpenAccount = create<openAccountState>((set) => ({
    id: undefined,
    isOpen: false,
    onOpen: (id: string) => {
      console.log("Opening account sheet with ID:", id);
      set({ isOpen: true, id });
    },
    onClose: () => {
      console.log("Closing account sheet");
      set({ isOpen: false, id: undefined });
    },
  }));