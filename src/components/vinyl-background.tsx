"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function VinylBackground() {
    const [isSpinning, setIsSpinning] = useState(true);

    useEffect(() => {
        // Stop spinning after 5 seconds
        const timer = setTimeout(() => {
            setIsSpinning(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden flex items-center justify-center opacity-10 blur-[1px]">
            {/* Vinyl Record Container */}
            <div
                className={cn(
                    "relative w-[40rem] h-[40rem] rounded-full border-4 border-neutral-800 bg-black shadow-2xl",
                    isSpinning && "animate-spin"
                )}
                style={{
                    animationDuration: "3s",
                    animationTimingFunction: "linear"
                }}
            >
                {/* Grooves (CSS Radial Gradient) */}
                <div
                    className="absolute inset-0 rounded-full opacity-80"
                    style={{
                        background: `repeating-radial-gradient(
                  #111 0, 
                  #111 4px, 
                  #222 5px, 
                  #222 6px
                )`
                    }}
                />

                {/* Shine effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent rotate-45" />

                {/* Center Label */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-primary flex items-center justify-center border-8 border-neutral-900 shadow-inner">
                    <div className="text-primary-foreground font-black text-sm tracking-widest text-center opacity-80 rotate-90">
                        RETUMBA
                        <br />
                        SOUNDS
                    </div>
                    {/* Center Hole */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-neutral-900 rounded-full border border-neutral-700" />
                </div>
            </div>
        </div>
    );
}
