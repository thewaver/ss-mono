import { useEffect } from "react";

import { type Shortcut, type ShortcutBinding, ShortcutUtils } from "@thewaver/ss-components";

import { useLatest } from "../../Utils/refUtils";

/** The React side of `ShortcutUtils`: shortcuts registered for as long as their owner is mounted. */
export namespace ShortcutReactUtils {
    /**
     * Registers a list of shortcuts for as long as the owner is mounted, following the list as it changes.
     *
     * The bindings belong to the page: they fire whatever popup or dialog is open, unless a layer that takes input of
     * its own is on top, as every shortcut on the page does. The bindings are replaced whenever the
     * shortcuts in the list change; what each one does is read when it fires, so a new callback on every render
     * costs nothing.
     *
     * @param bindings The shortcuts and what each does. An empty list registers nothing.
     */
    export const useBindings = (bindings: ShortcutBinding[]) => {
        const latest = useLatest(bindings);

        const signatures = JSON.stringify(bindings.map((binding) => ShortcutUtils.computeSignature(binding.shortcut)));

        useEffect(() => {
            const removers = latest.current.map((binding, index) =>
                ShortcutUtils.addBinding({
                    shortcut: binding.shortcut,
                    onTrigger: (e) => latest.current[index]?.onTrigger(e),
                    layer: undefined,
                }),
            );

            return () => {
                for (const remove of removers) remove();
            };
        }, [signatures, latest]);
    };

    /**
     * Registers one shortcut for as long as the owner is mounted and it is not disabled.
     *
     * {@link useBindings} for a single shortcut, belonging to the page in the same way.
     *
     * @param shortcut The shortcut, or `undefined` for none.
     * @param isDisabled Whether it is switched off for now.
     * @param onTrigger What it does. Read when the shortcut fires.
     */
    export const useBinding = (
        shortcut: Shortcut | undefined,
        isDisabled: boolean,
        onTrigger: (e: KeyboardEvent) => void,
    ) => {
        useBindings(shortcut === undefined || isDisabled ? [] : [{ shortcut, onTrigger }]);
    };
}
