import { type MaybeRefOrGetter, toValue } from "vue";

import { type Shortcut, type ShortcutBinding, ShortcutUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";

/** The Vue side of `ShortcutUtils`: shortcuts registered for as long as their component is mounted. */
export namespace ShortcutVueUtils {
    /**
     * Registers a list of shortcuts for as long as the component is mounted, following the list as it changes.
     *
     * The bindings belong to the page: they fire whatever popup or dialog is open, unless a layer that takes input of
     * its own is on top, as every shortcut on the page does. Each change replaces every binding.
     *
     * Must run inside a component's `setup`.
     *
     * @param bindings The shortcuts and what each does. An empty list registers nothing.
     */
    export const useBindings = (bindings: MaybeRefOrGetter<ShortcutBinding[]>) => {
        watchAfterRender([() => toValue(bindings)], ([current]) => {
            const removers = current.map((binding) => ShortcutUtils.addBinding({ ...binding, layer: undefined }));

            return () => {
                for (const remove of removers) remove();
            };
        });
    };

    /**
     * Registers one shortcut for as long as the component is mounted and it is not disabled.
     *
     * {@link useBindings} for a single shortcut, belonging to the page in the same way.
     *
     * Must run inside a component's `setup`.
     *
     * @param shortcut The shortcut, or `undefined` for none.
     * @param isDisabled Whether it is switched off for now.
     * @param onTrigger What it does.
     */
    export const useBinding = (
        shortcut: MaybeRefOrGetter<Shortcut | undefined>,
        isDisabled: MaybeRefOrGetter<boolean>,
        onTrigger: (e: KeyboardEvent) => void,
    ) => {
        useBindings(() => {
            const current = toValue(shortcut);

            return current === undefined || toValue(isDisabled) ? [] : [{ shortcut: current, onTrigger }];
        });
    };
}
