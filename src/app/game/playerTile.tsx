'use client';

import { ToastContainer } from "react-toastify";

export type PlayerTileProps = {
  name: string;
  emoji: string;
  onClick: ()=> void;
}; 
 
export default function PlayerTile({name, emoji, onClick}:PlayerTileProps) {
 
  return (
    <div onClick={()=>{onClick()}} className="w-24 h-24 bg-slate-300 hover:bg-slate-400 content-between rounded-md p-1">
      <div className="text-4xl  h-16 flex items-center justify-center">{emoji}</div>
      <div className="text-xs text-center text-nowrap truncate text-black h-4">{name}</div>
    </div>
  )
}