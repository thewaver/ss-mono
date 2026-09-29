import { describe, expect, it } from "vitest";

import { FormFieldUtils } from "./FormField.utils";

describe("resolveAriaDescribedBy", () => {
    it("points at the field's description when the caller named nothing", () => {
        expect(FormFieldUtils.resolveAriaDescribedBy(undefined, "field-description")).toBe("field-description");
    });

    it("points at both, the caller's first, when the caller named one too", () => {
        expect(FormFieldUtils.resolveAriaDescribedBy("own-hint", "field-description")).toBe(
            "own-hint field-description",
        );
    });

    it("points at the caller's alone when there is no description", () => {
        expect(FormFieldUtils.resolveAriaDescribedBy("own-hint", undefined)).toBe("own-hint");
    });

    it("points at nothing rather than at an empty string when neither side has anything to say", () => {
        expect(FormFieldUtils.resolveAriaDescribedBy(undefined, undefined)).toBeUndefined();
    });

    it("ignores an empty string, which would otherwise leave a stray space in the attribute", () => {
        expect(FormFieldUtils.resolveAriaDescribedBy("", "field-description")).toBe("field-description");
        expect(FormFieldUtils.resolveAriaDescribedBy("own-hint", "")).toBe("own-hint");
    });
});
