import { ShortcutUtils } from "../../Abstracts/Shortcut/Shortcut.utils";
import { INTERACTION_SETTINGS_DEFAULTS } from "./InteractionSettings.const";
import type { InteractionSettingsContextType } from "./InteractionSettings.context.types";
import type {
    BaseInteractionSettingsValues,
    InteractionSettingsHotkeys,
    ResolvedInteractionSettings,
} from "./InteractionSettings.types";

const SIGNATURE_SEPARATOR = "|";

/**
 * Settings that nest: a wrapper keeps what it inherits and replaces only what it sets again.
 */
export namespace InteractionSettingsUtils {
    /**
     * What a reader of the settings answers outside any wrapper: every setting at its default.
     */
    export const UNPROVIDED_CONTEXT: InteractionSettingsContextType = {
        getSettings: () => INTERACTION_SETTINGS_DEFAULTS,
    };

    /**
     * The settings under a wrapper: the ones it sets over the ones it inherits.
     *
     * A setting left `undefined` keeps the inherited value. `null` is a value like any other, so it replaces an
     * inherited one. A setting that is itself an object replaces the inherited object whole rather than merging into it.
     *
     * @param parent The settings of the enclosing wrapper, or the defaults when there is none.
     * @param own What this wrapper sets.
     * @returns Every setting, resolved.
     */
    export const merge = (
        parent: ResolvedInteractionSettings,
        own: BaseInteractionSettingsValues,
    ): ResolvedInteractionSettings => ({
        toastHotkeys: own.toastHotkeys === undefined ? parent.toastHotkeys : own.toastHotkeys,
    });

    /**
     * One string per pair of shortcuts, equal for two pairs that the same key presses would fire.
     *
     * Built from {@link ShortcutUtils.computeSignature}, so `"mod"` and letter case are resolved first.
     *
     * @param hotkeys The pair, or `null` for none.
     * @returns The signature, or `undefined` when there are no shortcuts.
     */
    export const computeHotkeysSignature = (hotkeys: InteractionSettingsHotkeys | null) =>
        hotkeys === null
            ? undefined
            : [ShortcutUtils.computeSignature(hotkeys.forward), ShortcutUtils.computeSignature(hotkeys.back)].join(
                  SIGNATURE_SEPARATOR,
              );

    /**
     * Whether two pairs of shortcuts answer to the same key presses.
     *
     * @param a The first pair, or `null` for none.
     * @param b The second pair, or `null` for none.
     * @returns `true` when both are none, or both fire on the same presses.
     */
    export const getAreHotkeysEqual = (a: InteractionSettingsHotkeys | null, b: InteractionSettingsHotkeys | null) =>
        computeHotkeysSignature(a) === computeHotkeysSignature(b);
}
