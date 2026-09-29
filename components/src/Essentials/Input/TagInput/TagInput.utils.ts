import type { NavigatorDirection } from "../../../Abstracts/Navigator/Navigator.types";
import { NavigatorUtils } from "../../../Abstracts/Navigator/Navigator.utils";
import type { TagInputKeyAction } from "./TagInput.types";

/** The keys that remove the tag holding focus. */
const REMOVE_KEYS = ["Backspace", "Delete"];

/** The key that turns the typed text into a tag. */
const ADD_KEY = "Enter";

/** The key that, in an empty field, steps back onto the last tag. */
const STEP_BACK_KEY = "Backspace";

/**
 * What a tag field does with the keys pressed in it, and where focus goes as tags come and go.
 *
 * The field is a text input with the tags in front of it, each a button of its own. Focus walks between them by
 * the arrows, reading which way is back from the direction the text runs, so a right-to-left page walks mirrored.
 */
export namespace TagInputUtils {
    /**
     * The tag typed text becomes, if it becomes one.
     *
     * @param text What is typed.
     * @param computeTag The consumer's own transform, which may refuse the text by answering nothing. Left out, the
     * text is trimmed.
     * @returns The tag, or `undefined` — or an empty string — when there is nothing to add.
     */
    export const computeTag = (text: string, computeTag?: (text: string) => string | undefined) =>
        computeTag ? computeTag(text) : text.trim();

    /**
     * Where focus goes once a tag has been removed, so it never drops to the page.
     *
     * The tag before the removed one takes it; with none before it, the tag that now stands first; with no tags
     * left, the field.
     *
     * @param index Where the removed tag stood.
     * @param tagCount How many tags there were before it was removed.
     * @returns The index of the tag to focus, counted in the list after the removal, or `undefined` for the field.
     */
    export const computeFocusAfterRemoval = (index: number, tagCount: number) => {
        if (index > 0) return index - 1;
        if (tagCount > 1) return 0;

        return undefined;
    };

    /**
     * What a key pressed in the text field does.
     *
     * Enter adds what is typed as a tag. In an empty field, Backspace and the arrow pointing back step onto the last
     * tag rather than deleting it outright, so a reader has something focused to hear before anything is lost; with
     * text in the field both are left to the text. Every other key is the text's.
     *
     * @param key The key, as `KeyboardEvent.key` spells it.
     * @param state Whether the field is empty, how many tags there are, and which way the text runs.
     * @returns The action, or `undefined` when the key is the text's and its default must not be prevented.
     * Whether an action's key has its default prevented is {@link getIsKeyTaken}'s to say.
     */
    export const computeFieldKeyAction = (
        key: string,
        state: { isEmpty: boolean; tagCount: number; direction: NavigatorDirection },
    ): TagInputKeyAction | undefined => {
        if (key === ADD_KEY) return { kind: "add" };

        if (!state.isEmpty || state.tagCount < 1) return undefined;

        if (key === STEP_BACK_KEY || NavigatorUtils.computeLogicalKey(key, state.direction) === "ArrowLeft") {
            return { kind: "focusTag", index: state.tagCount - 1 };
        }

        return undefined;
    };

    /**
     * What a key pressed on a tag does.
     *
     * A printable key hands focus back to the field and is left to land there, since typing is the only thing a
     * letter pressed on a tag could mean. Backspace and Delete remove the tag. The arrows walk the tags, the one
     * pointing forward returning to the field from the last tag; the one pointing back stops at the first. Every
     * other key does nothing here.
     *
     * @param e The key and its modifiers, as the keyboard event carries them.
     * @param index Which tag has focus.
     * @param state How many tags there are, and which way the text runs.
     * @returns The action, or `undefined` for a key the tag leaves alone. Whether its key's default is prevented is
     * {@link getIsKeyTaken}'s to say.
     */
    export const computeTagKeyAction = (
        e: Pick<KeyboardEvent, "key" | "ctrlKey" | "metaKey" | "altKey">,
        index: number,
        state: { tagCount: number; direction: NavigatorDirection },
    ): TagInputKeyAction | undefined => {
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) return { kind: "focusField", isTyping: true };

        if (REMOVE_KEYS.includes(e.key)) return { kind: "remove", index };

        const logicalKey = NavigatorUtils.computeLogicalKey(e.key, state.direction);

        if (logicalKey === "ArrowLeft" && index > 0) return { kind: "focusTag", index: index - 1 };

        if (logicalKey === "ArrowRight") {
            return index < state.tagCount - 1
                ? { kind: "focusTag", index: index + 1 }
                : { kind: "focusField", isTyping: false };
        }

        return undefined;
    };

    /**
     * Whether an action takes its key, so the key's default must be prevented.
     *
     * Every action does except a printable key handed back to the field, which has to reach the field to be typed.
     *
     * @param action What {@link computeFieldKeyAction} or {@link computeTagKeyAction} answered.
     */
    export const getIsKeyTaken = (action: TagInputKeyAction) => action.kind !== "focusField" || !action.isTyping;
}
