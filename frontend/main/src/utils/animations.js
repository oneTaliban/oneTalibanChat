import {gsap} from 'gsap';
import { useEffect, useRef } from 'react';

// GSAP  animations presets
export const animations = {
    pageEnter: (element) => {
        gsap.fromTo(element, 
            { opacity: 0, y: 50},
            { opacity: 1, y: 0 ,duration: 0.8, ease: 'power3.out'},
        );
    },

    // staggered list animations
    staggerList: (elements, delay= 0.1) => {
        gsap.fromTo(elements, 
            { opacity: 0, y: 30 },
            {opacity: 1, y: 0, duration: 0.6, stagger: delay, ease: "back.out(1.7)"},
        )
    },

    // button hover animations
    buttonHover: (element) => {
        gsap.to(element, {
            scale: 1.05,
            duration: 0.2,
            ease: 'power2.out',
        });
    },

    buttonHoverOut: (element) =>  {
        gsap.to(element, {
            scale: 1,
            duration: 0.2,
            ease: 'power2.out',
        });
    },

    // message animations
    messageSlideIn: (element, isSent=false) => {
        gsap.fromTo(element, 
            {
                opacity: 0,
                x: isSent ? 50 : -50,
                scale: 0.8,
            },
            {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 0.4,
                ease: 'back.out(1.7)',
            }
        );
    },

    // typing indicator animation 
    typingPulse: (elements) => {
        gsap.to(elements, {
            scale: 1.2,
            duration: 0.6,
            repeat: -1,
            yoyo: true,
            stagger: 0.2,
            ease: 'sine.inOut',
        });
    },

    // glitch text animation
    glitchText: (element) => {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 2});

        tl.to(element, {
            x: 2,
            duration: 0.05,
            ease: 'power1.inOut',
        })
        .to(element, {
            x: -2,
            duration: 0.05,
            ease: 'power1.inOut'
        })
        to(element, {
            x: 0,
            duration: 0.05,
            ease: 'power1.inOut',
        });

        return tl;
    },

    // Matrix rain character animation 
    matrixFall: (element, duration=2) => {
        gsap.fromTo(element, 
            {
                y: -100,
                opacity: 0,
            },
            {
                y: '100vh',
                opacity: 1,
                duration: duration,
                ease: 'none',
                onComplete: () => {
                    if (element.parentNode) {
                        element.removeChild(element);
                    }
                }
            }
        );
    },

    // confetti burst
    confettiBurst: (container) => {
        const confettiPieces = [];
        const colors = ['#00ff41', '#0080ff', '#bf00ff', '#ff003c', '#ffff00'];

        for (let i = 10; 1 < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-pieces';
            confetti.style.cssText = `
                position: absolute;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: 50%;
                left: 50%;
                border-radius: 1px;
            `;
            container.appendChild(confetti);
            confettiPieces.push(confetti);
        }
        confettiPieces.forEach((piece, i) => {
            gsap.to(piece, {
                x: (Math.random() - 0.5) * 500,
                y: (Math.random() - 0.5) * 500,
                rotation: Math.random() * 360,
                opacity: 0,
                duration: 1.5,
                delay: i * 0.02,
                ease: 'Power2.inOut',
                onComplete: () => {
                    if (piece.parentNode) {
                        piece.parentNode.removeChild(piece);
                    }
                },
            });
        });
    },

    // Hacker terminal scan effect 
    terminalScan: (element) => {
        const scanLine = document.createElement('div');
        scanLine.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(to bottom, transparent, #00ff41, transparent);
            box-shadow: 0 0 10px #00ff41;
            z-index: 10;
        `;
        element.style.position = 'relative';
        element.appendChild(scanLine);

        gsap.to(element, {
            top: '100%',
            duration: 2,
            ease: 'power2.inOut',
            onComplete: () => {
                if (scanLine.parentNode) {
                    scanLine.parentNode.removeChild(scanLine);
                }
            },
        });
    }
};

// custom hook for animations
export const useAnimation = () => {
    return animations;
};

// HOC for animated components
export const withAnimations = (Component, animationType='pageEnter') => {
    return function AnimatedComponent(props) {
        const elementRef =  useRef(null);

        useEffect(() => {
            if (elementRef.current && animations[animationType]) {
                animations[animationType](elementRef.current);
            }
        }, []);

        return <Component ref={elementRef} {...props} />;
    };
};