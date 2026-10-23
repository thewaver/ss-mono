import { type Accessor, createEffect, onCleanup } from "solid-js";

import {
    type DismisserLayerDefs,
    DismisserUtils,
    type Shortcut,
    type ShortcutBinding,
    ShortcutUtils,
} from "@thewaver/ss-components";

/** The Solid side of {@link ShortcutUtils}: shortcuts registered for as long as their owner is mounted. */
export namespace ShortcutSolidUtils {
    /**
     * Registers a list of shortcuts for as long as the owner is mounted, following the list as it changes.
     *
     * The bindings belong to the layer on top when the owner first runs its effects — the page, or the dialog the
     * owner was mounted inside — and keep that layer for good, so a list that changes while another layer is open
     * stays on the layer it started on. Each change replaces every binding.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param getBindings The shortcuts and what each does. An empty list registers nothing.
     */
    export const createBindings = (getBindings: Accessor<ShortcutBinding[]>) => {
        let layer: DismisserLayerDefs | undefined;
        let hasLayer = false;

        createEffect(() => {
            const bindings = getBindings();

            if (!hasLayer) {
                layer = DismisserUtils.getTopLayer();
                hasLayer = true;
            }

            for (const binding of bindings) onCleanup(ShortcutUtils.addBinding({ ...binding, layer }));
        });
    };

    /**
     * Registers one shortcut for as long as the owner is mounted and it is not disabled.
     *
     * {@link createBindings} for a single shortcut, with the same layer rule.
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
