/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-[#00ffff] font-terminal overflow-hidden relative selection:bg-[#ff00ff] selection:text-black">
      {/* Static Noise Overlay */}
      <div className="static-noise" />
      
      {/* Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none z-40" />

      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center relative z-10">
        
        {/* Header */}
        <header className="w-full max-w-5xl flex items-center justify-between mb-8 border-b-4 border-[#ff00ff] pb-4 screen-tear">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[#ff00ff] font-pixel tracking-widest">SYS.OP.ID: 9948</span>
            <h1 className="text-2xl md:text-4xl font-pixel tracking-widest text-[#00ffff] uppercase glitch" data-text="SNAKE_PROTOCOL">
              SNAKE_PROTOCOL
            </h1>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-sm text-[#ff00ff] font-pixel uppercase tracking-widest">DATA_YIELD</span>
            <span className="text-4xl font-pixel text-[#00ffff] leading-none mt-2">
              {score.toString().padStart(4, '0')}
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="w-full max-w-5xl flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-16">
          
          {/* Game Container */}
          <div className="flex-1 w-full max-w-[500px] flex justify-center">
            <SnakeGame onScoreChange={setScore} />
          </div>

          {/* Sidebar / Music Player */}
          <div className="w-full lg:w-96 flex flex-col gap-8">
            <div className="bg-black border-2 border-[#00ffff] p-6 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#ff00ff] animate-pulse" />
              <h2 className="text-xl font-pixel text-[#ff00ff] mb-4 uppercase">MANUAL_OVERRIDE</h2>
              <ul className="text-[#00ffff] space-y-3 text-lg font-terminal tracking-wider">
                <li className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-[#00ffff] text-black font-bold">W,A,S,D</span>
                  <span>NAVIGATE_MATRIX</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-[#ff00ff] text-black font-bold">SPACE</span>
                  <span>HALT_EXECUTION</span>
                </li>
                <li className="mt-6 text-[#ff00ff] border-l-2 border-[#00ffff] pl-3">
                  WARNING: AVOID_SELF_INTERSECTION. 
                  <br/>
                  CONSUME_DATA_PACKETS_TO_EXPAND.
                </li>
              </ul>
            </div>

            <MusicPlayer />
          </div>

        </div>
      </div>
    </div>
  );
}
