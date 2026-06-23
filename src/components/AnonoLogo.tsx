import React from 'react';

interface AnonoLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const AnonoLogo: React.FC<AnonoLogoProps> = ({ 
  className = '', 
  size = 40,
  showText = false 
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`} id="anono-brand-logo-container">
      {/* High-Fidelity 3D Braided Vector Logo */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm filter"
        id="anono-svg-logo"
      >
        <defs>
          {/* Mint/Teal to Turquoise Gradient for Left Ribbon */}
          <linearGradient id="tealRibbon" x1="15%" y1="90%" x2="55%" y2="10%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="50%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Ocean Blue to Indigo Loop Gradient for Right Ribbon */}
          <linearGradient id="blueRibbon" x1="45%" y1="15%" x2="95%" y2="85%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="60%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>

          {/* Deep inner drop shadow to create a 3D overlay weave effect */}
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="3" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Gray underlying subtle placeholder path for dynamic layout depth */}
        <path
          d="M 60 18 L 86 70 C 94 85 106 82 106 68 C 106 50 88 44 76 54 L 42 88"
          stroke="#1e293b"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.05"
        />

        {/* 1. Left Ribbon & Main arching trunk (Teal/Turquoise) */}
        <path
          d="M 40 85 C 24 85 15 54 32 45 C 45 38 52 52 60 18 C 61 14 65 14 66 18 C 72 40 82 72 92 88"
          stroke="url(#tealRibbon)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#softShadow)"
        />

        {/* 2. Inner Core loop (reinforces the triangular "A" peak) */}
        <path
          d="M 46 64 C 46 64 54 48 59 30 C 60 27 63 27 64 30 C 67 40 70 50 74 61"
          stroke="url(#tealRibbon)"
          strokeWidth="6.5"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* 3. Right Ribbon & Woven crossbar loop (Blue/Indigo) */}
        {/* Carefully layered path that creates the exact braided knot topology */}
        <path
          d="M 52 65 C 56 61 72 58 84 74 C 94 87 106 84 106 68 C 106 48 84 42 74 54 L 46 88"
          stroke="url(#blueRibbon)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#softShadow)"
        />

        {/* Highlights/Gloss to simulate 3D metallic feel */}
        <path
          d="M 33 46 C 29 48 24 60 30 76"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.3"
        />
        <path
          d="M 82 75 C 90 82 96 82 100 76"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.25"
        />
      </svg>

      {/* Styled Brand Text Label if enabled */}
      {showText && (
        <span className="text-xl font-extrabold tracking-widest text-[#0f172a] font-sans antialiased flex items-center">
          ANONO
        </span>
      )}
    </div>
  );
};
