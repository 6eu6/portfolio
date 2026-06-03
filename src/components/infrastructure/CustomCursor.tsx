'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

interface CursorProps {
  isDark?: boolean;
}

function isTouchDevice() {
  return typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
}

export default function CustomCursor({ isDark = false }: CursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const followerPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const isMobile = typeof window !== 'undefined' ? isTouchDevice() : true;

  useEffect(() => {
    if (isMobile) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    document.body.style.cursor = 'none';

    const onMouseMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseEnterHover = () => setIsHovering(true);
    const onMouseLeaveHover = () => setIsHovering(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    const addHoverListeners = () => {
      const hoverables = document.querySelectorAll('a, button, [role="button"], input, textarea, [cursor="pointer"]');
      hoverables.forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterHover);
        el.addEventListener('mouseleave', onMouseLeaveHover);
      });
      return hoverables;
    };

    let elements: NodeListOf<Element> = addHoverListeners();

    const interval = setInterval(() => {
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterHover);
        el.removeEventListener('mouseleave', onMouseLeaveHover);
      });
      elements = addHoverListeners();
    }, 2000);

    const animate = () => {
      followerPos.current.x += (pos.current.x - followerPos.current.x) * 0.12;
      followerPos.current.y += (pos.current.y - followerPos.current.y) * 0.12;

      gsap.set(cursor, { x: pos.current.x, y: pos.current.y });
      gsap.set(follower, { x: followerPos.current.x, y: followerPos.current.y });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(interval);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterHover);
        el.removeEventListener('mouseleave', onMouseLeaveHover);
      });
      document.body.style.cursor = '';
    };
  }, [isMobile]);

  useEffect(() => {
    const follower = followerRef.current;
    if (!follower || isMobile) return;

    const borderColor = isHovering ? 'var(--sage)' : (isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.25)');

    gsap.to(follower, {
      width: isHovering ? 56 : 32,
      height: isHovering ? 56 : 32,
      opacity: isHovering ? 0.8 : 0.3,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        if (follower) {
          follower.style.borderColor = borderColor;
        }
      },
    });
  }, [isHovering, isDark, isMobile]);

  useEffect(() => {
    const follower = followerRef.current;
    if (!follower || isMobile || !isClicking) return;

    gsap.to(follower, {
      scale: 0.7,
      duration: 0.1,
      ease: 'power2.in',
      onComplete: () => {
        gsap.to(follower, { scale: 1, duration: 0.2 });
      },
    });
  }, [isClicking, isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div ref={cursorRef} className="fixed top-0 left-0 z-[9998] pointer-events-none" style={{ willChange: 'transform' }}>
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--ink)]" style={{ transform: 'translate(-50%, -50%)' }} />
      </div>
      <div ref={followerRef} className="fixed top-0 left-0 z-[9997] pointer-events-none" style={{ willChange: 'transform' }}>
        <div className="w-8 h-8 rounded-full border-2 border-[var(--ink)]/25" style={{ transform: 'translate(-50%, -50%)' }} />
      </div>
    </>
  );
}
