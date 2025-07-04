import React, { useEffect, useRef } from 'react';

const ParticleSystem = ({
  particleCount = 25,
  colors = ['#3b82f6', '#8b5cf6', '#ec4899'],
  speed = 1,
  size = 'small',
  type = 'floating' // 'floating', 'explosion', 'spiral', 'magic'
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing particles
    container.innerHTML = '';

    // Create particles based on type
    for (let i = 0; i < particleCount; i++) {
      const particle = createParticle(i, colors, speed, size, type);
      container.appendChild(particle);
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [particleCount, colors, speed, size, type]);

  const createParticle = (index, colors, speed, size, type) => {
    const particle = document.createElement('div');
    particle.className = `particle particle-${type}`;
    
    // Random color from palette
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Size variations
    const sizeMap = {
      small: Math.random() * 4 + 2,
      medium: Math.random() * 8 + 4,
      large: Math.random() * 12 + 6
    };
    const particleSize = sizeMap[size] || sizeMap.small;
    
    // Position
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // Animation properties
    const animationDuration = (Math.random() * 10 + 5) / speed;
    const animationDelay = Math.random() * 5;
    
    // Apply styles based on particle type
    switch (type) {
      case 'floating':
        applyFloatingStyles(particle, color, particleSize, x, y, animationDuration, animationDelay);
        break;
      case 'explosion':
        applyExplosionStyles(particle, color, particleSize, index, particleCount, animationDuration);
        break;
      case 'spiral':
        applySpiralStyles(particle, color, particleSize, index, animationDuration, animationDelay);
        break;
      case 'magic':
        applyMagicStyles(particle, color, particleSize, x, y, animationDuration, animationDelay);
        break;
      default:
        applyFloatingStyles(particle, color, particleSize, x, y, animationDuration, animationDelay);
    }
    
    return particle;
  };

  const applyFloatingStyles = (particle, color, size, x, y, duration, delay) => {
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, ${color}, transparent);
      border-radius: 50%;
      left: ${x}%;
      top: ${y}%;
      opacity: 0.7;
      animation: particle-float ${duration}s ease-in-out infinite;
      animation-delay: ${delay}s;
      pointer-events: none;
      z-index: 1;
      box-shadow: 0 0 ${size * 2}px ${color}40;
    `;
  };

  const applyExplosionStyles = (particle, color, size, index, total, duration) => {
    const angle = (index / total) * 360;
    const distance = Math.random() * 200 + 100;
    
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, ${color}, transparent);
      border-radius: 50%;
      left: 50%;
      top: 50%;
      opacity: 1;
      transform: translate(-50%, -50%);
      animation: particle-explosion-${index} ${duration}s ease-out forwards;
      pointer-events: none;
      z-index: 1;
      box-shadow: 0 0 ${size * 3}px ${color};
    `;

    // Create unique explosion animation
    const keyframes = `
      @keyframes particle-explosion-${index} {
        0% {
          transform: translate(-50%, -50%) scale(0);
          opacity: 1;
        }
        50% {
          opacity: 1;
        }
        100% {
          transform: translate(
            calc(-50% + ${Math.cos(angle * Math.PI / 180) * distance}px),
            calc(-50% + ${Math.sin(angle * Math.PI / 180) * distance}px)
          ) scale(0.5);
          opacity: 0;
        }
      }
    `;
    
    // Add keyframes to document
    if (!document.querySelector(`#explosion-${index}`)) {
      const style = document.createElement('style');
      style.id = `explosion-${index}`;
      style.textContent = keyframes;
      document.head.appendChild(style);
    }
  };

  const applySpiralStyles = (particle, color, size, index, duration, delay) => {
    const radius = 100;
    const centerX = 50;
    const centerY = 50;
    
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, ${color}, transparent);
      border-radius: 50%;
      left: ${centerX}%;
      top: ${centerY}%;
      opacity: 0.8;
      transform: translate(-50%, -50%);
      animation: particle-spiral-${index} ${duration}s linear infinite;
      animation-delay: ${delay}s;
      pointer-events: none;
      z-index: 1;
      box-shadow: 0 0 ${size * 2}px ${color}60;
    `;

    // Create spiral animation
    const keyframes = `
      @keyframes particle-spiral-${index} {
        0% {
          transform: translate(-50%, -50%) 
                     rotate(0deg) 
                     translateX(${radius * (index / 10)}px) 
                     rotate(0deg);
        }
        100% {
          transform: translate(-50%, -50%) 
                     rotate(360deg) 
                     translateX(${radius * (index / 10)}px) 
                     rotate(-360deg);
        }
      }
    `;
    
    if (!document.querySelector(`#spiral-${index}`)) {
      const style = document.createElement('style');
      style.id = `spiral-${index}`;
      style.textContent = keyframes;
      document.head.appendChild(style);
    }
  };

  const applyMagicStyles = (particle, color, size, x, y, duration, delay) => {
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, ${color}, transparent);
      border-radius: 50%;
      left: ${x}%;
      top: ${y}%;
      opacity: 0.9;
      animation: particle-magic ${duration}s ease-in-out infinite;
      animation-delay: ${delay}s;
      pointer-events: none;
      z-index: 1;
      box-shadow: 
        0 0 ${size * 2}px ${color},
        0 0 ${size * 4}px ${color}40,
        inset 0 0 ${size}px ${color}80;
      filter: blur(0.5px);
    `;
  };

  return (
    <div 
      ref={containerRef}
      className="particle-container absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

// Specialized particle components
export const FloatingParticles = (props) => (
  <ParticleSystem type="floating" particleCount={30} {...props} />
);

export const ExplosionParticles = (props) => (
  <ParticleSystem type="explosion" particleCount={20} {...props} />
);

export const SpiralParticles = (props) => (
  <ParticleSystem type="spiral" particleCount={15} {...props} />
);

export const MagicParticles = (props) => (
  <ParticleSystem 
    type="magic" 
    particleCount={25} 
    colors={['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1']}
    {...props} 
  />
);

// CSS for magic particle animation
const magicParticleCSS = `
  @keyframes particle-magic {
    0%, 100% {
      transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
      opacity: 0.9;
    }
    25% {
      transform: translateY(-15px) translateX(10px) rotate(90deg) scale(1.2);
      opacity: 1;
    }
    50% {
      transform: translateY(-5px) translateX(-8px) rotate(180deg) scale(0.8);
      opacity: 0.7;
    }
    75% {
      transform: translateY(-20px) translateX(15px) rotate(270deg) scale(1.1);
      opacity: 1;
    }
  }
`;

// Inject magic particle CSS
if (typeof document !== 'undefined' && !document.querySelector('#magic-particle-styles')) {
  const style = document.createElement('style');
  style.id = 'magic-particle-styles';
  style.textContent = magicParticleCSS;
  document.head.appendChild(style);
}

export default ParticleSystem;
