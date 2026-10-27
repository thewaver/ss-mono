import type { Shortcut } from "../../Abstracts/Shortcut/Shortcut.types";

export type InteractionSettingsHotkeys = {
    /** The shortcut that moves forward, to the next stack holding toasts. */
    forward: Shortcut;
    /** The shortcut that moves back, to the previous stack holding toasts. */
    back: Shortcut;
};

export type BaseInteractionSettingsValues = {
    /**
     * The shortcuts that move focus into the toast stacks from anywhere on the page. A stack under this wrapper answers
     * to this pair, and stacks that answer to the same pair form a group that the pair cycles through, in the order
     * their providers mounted. Left out, the pair of the enclosing wrapper is kept, and with no wrapper above it is F8
     * forward and Shift+F8 back. `null` switches the shortcuts off for the stacks under this wrapper; they are then
     * reached through `ToastUtils.cycleFocus` from a control of the consumer's own, since a keyboard user still needs
     * a way to a toast's controls (WCAG 2.1.1).
     */
    toastHotkeys?: InteractionSettingsHotkeys | null;
};

export type ResolvedInteractionSettings = Required<BaseInteractionSettingsValues>;
