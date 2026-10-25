import { type InjectionKey, inject, provide } from "vue";

import { ToastUtils, type ToastsContextType } from "@thewaver/ss-components";

import type { Toast } from "./Toasts.types";

const TOASTS_CONTEXT_KEY: InjectionKey<ToastsContextType<Toast<unknown>>> = Symbol("ToastsContext");

export const provideToastsContext = (context: ToastsContextType<Toast<unknown>>) =>
    provide(TOASTS_CONTEXT_KEY, context);

/**
 * Reads the nearest enclosing `Toasts` provider, to raise and dismiss toasts on it.
 *
 * Outside any provider it answers with an inert context rather than throwing: `show` queues nothing and answers
 * `undefined`, and `dismiss` answers `false`.
 */
export const useToastsContext = <T = unknown>(): ToastsContextType<Toast<T>> =>
    (inject(TOASTS_CONTEXT_KEY, undefined) ?? ToastUtils.UNPROVIDED_CONTEXT) as ToastsContextType<Toast<T>>;
