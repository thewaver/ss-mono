import { createContext } from "svelte";

import { ToastUtils, type ToastsContextType } from "@thewaver/ss-components";

import type { Toast } from "./Toasts.types.js";

const [getContext, setContext, hasContext] = createContext<ToastsContextType<Toast<unknown>>>();

export const setToastsContext = (context: ToastsContextType<Toast<unknown>>) => setContext(context);

/**
 * Reads the nearest enclosing `Toasts` provider, to raise and dismiss toasts on it.
 *
 * Outside any provider it answers with an inert context rather than throwing: `show` queues nothing and answers
 * `undefined`, and `dismiss` answers `false`.
 */
export const getToastsContext = <T = unknown>(): ToastsContextType<Toast<T>> =>
    (hasContext() ? getContext() : ToastUtils.UNPROVIDED_CONTEXT) as ToastsContextType<Toast<T>>;
