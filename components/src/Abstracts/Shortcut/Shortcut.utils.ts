import { DismisserUtils } from "../Dismisser/Dismisser.utils";
import type {
    ResolvedShortcut,
    Shortcut,
    ShortcutBindingDefs,
    ShortcutKeyEvent,
    ShortcutKeyModifier,
} from "./Shortcut.types";

const MODIFIER_ORDER: ShortcutKeyModifier[] = ["ctrl", "alt", "shift", "meta"];
const APPLE_PLATFORM_PATTERN = /^(Mac|iPhone|iPad|iPod)/;
const PRINTABLE_ASCII_PATTERN = /^[\x20-\x7e]$/;
const LETTER_PATTERN = /^[a-z]$/i;
const DIGIT_PATTERN = /^[0-9]$/;
const LETTER_CODE_PREFIX = "Key";
const DIGIT_CODE_PREFIX = "Digit";
const SIGNATURE_SEPARATOR = "+";
const NON_TEXT_INPUT_TYPES = new Set([
    "button",
    "checkbox",
    "color",
    "file",
    "hidden",
    "image",
    "radio",
    "range",
    "reset",
    "submit",
]);

const computeCharacterKeyWarning = (signature: string) =>
    `Shortcut "${signature}" uses no modifier but Shift. It stays quiet while focus is in a text field, and WCAG 2.1.4 asks that the reader can turn it off or remap it to include a modifier such as Ctrl or Alt.`;

const computeDuplicateWarning = (signature: string) =>
    `Shortcut "${signature}" is registered twice on the same layer. Only the one registered last fires.`;

const bindings: ShortcutBindingDefs[] = [];

const warned = new Set<string>();

const warnOnce = (message: string) => {
    if (warned.has(message)) return;

    warned.add(message);
    console.warn(message);
};

const readIsApplePlatform = () => typeof navigator !== "undefined" && APPLE_PLATFORM_PATTERN.test(navigator.platform);

const resolveShortcut = (shortcut: Shortcut, isApple: boolean): ResolvedShortcut => {
    const requested = new Set(
        (shortcut.modifiers ?? []).map((modifier) => (modifier === "mod" ? (isApple ? "meta" : "ctrl") : modifier)),
    );

    return { key: shortcut.key, modifiers: MODIFIER_ORDER.filter((modifier) => requested.has(modifier)) };
};

const getIsModifierHeld = (e: ShortcutKeyEvent, modifier: ShortcutKeyModifier) => {
    switch (modifier) {
        case "ctrl":
            return e.ctrlKey;
        case "alt":
            return e.altKey;
        case "shift":
            return e.shiftKey;
        case "meta":
            return e.metaKey;
    }
};

const computeKeyCode = (key: string) => {
    if (LETTER_PATTERN.test(key)) return `${LETTER_CODE_PREFIX}${key.toUpperCase()}`;
    if (DIGIT_PATTERN.test(key)) return `${DIGIT_CODE_PREFIX}${key}`;

    return undefined;
};

const getIsKeyMatch = (key: string, e: ShortcutKeyEvent) => {
    if (e.key.toLowerCase() === key.toLowerCase()) return true;
    if (PRINTABLE_ASCII_PATTERN.test(e.key)) return false;

    const code = computeKeyCode(key);

    return code !== undefined && e.code === code;
};

const getIsCaselessCharacter = (key: string) => [...key].length === 1 && key.toLowerCase() === key.toUpperCase();

const computeIsShortcutMatch = (shortcut: Shortcut, e: ShortcutKeyEvent, isApple: boolean) => {
    const resolved = resolveShortcut(shortcut, isApple);

    if (!getIsKeyMatch(resolved.key, e)) return false;

    const isShiftFree = !resolved.modifiers.includes("shift") && getIsCaselessCharacter(resolved.key);

    return MODIFIER_ORDER.every(
        (modifier) =>
            (modifier === "shift" && isShiftFree) ||
            resolved.modifiers.includes(modifier) === getIsModifierHeld(e, modifier),
    );
};

const getIsCharacterKeyShortcut = (shortcut: Shortcut) =>
    [...shortcut.key].length === 1 && (shortcut.modifiers ?? []).every((modifier) => modifier === "shift");

const computeShortcutSignature = (shortcut: Shortcut, isApple: boolean) => {
    const resolved = resolveShortcut(shortcut, isApple);

    return [...resolved.modifiers, resolved.key.toLowerCase()].join(SIGNATURE_SEPARATOR);
};

const getIsEditableElement = (target: EventTarget | null) => {
    if (typeof HTMLElement === "undefined" || !(target instanceof HTMLElement)) return false;
    if (target.isContentEditable) return true;
    if (target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return true;

    return target instanceof HTMLInputElement && !NON_TEXT_INPUT_TYPES.has(target.type);
};

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.defaultPrevented || e.isComposing) return;

    const layer = DismisserUtils.getTopLayer();
    const isApple = readIsApplePlatform();
    const isInEditable = getIsEditableElement(e.composedPath()[0] ?? e.target);

    const binding = bindings.findLast(
        (candidate) =>
            candidate.layer === layer &&
            !(isInEditable && getIsCharacterKeyShortcut(candidate.shortcut)) &&
            computeIsShortcutMatch(candidate.shortcut, e, isApple),
    );

    if (!binding) return;

    e.preventDefault();
    binding.onTrigger(e);
};

/**
 * Keyboard shortcuts for a whole page, held in one register with one document listener.
 *
 * A shortcut is data — a key and the modifiers held with it — rather than a string, so whatever draws it can write
 * it in its own words. Each binding belongs to a layer of {@link DismisserUtils}' stack and fires only while that
 * layer is on top, so a page's shortcuts stay quiet under a dialog, and a dialog's own shortcuts work only inside
 * it. The listener is attached with the first binding and removed with the last.
 */
export namespace ShortcutUtils {
    /**
     * Whether the page runs on an Apple platform, where `"mod"` means Command rather than Control.
     *
     * Read from `navigator.platform`. Outside a browser, the answer is `false`.
     *
     * @returns `true` on macOS, iOS and iPadOS.
     */
    export const getIsApplePlatform = readIsApplePlatform;

    /**
     * A shortcut with `"mod"` turned into the key it means on this platform, and its modifiers in one fixed order.
     *
     * The order is Control, Option or Alt, Shift, Command or Meta, so a painter writing the keys out gets the same
     * text for `["shift", "mod"]` and `["mod", "shift"]`. A modifier asked
     * for twice is kept once. The key is handed back as it was given.
     *
     * @param shortcut The shortcut as it was registered.
     * @param isApple Whether `"mod"` means Command. Left out, it is {@link getIsApplePlatform}.
     * @returns The key and the modifiers to draw.
     */
    export const resolve = (shortcut: Shortcut, isApple: boolean = readIsApplePlatform()) =>
        resolveShortcut(shortcut, isApple);

    /**
     * Whether a key press is a shortcut.
     *
     * The key is compared without regard to letter case. Where the key pressed types no plain ASCII character — Option
     * on a Mac turns `k` into `˚`, and a Cyrillic layout types `л` — a letter or digit is matched by the physical key
     * instead, so the shortcut still fires. The modifiers must be exactly the ones asked for, with one exception: Shift
     * is not compared for a symbol or digit unless the shortcut asks for it, because the layout decides whether typing
     * it needs Shift.
     *
     * @param shortcut The shortcut to test for.
     * @param e The key press.
     * @param isApple Whether `"mod"` means Command. Left out, it is {@link getIsApplePlatform}.
     * @returns `true` when the press is the shortcut.
     */
    export const computeIsMatch = (shortcut: Shortcut, e: ShortcutKeyEvent, isApple: boolean = readIsApplePlatform()) =>
        computeIsShortcutMatch(shortcut, e, isApple);

    /**
     * Whether a shortcut is one WCAG 2.1.4 governs: a single character, with no modifier but Shift.
     *
     * The criterion asks that such a shortcut can be turned off or remapped. The register keeps it quiet while focus
     * is in an editable field and warns when one is registered.
     *
     * @param shortcut The shortcut to test.
     * @returns `true` for a character key shortcut.
     */
    export const getIsCharacterKey = getIsCharacterKeyShortcut;

    /**
     * Whether an element takes typed text: a text field, a text area, a native select or anything editable.
     *
     * A checkbox, a button or a range is not, since typing a letter there does nothing.
     *
     * @param target Where a key press landed.
     * @returns `true` when a character typed there is text rather than a command.
     */
    export const getIsEditableTarget = getIsEditableElement;

    /**
     * One string per shortcut, equal for two shortcuts that the same key press would fire.
     *
     * `"mod"` is resolved first, so on a Mac `["mod"]` and `["meta"]` give the same string, and letter case is
     * dropped.
     *
     * @param shortcut The shortcut.
     * @param isApple Whether `"mod"` means Command. Left out, it is {@link getIsApplePlatform}.
     * @returns The modifiers and the key, joined with `+`, such as `ctrl+shift+k`.
     */
    export const computeSignature = (shortcut: Shortcut, isApple: boolean = readIsApplePlatform()) =>
        computeShortcutSignature(shortcut, isApple);

    /**
     * Registers a shortcut until the returned function is called.
     *
     * It fires only while its layer is {@link DismisserUtils.getTopLayer}'s answer, and never on a key press something
     * else already handled with `preventDefault()` or one still composing text. Once it fires, the key press is
     * prevented, so the browser's own shortcut on the same keys does not run as well. A character key shortcut stays
     * quiet while focus is in an editable field.
     *
     * Warns once in the console, for a character key shortcut, since WCAG 2.1.4 asks that it can be turned off or
     * remapped, and for a shortcut already registered on the same layer, where only the later one fires.
     *
     * @param defs The shortcut, what it does, and the layer it belongs to: {@link DismisserUtils.getTopLayer} read
     * when its owner appeared, or `undefined` for the page itself.
     * @returns The function that removes the binding. Calling it twice is harmless.
     */
    export const addBinding = (defs: ShortcutBindingDefs) => {
        const isApple = readIsApplePlatform();
        const signature = computeShortcutSignature(defs.shortcut, isApple);

        if (getIsCharacterKeyShortcut(defs.shortcut)) warnOnce(computeCharacterKeyWarning(signature));

        if (
            bindings.some(
                (binding) =>
                    binding.layer === defs.layer && computeShortcutSignature(binding.shortcut, isApple) === signature,
            )
        ) {
            warnOnce(computeDuplicateWarning(signature));
        }

        bindings.push(defs);

        if (bindings.length === 1) document.addEventListener("keydown", handleKeyDown);

        return () => {
            const index = bindings.indexOf(defs);

            if (index < 0) return;

            bindings.splice(index, 1);

            if (bindings.length === 0) document.removeEventListener("keydown", handleKeyDown);
        };
    };
}
