import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";

export type ToastType = "success" | "error";

/** What you pass in: a link (href), or a button that runs a function (onClick). */
export interface ToastActionInput {
  label: string;
  href?: string;
  onClick?: () => void;
}

/** What is kept in the store. Functions are not allowed there, so only a flag is kept. */
export interface ToastAction {
  label: string;
  href?: string;
  /** true = the toast shows a button whose function is kept in `handlers` below */
  button?: boolean;
}

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  action?: ToastAction;
  /** Milliseconds before the toast closes by itself. null = stays until dismissed. */
  duration: number | null;
}

interface ShowToastInput {
  message: string;
  type: ToastType;
  action?: ToastActionInput;
  /** Optional override. Pass null to keep a toast on screen until it is dismissed. */
  duration?: number | null;
}

interface ToastState {
  toasts: Toast[];
}

const initialState: ToastState = {
  toasts: [],
};

// The Redux store may only hold plain values, never functions. So the function behind a
// toast button ("View cart", "Undo") waits here, matched to its toast by id.
const handlers = new Map<string, () => void>();
export const runToastHandler = (id: string) => handlers.get(id)?.();
export const forgetToastHandler = (id: string) => handlers.delete(id);

// Defaults: errors stay until dismissed, a toast with an action gets longer to read,
// a plain success toast closes after 4 seconds.
const defaultDuration = (type: ToastType, hasAction: boolean) =>
  type === "error" ? null : hasAction ? 7000 : 4000;

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: {
      // "prepare" runs before the reducer. The id is made here, because a reducer
      // must always give the same result for the same input.
      prepare: ({ message, type, action, duration }: ShowToastInput) => {
        const id = nanoid();
        if (action?.onClick) handlers.set(id, action.onClick);
        return {
          payload: {
            id,
            message,
            type,
            action: action
              ? { label: action.label, href: action.href, button: Boolean(action.onClick) }
              : undefined,
            duration: duration !== undefined ? duration : defaultDuration(type, Boolean(action)),
          } satisfies Toast,
        };
      },
      reducer: (state, action: PayloadAction<Toast>) => {
        state.toasts.push(action.payload);
      },
    },
    dismissToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { showToast, dismissToast } = toastSlice.actions;
export default toastSlice.reducer;