import { cn } from '@/lib/utils';
import React from 'react';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

interface AppBackgroundProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function Background({
  title,
  showBackButton = false,
  onBackPress,
  headerAction,
  children,
  className,
}: AppBackgroundProps) {
  const navigate = useNavigate();
  const handleBack = onBackPress ?? (() => navigate(-1));

  return (
    <div className={cn("min-h-screen bg-background flex flex-col bg-radial-gradient", className)}>
      {title && (
        <header className="sticky top-0 z-20 glass-dark shadow-[var(--shadow-header)] px-4 h-14 flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={handleBack}
              className="flex items-center justify-center p-1 cursor-pointer bg-transparent border-none text-primary-foreground/80 hover:text-primary-foreground active:scale-90 transition-all"
            >
              <IoChevronBack size={24} />
            </button>
          )}
          {!showBackButton && title && (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5">
                
                <h1
                  className="m-0 tracking-tight"
                  style={{
                    fontFamily: "'Alfa Slab One', serif",
                    fontSize: "2rem",
                    color: "#ffde59",
                    WebkitTextStroke: "1.4px #000",       // stroke/outline preto
                    textShadow: "3px 3px 0px #000",     // sombra preta deslocada
                    letterSpacing: "-0.02em",
                  }}
                >
                  {title}
                </h1>
              </div>
              {headerAction && (
                <div className="flex items-center">{headerAction}</div>
              )}
            </div>
          )}
          {showBackButton && title && (
            <h1
                  className="m-0 tracking-tight"
                  style={{
                    fontFamily: "'Alfa Slab One', serif",
                    fontSize: "2rem",
                    color: "#ffde59",
                    WebkitTextStroke: "1.4px #000",       // stroke/outline preto
                    textShadow: "3px 3px 0px #000",     // sombra preta deslocada
                    letterSpacing: "-0.02em",
                  }}
                >
                  {title}
                </h1>
          )}
        </header>
      )}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
