import React, {useEffect, useRef} from 'react';
import {gsap} from 'gsap';

const TypeWriter = () => {
  const textRef = useRef(null);

  useEffect(() => {
    const text = "One Taliban";
    let displayText = "";
    let index = 0;
    let isDeleting = false;
    let isBackspaced = false;

    const type = () => {
      const current = displayText;
      if (!isDeleting && !isBackspaced) {
        // norma typing until One Tal
        if (index < 8) {
          displayText = text.slice(0, index+1);
          index++;
        }
        // start backspacing "il" from Taliban
        else if (index === 8) {
          isDeleting = true;
          setTimeout(type, 100);
          return;
        }
      } else if (isDeleting && !isBackspaced) {
        // backspace "il" the first character
        if (displayText.length > 7) {
          displayText = displayText.slice(0, -1);
        } else {
          isDeleting = false;
          isBackspaced = true;
        }
      } else if (isBackspaced) {
        // continue typing ban to complete one taliban
        if (index < text.length) {
          displayText = "One Tali" + text.slice(8, index + 1);
          index++;
        } else {
          // Animation is complete restart after delay
          setTimeout(() => {
            displayText = "";
            index = 0;
            isBackspaced = false;
            setTimeout(type, 1000);
          }, 3000);
          return;
        }
      }
      
      if (textRef.current) {
        textRef.current.texcontent = displayText;
        textRef.current.innerHTML = displayText.replace("Taliban", "<span className='text-red-500 font-bold '>Taliban</span>");

      }

      const typeSpeed = isDeleting ? 50 : (isBackspaced ? 100 : 150);
      setTimeout(type, typeSpeed);
    };

    type();

    // gsap animation for floating effect
    gsap.to(textRef.current, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });

  }, [])

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <h1
        ref={textRef}
        className="text-3xl font-bold text-white bg-black/50 px-6 py-3 rounded-full border border-purple-500 shadow-lg shadow-purple-500/50 backdrop-blur-sm">
          {/* {text will be populated by js} */}
      </h1>
    </div>
  )
}

export default TypeWriter