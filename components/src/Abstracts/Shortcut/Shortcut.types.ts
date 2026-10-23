import type { DismisserLayerDefs } from "../Dismisser/Dismisser.types";

export type ShortcutModifier = "mod" | "ctrl" | "alt" | "shift" | "meta";

export type ShortcutKeyModifier = Exclude<ShortcutModifier, "mod">;

export type Shortcut = {
    /**
     * The key, as `KeyboardEvent.key` names it: `"k"`, `"F8"`, `"ArrowUp"`, `"?"`. Letter case is ignored, so `"k"`
     * and `"K"` are the same shortcut, and Shift is asked for in `modifiers`. A symbol is named by what it types, so a
     * question mark is `"?"` whichever key and modifiers a layout needs to type it.
     */
    key: string;
    /**
     * The keys held down with it, all of them and no others. `"mod"` is Command on Apple platforms and Control
     * everywhere else, which is what a shortcut meant for every platform asks for.
     */
    modifiers?: ShortcutModifier[];
};

export type ResolvedShortcut = {
    key: string;
    modifiers: ShortcutKeyModifier[];
};

export type ShortcutKeyEvent = Pick<KeyboardEvent, "key" | "code" | "ctrlKey" | "altKey" | "shiftKey" | "metaKey">;

export type ShortcutBinding = {
    shortcut: Shortcut;
    onTrigger: (e: KeyboardEvent) => void;
};

export type ShortcutBindingDefs = ShortcutBinding & {
    layer: DismisserLayerDefs | undefined;
};
