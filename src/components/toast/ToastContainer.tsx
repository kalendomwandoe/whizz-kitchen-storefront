"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { dismissToast } from "@/lib/redux/slices/toastSlice";

function ToastItem({ id, message, type }: { id: number; message: string; type: "success" | "error" }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => dispatch(dismissToast(id)), 3000);
    return () => clearTimeout(timer);
  }, [id, dispatch]);

  return (
    <div
      className={`px-4 py-3 rounded-lg shadow-md font-sans text-sm text-white ${
        type === "success" ? "bg-primary" : "bg-red-600"
      }`}
    >
      {message}
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useAppSelector((state) => state.toast.toasts);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-[90%] md:w-auto md:max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  );
}