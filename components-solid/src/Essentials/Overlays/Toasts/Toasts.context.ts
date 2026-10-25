import { createContext, useContext } from "solid-js";

import { ToastUtils, type ToastsContextType } from "@thewaver/ss-components";

import type { Toast } from "./ToastsSolid.types";

const ToastsContext = createContext<ToastsContextType<Toast<unknown>>>();

export const ToastsContextProvider = ToastsContext.Provider;

/**
 * Reads the nearest enclosing {@link Toasts} provider, to raise and dismiss toasts on it.
 *
 * Outside any provider it answers with an inert context rather than throwing: `show` queues nothing and answers
 * `undefined`, and `dismiss` answers `false`.
 */
export const useToastsContext = <T = unknown>(): ToastsContextType<Toast<T>> =>
    (useContext(ToastsContext) ?? ToastUtils.UNPROVIDED_CONTEXT) as ToastsContextType<Toast<T>>;
