import { createContext, useContext } from "react";

import { ToastUtils, type ToastsContextType } from "@thewaver/ss-components";

import type { Toast } from "./Toasts.types";

const ToastsContext = createContext<ToastsContextType<Toast<unknown>> | undefined>(undefined);

export const ToastsContextProvider = ToastsContext.Provider;

/**
 * Reads the nearest enclosing {@link Toasts} provider, to raise and dismiss toasts on it.
 *
 * Outside any provider it answers with an inert context rather than throwing: `show` queues nothing and answers
 * `undefined`, and `dismiss` answers `false`.
 */
export const useToastsContext = <T = unknown>(): ToastsContextType<Toast<T>> =>
    (useContext(ToastsContext) ?? ToastUtils.UNPROVIDED_CONTEXT) as ToastsContextType<Toast<T>>;
