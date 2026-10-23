"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  dismissToast,
  forgetToastHandler,
  runToastHandler,
  type Toast,
} from "@/lib/redux/slices/toastSlice";
import { pickTransition, springs } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// "View cart" / "Undo": a link or a button inside the toast, with a 44px tap area.
const actionClass =
  "-my-2 inline-flex min-h-11 shrink-0 items-center rounded-md px-2 font-semibold underline underline-offset-2 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-white";

// Closes the toast after `duration` ms, but can be paused and resumed.
// It remembers how much time was left, so a pause never restarts the full countdown.
function useAutoDismiss(duration: number | null, onDone: () => void) {
  const remaining = useRef(duration);
  const startedAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const resume = useCallback(() => {
    if (remaining.current === null || timer.current !== undefined) return;
    startedAt.current = Date.now();
    timer.current = setTimeout(onDone, remaining.current);
  }, [onDone]);

  const pause = useCallback(() => {
    if (remaining.current === null || timer.current === undefined) return;
    clearTimeout(timer.current);
    timer.current = undefined;
    remaining.current -= Date.now() - startedAt.current;
  }, []);

  useEffect(() => {
    resume();
    return () => {
      clearTimeout(timer.current);
      timer.current = undefined;
    };
  }, [resume]);

  return { pause, resume };
}

function ToastItem({ toast, reduced }: { toast: Toast; reduced: boolean }) {
  const dispatch = useAppDispatch();
  const { id, message, type, action, duration } = toast;

  const close = useCallback(() => {
    forgetToastHandler(id);
    dispatch(dismissToast(id));
  }, [dispatch, id]);
  const { pause, resume } = useAutoDismiss(duration, close);

  // The countdown waits while the mouse is over the toast OR keyboard focus is inside it.
  const holds = useRef({ hover: false, focus: false });
  const hold = (key: "hover" | "focus", value: boolean) => {
    holds.current[key] = value;
    if (holds.current.hover || holds.current.focus) pause();
    else resume();
  };

  // Reduce Motion: fade only (§14). Otherwise rise from the bottom and sink back the same way (§7).
  const away = reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 };
  const here = reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 };

  // A toast that never closes by itself needs a way to be closed.
  const dismissible = duration === null;

  return (
    <motion.div
      layout={reduced ? false : "position"}
      initial={away}
      animate={here}
      exit={away}
      transition={pickTransition(springs.default, reduced)}
      onMouseEnter={() => hold("hover", true)}
      onMouseLeave={() => hold("hover", false)}
      onFocus={() => hold("focus", true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) hold("focus", false);
      }}
      className={`pointer-events-auto mt-2 flex items-center gap-3 rounded-lg px-4 py-3 font-sans text-sm text-white shadow-md ${
        type === "success" ? "bg-primary" : "bg-red-600"
      }`}
    >
      <p className="min-w-0 flex-1">{message}</p>

      {action?.button && (
        <button
          type="button"
          onClick={() => {
            runToastHandler(id);
            close();
          }}
          className={actionClass}
        >
          {action.label}
        </button>
      )}

      {action && !action.button && action.href && (
        <Link href={action.href} onClick={close} className={actionClass}>
          {action.label}
        </Link>
      )}

      {dismissible && (
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={close}
          className="-my-2 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-md hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-white"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </motion.div>
  );
}

export default function ToastContainer() {
  const toasts = useAppSelector((state) => state.toast.toasts);
  const reduced = usePrefersReducedMotion();

  const polite = toasts.filter((toast) => toast.type === "success");
  const urgent = toasts.filter((toast) => toast.type === "error");

  // The two regions below are ALWAYS in the page, even when empty. A screen reader
  // announces text that is added to a region it already knows about; a region that
  // arrives together with its text is usually skipped. aria-atomic="false" means it
  // reads only the new toast, not every toast on screen again.
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-(--z-toast) flex flex-col items-center px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <div
        role="status"
        aria-atomic="false"
        className="relative flex w-full flex-col md:w-auto md:max-w-sm"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {polite.map((toast) => (
            <ToastItem key={toast.id} toast={toast} reduced={reduced} />
          ))}
        </AnimatePresence>
      </div>

      <div
        role="alert"
        aria-atomic="false"
        className="relative flex w-full flex-col md:w-auto md:max-w-sm"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {urgent.map((toast) => (
            <ToastItem key={toast.id} toast={toast} reduced={reduced} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}