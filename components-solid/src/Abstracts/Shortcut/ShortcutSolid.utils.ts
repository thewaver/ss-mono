import { type Accessor, createEffect, onCleanup } from "solid-js";

import { type Shortcut, type ShortcutBinding, ShortcutUtils } from "@thewaver/ss-components";

/** The Solid side of {@link ShortcutUtils}: shortcuts registered for as long as their owner is mounted. */
export namespace ShortcutSolidUtils {
    /**
     * Registers a list of shortcuts for as long as the owner is mounted, following the list as it changes.
     *
     * The bindings belong to the page: they fire whatever popup or dialog is open, unless a layer that takes input of
     * its own is on top, as every shortcut on the page does. Each change replaces every binding.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param getBindings The shortcuts and what each does. An empty list registers nothing.
     */
    export const createBindings = (getBindings: Accessor<ShortcutBinding[]>) => {
        createEffect(() => {
            for (const binding of getBindings()) onCleanup(ShortcutUtils.addBinding({ ...binding, layer: undefined }));
        });
    };

    /**
     * Registers one shortcut for as long as the owner is mounted and it is not disabled.
     *
     * {@link createBindings} for a single shortcut, belonging to the page in the same way.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param getShortcut The shortcut, or `undefined` for none.
     * @param getIsDisabled Whether it is switched off for now.
     * @param onTrigger What it does.
     */
    export const createBinding = (
        getShortcut: Accessor<Shortcut | undefined>,
        getIsDisabled: Accessor<boolean>,
        onTrigger: (e: KeyboardEvent) => void,
    ) => {
        createBindings(() => {
            const shortcut = getShortcut();
            const isDisabled = getIsDisabled();

            return shortcut === undefined || isDisabled ? [] : [{ shortcut, onTrigger }];
        });
    };
}
