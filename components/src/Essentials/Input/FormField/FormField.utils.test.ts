import { describe, expect, it, vi } from "vitest";

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

describe("resolveAriaLabelledBy", () => {
    it("points at the field's caption", () => {
        expect(FormFieldUtils.resolveAriaLabelledBy(false, undefined, "field-caption")).toBe("field-caption");
    });

    it("points at the caption of a Label around the control rather than the field's", () => {
        expect(FormFieldUtils.resolveAriaLabelledBy(true, "label-caption", "field-caption")).toBe("label-caption");
    });

    it("leaves a Label whose caption registered no id to name the control natively", () => {
        expect(FormFieldUtils.resolveAriaLabelledBy(true, undefined, "field-caption")).toBeUndefined();
    });

    it("points at nothing when neither draws a caption", () => {
        expect(FormFieldUtils.resolveAriaLabelledBy(false, undefined, undefined)).toBeUndefined();
    });
});

describe("warnIfShadowed", () => {
    it("warns only when a captioned control was also given a label of its own", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

        FormFieldUtils.warnIfShadowed(false, true, "ariaLabel");
        FormFieldUtils.warnIfShadowed(true, false, "ariaLabel");
        expect(warn).not.toHaveBeenCalled();

        FormFieldUtils.warnIfShadowed(true, true, "ariaLabel");
        expect(warn).toHaveBeenCalledTimes(1);
        expect(warn.mock.calls[0][0]).toContain("ariaLabel");

        warn.mockRestore();
    });
});
