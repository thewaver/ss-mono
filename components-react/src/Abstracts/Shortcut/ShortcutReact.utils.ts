import { useEffect, useRef } from "react";

import {
    type DismisserLayerDefs,
    DismisserUtils,
    type Shortcut,
    type ShortcutBinding,
    ShortcutUtils,
} from "@thewaver/ss-components";

import { useLatest } from "../../Utils/refUtils";

/** The React side of `ShortcutUtils`: shortcuts registered for as long as their owner is mounted. */
export namespace ShortcutReactUtils {
    /**
     * Registers a list of shortcuts for as long as the owner is mounted, following the list as it changes.
     *
     * The bindings belong to the layer on top once the owner has first mounted — the page, or the dialog the owner
     * was mounted inside, even one that opened in the same render — and keep that layer for good, so a list that
     * changes while another layer is open stays on the layer it started on. The bindings are replaced whenever the
     * shortcuts in the list change; what each one does is read when it fires, so a new callback on every render
     * costs nothing.
     *
     * @param bindings The shortcuts and what each does. An empty list registers nothing.
     */
    export const useBindings = (bindings: ShortcutBinding[]) => {
        const latest = useLatest(bindings);
        const layerRef = useRef<{ layer: DismisserLayerDefs | undefined }>(undefined);

        const signatures = JSON.stringify(bindings.map((binding) => ShortcutUtils.computeSignature(binding.shortcut)));

        useEffect(() => {
            const removers: (() => void)[] = [];
            let isLive = true;

            const register = () => {
                if (!isLive) return;

                layerRef.current ??= { layer: DismisserUtils.getTopLayer() };

                const layer = layerRef.current.layer;

                latest.current.forEach((binding, index) => {
                    removers.push(
                        ShortcutUtils.addBinding({
                            shortcut: binding.shortcut,
                            onTrigger: (e) => latest.current[index]?.onTrigger(e),
                            layer,
                        }),
                    );
                });
            };

            if (layerRef.current) {
                register();
            } else {
                queueMicrotask(register);
            }

            return () => {
                isLive = false;

                for (const remove of removers) remove();
            };
        }, [signatures, latest]);
    };

    /**
     * Registers one shortcut for as long as the owner is mounted and it is not disabled.
     *
     * {@link useBindings} for a single shortcut, with the same layer rule.
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
