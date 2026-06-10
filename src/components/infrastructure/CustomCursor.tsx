'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface CursorProps {
  isDark?: boolean;
}

const HOVERABLE_SELECTOR = 'a, button, [role="button"], input, textarea, [cursor="pointer"], [data-cursor="pointer"]';

function isTouchDevice() {
  return typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
}

export default function CustomCursor({ isDark = false }: CursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pos = useRef({ x: -100, y: -100 });
  const followerPos = useRef({ x: -100, y: -100 });
  // Trail positions buffer (most recent first)
  const trailBuffer = useRef<{ x: number; y: number }[]>(
    Array.from({ length: 3 }, () => ({ x: -100, y: -100 }))
  );
  const rafRef = useRef<number>(0);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText] = useState('');
  const blendModeRef = useRef<'normal' | 'difference'>(isDark ? 'difference' : 'normal');
  // Render nothing until mounted so server and client first-paint match
  // (computing touch capability during render causes a hydration mismatch).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isMobile = !mounted || isTouchDevice();

  // ── Also detect dark backgrounds under cursor via MutationObserver
  //    watching for elements with data-theme="dark" or [data-dark-section] ──
  // ── Main animation loop + event wiring + MutationObserver ───────
  useEffect(() => {
    if (isMobile) return;

    // Sync blend mode from isDark prop
    blendModeRef.current = isDark ? 'difference' : 'normal';

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    const label = labelRef.current;
    if (!cursor || !follower) return;

    document.body.style.cursor = 'none';

    // ── Mouse position tracking ──────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseDown = () => {
      if (follower) gsap.to(follower, { scale: 0.6, duration: 0.12, ease: 'power3.in' });
    };
    const onMouseUp = () => {
      if (follower) gsap.to(follower, { scale: isHovering ? 1.6 : 1, duration: 0.35, ease: 'elastic.out(1, 0.4)' });
    };

    // ── Hover enter / leave ─────────────────────────────────────
    const onHoverEnter = (e: Event) => {
      setIsHovering(true);
      const target = e.currentTarget as HTMLElement;
      // Try to extract label text from links/buttons
      const text = target.closest('a')?.textContent?.trim() || target.closest('button')?.textContent?.trim() || '';
      setHoverText(text.length > 30 ? text.slice(0, 30) + '…' : text);
      // Check if hovered element (or parent) indicates dark section
      const isDarkSection = target.closest('[data-dark-section]') !== null;
      blendModeRef.current = isDarkSection ? 'difference' : 'normal';
    };
    const onHoverLeave = () => {
      setIsHovering(false);
      setHoverText('');
      blendModeRef.current = isDark ? 'difference' : 'normal';
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // ── Attach hover listeners to current hoverables ─────────────
    const attachListeners = (root: Document | Element = document) => {
      const hoverables = root.querySelectorAll(HOVERABLE_SELECTOR);
      hoverables.forEach((el) => {
        el.addEventListener('mouseenter', onHoverEnter);
        el.addEventListener('mouseleave', onHoverLeave);
      });
      return hoverables;
    };

    const cleanupListeners = (elements: NodeListOf<Element>) => {
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', onHoverEnter);
        el.removeEventListener('mouseleave', onHoverLeave);
      });
    };

    let currentElements: NodeListOf<Element> = attachListeners();

    // ── MutationObserver instead of setInterval ──────────────────
    const observer = new MutationObserver((mutations) => {
      let needsRefresh = false;
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          needsRefresh = true;
          break;
        }
      }
      if (needsRefresh) {
        cleanupListeners(currentElements);
        currentElements = attachListeners();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // ── Animation frame loop ────────────────────────────────────
    const animate = () => {
      // Shift trail buffer – newest position goes to index 0
      for (let i = trailBuffer.current.length - 1; i > 0; i--) {
        trailBuffer.current[i] = { ...trailBuffer.current[i - 1] };
      }
      trailBuffer.current[0] = { ...pos.current };

      // Lerp follower
      followerPos.current.x += (pos.current.x - followerPos.current.x) * 0.1;
      followerPos.current.y += (pos.current.y - followerPos.current.y) * 0.1;

      // Position cursor dot
      gsap.set(cursor, { x: pos.current.x, y: pos.current.y });

      // Position follower
      gsap.set(follower, {
        x: followerPos.current.x,
        y: followerPos.current.y,
      });

      // Position trail dots with decreasing opacity
      trailRefs.current.forEach((trailEl, i) => {
        if (!trailEl) return;
        const t = trailBuffer.current[i + 1]; // +1 because index 0 is current
        if (t) {
          gsap.set(trailEl, {
            x: t.x,
            y: t.y,
            opacity: (1 - (i + 1) * 0.3) * 0.4,
            scale: 1 - (i + 1) * 0.2,
          });
        }
      });

      // Position label near follower
      if (label) {
        gsap.set(label, {
          x: followerPos.current.x,
          y: followerPos.current.y,
        });
      }

      // Apply blend mode from ref to all cursor elements
      const bm = blendModeRef.current;
      cursor.style.mixBlendMode = bm;
      follower.style.mixBlendMode = bm;
      trailRefs.current.forEach((trailEl) => {
        if (trailEl) trailEl.style.mixBlendMode = bm;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      cleanupListeners(currentElements);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
    };
  }, [isMobile, isDark]);

  // ── Animate follower size/shape on hover state change ──────────
  useEffect(() => {
    const follower = followerRef.current;
    const label = labelRef.current;
    if (!follower || isMobile) return;

    const size = isHovering ? 56 : 32;
    const borderRadius = isHovering ? '30%' : '50%';

    gsap.to(follower, {
      width: size,
      height: size,
      borderRadius,
      duration: 0.4,
      ease: 'power3.out',
    });

    if (label) {
      if (isHovering && hoverText) {
        gsap.to(label, { opacity: 1, y: -16, duration: 0.3, ease: 'power2.out', delay: 0.1 });
      } else {
        gsap.to(label, { opacity: 0, y: 0, duration: 0.2, ease: 'power2.in' });
      }
    }
  }, [isHovering, hoverText, isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* ── Main cursor dot ──────────────────────────────────────── */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          willChange: 'transform',
        }}
      >
        <div
          className="rounded-full bg-[var(--ink)]"
          style={{
            width: 6,
            height: 6,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {/* ── Trailing dots (2 extra positions) ─────────────────────── */}
      {[0, 1].map((i) => (
        <div
          key={`trail-${i}`}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          className="fixed top-0 left-0 z-[9996] pointer-events-none"
          style={{ willChange: 'transform' }}
        >
          <div
            className="rounded-full bg-[var(--ink)]"
            style={{
              width: 4,
              height: 4,
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      ))}

      {/* ── Follower ring ────────────────────────────────────────── */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 z-[9997] pointer-events-none"
        style={{
          willChange: 'transform',
        }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-[var(--ink)]/25"
          style={{ transform: 'translate(-50%, -50%)' }}
        />
      </div>

      {/* ── Hover label (link text) ───────────────────────────────── */}
      <div
        ref={labelRef}
        className="fixed top-0 left-0 z-[9997] pointer-events-none"
        style={{
          willChange: 'transform',
          opacity: 0,
        }}
      >
        <div
          className="whitespace-nowrap text-xs font-medium text-[var(--ink)] bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm border border-[var(--ink)]/10"
          style={{ transform: 'translate(-50%, -200%)' }}
        >
          {hoverText}
        </div>
      </div>
    </>
  );
}
