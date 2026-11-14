"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { BOOT_DONE, BOOT_PLAYING, BOOT_STORAGE_KEY } from "@/lib/intro";

const EXIT_ANIMATION = "boot-exit";
const EXIT_FALLBACK_MS = 6000;
const MODIFIER_KEYS = new Set(["Shift", "Control", "Alt", "Meta"]);
const SCROLL_KEYS = new Set([" ", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"]);

const WORDS = [
  { text: "FDA", face: "logo-aero-fda" },
  { text: "AWARDS", face: "logo-aero-awards" },
  { text: "2026", face: "logo-aero-fda" },
];

const listeners = new Set<() => void>();
let ended = false;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function isPlaying() {
  if (ended) return false;
  try {
    return sessionStorage.getItem(BOOT_STORAGE_KEY) === BOOT_PLAYING;
  } catch {
    return false;
  }
}

function endBoot() {
  if (ended) return;
  ended = true;
  try {
    sessionStorage.setItem(BOOT_STORAGE_KEY, BOOT_DONE);
  } catch {}
  listeners.forEach((listener) => listener());
}

function lockScroll() {
  const root = document.documentElement;
  const { overflow, scrollbarGutter } = root.style;
  if (root.scrollHeight > root.clientHeight) root.style.scrollbarGutter = "stable";
  root.style.overflow = "hidden";
  return () => {
    root.style.overflow = overflow;
    root.style.scrollbarGutter = scrollbarGutter;
  };
}

export default function Boot() {
  const playing = useSyncExternalStore(subscribe, isPlaying, () => true);
  return playing ? <BootScreen /> : null;
}

function BootScreen() {
  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;

    const exit = screen
      .getAnimations?.()
      .find((animation) => (animation as CSSAnimation).animationName === EXIT_ANIMATION);
    if (exit?.playState === "finished") {
      endBoot();
      return;
    }

    const unlockScroll = lockScroll();
    const fallback = exit ? undefined : window.setTimeout(endBoot, EXIT_FALLBACK_MS);
    exit?.finished.then(endBoot, endBoot);

    const skipOnKey = (event: KeyboardEvent) => {
      if (MODIFIER_KEYS.has(event.key) || event.ctrlKey || event.metaKey || event.altKey) return;
      if (SCROLL_KEYS.has(event.key)) event.preventDefault();
      endBoot();
    };
    window.addEventListener("keydown", skipOnKey);
    window.addEventListener("wheel", endBoot, { passive: true });

    return () => {
      unlockScroll();
      window.clearTimeout(fallback);
      window.removeEventListener("keydown", skipOnKey);
      window.removeEventListener("wheel", endBoot);
    };
  }, []);

  return (
    <div ref={screenRef} className="boot" aria-hidden="true" onClick={endBoot}>
      <div className="boot__content">
        <div className="boot__logo">
          <Wordmark />
          <span className="boot__shine">
            <Wordmark />
          </span>
        </div>
        <span className="boot__progress" />
      </div>
      <button type="button" tabIndex={-1} className="boot__skip">
        Pular
      </button>
    </div>
  );
}

function Wordmark() {
  return (
    <span className="boot__wordmark logo-aero font-display">
      {WORDS.map(({ text, face }) => (
        <span key={text} className={`logo-aero-word ${face}`} data-l={text}>
          <span className="logo-aero-face">{text}</span>
        </span>
      ))}
    </span>
  );
}
