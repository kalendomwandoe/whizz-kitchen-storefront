"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { closeAccountModal } from "@/lib/redux/slices/uiSlice";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import AccountOverview from "@/components/account/AccountOverview";
import AccountOrdersList from "@/components/account/AccountOrdersList";
import AccountOrderDetail from "@/components/account/AccountOrderDetail";
import AccountDetails from "@/components/account/AccountDetails";

type Tab = "overview" | "orders" | "details";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "orders", label: "Orders" },
  { id: "details", label: "Details" },
];

function AccountModalPanel() {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<Tab>("overview");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const close = () => dispatch(closeAccountModal());
  useEscapeKey(true, close);

  const switchTab = (next: Tab) => {
    setTab(next);
    setSelectedOrderId(null);
  };

  return (
    <>
      {/* Invisible click-catcher: closes the modal on an outside click, with no dimming */}
      <div className="fixed inset-0 z-40" onClick={close} />

      <div
        role="dialog"
        aria-label="Your account"
        className="fixed top-20 right-4 z-50 flex max-h-[80vh] w-[92vw] max-w-md flex-col rounded-xl border border-primary/10 bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-primary/10 px-4 py-3">
          <h2 className="font-display font-bold text-lg text-primary-dark">My account</h2>
          <button onClick={close} aria-label="Close account" className="text-primary-dark">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b border-primary/10 px-4 py-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => switchTab(t.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 font-sans text-sm font-medium ${
                tab === t.id ? "bg-primary text-cream" : "bg-cream text-primary-dark"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {tab === "overview" && <AccountOverview />}

          {tab === "orders" &&
            (selectedOrderId ? (
              <AccountOrderDetail orderId={selectedOrderId} onBack={() => setSelectedOrderId(null)} />
            ) : (
              <AccountOrdersList onSelect={setSelectedOrderId} onNavigate={close} />
            ))}

          {tab === "details" && <AccountDetails />}
        </div>
      </div>
    </>
  );
}

export default function AccountModal() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isOpen = useAppSelector((state) => state.ui.accountModalOpen);
  const customer = useAppSelector((state) => state.auth.customer);

  // Any navigation closes the modal
  useEffect(() => {
    dispatch(closeAccountModal());
  }, [pathname, dispatch]);

  if (!isOpen || !customer) return null;
  return <AccountModalPanel />;
}