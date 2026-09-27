import { describe, expect, it } from "vitest";

import { TagInputUtils } from "./TagInput.utils";

const key = (name: string, modifiers: { ctrlKey?: boolean; metaKey?: boolean; altKey?: boolean } = {}) => ({
    key: name,
    ctrlKey: false,
    metaKey: false,
    altKey: false,
    ...modifiers,
});

describe("computeTag", () => {
    it("trims the text when the consumer has no transform", () => {
        expect(TagInputUtils.computeTag("  solid ")).toBe("solid");
        expect(TagInputUtils.computeTag("   ")).toBe("");
    });

    it("hands the text to the consumer's transform untouched", () => {
        expect(TagInputUtils.computeTag(" SOLID ", (text) => text.toLowerCase())).toBe(" solid ");
        expect(TagInputUtils.computeTag("solid", () => undefined)).toBeUndefined();
    });
});

describe("computeFocusAfterRemoval", () => {
    it("moves to the tag before the removed one", () => {
        expect(TagInputUtils.computeFocusAfterRemoval(2, 3)).toBe(1);
    });

    it("moves to the new first tag when the first was removed", () => {
        expect(TagInputUtils.computeFocusAfterRemoval(0, 3)).toBe(0);
    });

    it("returns to the field when no tag is left", () => {
        expect(TagInputUtils.computeFocusAfterRemoval(0, 1)).toBeUndefined();
    });
});

describe("computeFieldKeyAction", () => {
    const empty = { isEmpty: true, tagCount: 2, direction: "ltr" as const };

    it("adds on Enter, whatever is typed", () => {
        expect(TagInputUtils.computeFieldKeyAction("Enter", { ...empty, isEmpty: false })).toEqual({ kind: "add" });
    });

    it("steps onto the last tag from an empty field on Backspace and the arrow pointing back", () => {
        expect(TagInputUtils.computeFieldKeyAction("Backspace", empty)).toEqual({ kind: "focusTag", index: 1 });
        expect(TagInputUtils.computeFieldKeyAction("ArrowLeft", empty)).toEqual({ kind: "focusTag", index: 1 });
    });

    it("mirrors the arrow on a right-to-left page", () => {
        const rtl = { ...empty, direction: "rtl" as const };

        expect(TagInputUtils.computeFieldKeyAction("ArrowRight", rtl)).toEqual({ kind: "focusTag", index: 1 });
        expect(TagInputUtils.computeFieldKeyAction("ArrowLeft", rtl)).toBeUndefined();
    });

    it("leaves the keys to the text while there is text, or no tag to step onto", () => {
        expect(TagInputUtils.computeFieldKeyAction("Backspace", { ...empty, isEmpty: false })).toBeUndefined();
        expect(TagInputUtils.computeFieldKeyAction("Backspace", { ...empty, tagCount: 0 })).toBeUndefined();
        expect(TagInputUtils.computeFieldKeyAction("a", empty)).toBeUndefined();
    });
});

describe("computeTagKeyAction", () => {
    const state = { tagCount: 3, direction: "ltr" as const };

    it("hands a printable key back to the field to be typed there", () => {
        expect(TagInputUtils.computeTagKeyAction(key("z"), 1, state)).toEqual({ kind: "focusField", isTyping: true });
        expect(TagInputUtils.computeTagKeyAction(key("z", { ctrlKey: true }), 1, state)).toBeUndefined();
    });

    it("removes the tag on Backspace and Delete", () => {
        expect(TagInputUtils.computeTagKeyAction(key("Backspace"), 1, state)).toEqual({ kind: "remove", index: 1 });
        expect(TagInputUtils.computeTagKeyAction(key("Delete"), 1, state)).toEqual({ kind: "remove", index: 1 });
    });

    it("walks the tags, stopping at the first and returning to the field past the last", () => {
        expect(TagInputUtils.computeTagKeyAction(key("ArrowLeft"), 1, state)).toEqual({ kind: "focusTag", index: 0 });
        expect(TagInputUtils.computeTagKeyAction(key("ArrowLeft"), 0, state)).toBeUndefined();
        expect(TagInputUtils.computeTagKeyAction(key("ArrowRight"), 1, state)).toEqual({ kind: "focusTag", index: 2 });
        expect(TagInputUtils.computeTagKeyAction(key("ArrowRight"), 2, state)).toEqual({
            kind: "focusField",
            isTyping: false,
        });
    });

    it("mirrors the walk on a right-to-left page", () => {
        const rtl = { ...state, direction: "rtl" as const };

        expect(TagInputUtils.computeTagKeyAction(key("ArrowRight"), 1, rtl)).toEqual({ kind: "focusTag", index: 0 });
        expect(TagInputUtils.computeTagKeyAction(key("ArrowLeft"), 1, rtl)).toEqual({ kind: "focusTag", index: 2 });
    });
});

describe("getIsKeyTaken", () => {
    it("takes every key but one being typed into the field", () => {
        expect(TagInputUtils.getIsKeyTaken({ kind: "add" })).toBe(true);
        expect(TagInputUtils.getIsKeyTaken({ kind: "focusField", isTyping: false })).toBe(true);
        expect(TagInputUtils.getIsKeyTaken({ kind: "focusField", isTyping: true })).toBe(false);
    });
});
