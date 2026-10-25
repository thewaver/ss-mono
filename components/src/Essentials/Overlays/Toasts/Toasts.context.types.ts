import type { ToastRequest } from "./Toasts.types";

export type ToastsContextType<TToast> = {
    /**
     * Queues a toast on the nearest provider, reading its text direction from the element focused now. Answers the
     * toast's id — the one given, or one made up — or `undefined` when it changed nothing: a toast with the same `id`
     * is already queued, or there is no provider above.
     */
    show(toast: ToastRequest<TToast>): string | undefined;
    /**
     * Takes a toast out of the nearest provider's queue, so it plays its exit. Answers `false` when no toast with that
     * `id` is queued, or when there is no provider above.
     */
    dismiss(id: string): boolean;
};
