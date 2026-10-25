import { createRoot } from "solid-js";
import { describe, expect, it, vi } from "vitest";

import { LABEL_CONTEXT } from "@thewaver/ss-components";

import { LabelContextProvider } from "../Label/Label.context";
import { FormFieldContextProvider } from "./FormField.context";
import { FormFieldSolidUtils } from "./FormFieldSolid.utils";

const resolveOutsideField = (getAriaDescribedBy?: () => string) => {
    let resolved!: () => string | undefined;

    const dispose = createRoot((disposeRoot) => {
        resolved = FormFieldSolidUtils.resolveAriaDescribedBy(getAriaDescribedBy);

        return disposeRoot;
    });

    const value = resolved();

    dispose();

    return value;
};

const resolveInsideField = (descriptionId: string | undefined, getAriaDescribedBy?: () => string) => {
    let resolved!: () => string | undefined;

    const dispose = createRoot((disposeRoot) => {
        FormFieldContextProvider({
            value: {
                getDescriptionId: () => descriptionId,
                getCaptionId: () => undefined,
                registerControl: () => undefined,
                unregisterControl: () => undefined,
            },
            get children() {
                resolved = FormFieldSolidUtils.resolveAriaDescribedBy(getAriaDescribedBy);

                return null;
            },
        });

        return disposeRoot;
    });

    const value = resolved();

    dispose();

    return value;
};

describe("resolveAriaDescribedBy", () => {
    it("points at the field's description when the caller named nothing", () => {
        expect(resolveInsideField("field-description")).toBe("field-description");
    });

    it("points at both, the caller's first, when the caller named one too", () => {
        expect(resolveInsideField("field-description", () => "own-hint")).toBe("own-hint field-description");
    });

    it("points at the caller's alone when the field is there but carries no description", () => {
        expect(resolveInsideField(undefined, () => "own-hint")).toBe("own-hint");
    });

    it("points at nothing rather than at an empty string when neither side has anything to say", () => {
        expect(resolveInsideField(undefined)).toBeUndefined();
    });

    it("works outside a field at all, where a control is used on its own", () => {
        expect(resolveOutsideField(() => "own-hint")).toBe("own-hint");
        expect(resolveOutsideField()).toBeUndefined();
    });

    it("ignores an empty string, which would otherwise leave a stray space in the attribute", () => {
        expect(resolveInsideField("field-description", () => "")).toBe("field-description");
    });

    it("reads both sides afresh on every call, so an id that arrives later is picked up", () => {
        let descriptionId: string | undefined;
        let resolved!: () => string | undefined;

        const dispose = createRoot((disposeRoot) => {
            FormFieldContextProvider({
                value: {
                    getDescriptionId: () => descriptionId,
                    getCaptionId: () => undefined,
                    registerControl: () => undefined,
                    unregisterControl: () => undefined,
                },
                get children() {
                    resolved = FormFieldSolidUtils.resolveAriaDescribedBy();

                    return null;
                },
            });

            return disposeRoot;
        });

        expect(resolved()).toBeUndefined();

        descriptionId = "field-description";

        expect(resolved()).toBe("field-description");

        dispose();
    });
});

const resolveNameInsideField = (opts: {
    captionId: string | undefined;
    isLabeled: boolean;
    labelCaptionId?: string;
    ariaLabel?: string;
}) => {
    let resolved!: ReturnType<typeof FormFieldSolidUtils.resolveAriaName>;

    const resolve = () => {
        resolved = FormFieldSolidUtils.resolveAriaName(
            opts.ariaLabel === undefined ? undefined : () => opts.ariaLabel!,
        );

        return null;
    };

    const dispose = createRoot((disposeRoot) => {
        FormFieldContextProvider({
            value: {
                getDescriptionId: () => undefined,
                getCaptionId: () => opts.captionId,
                registerControl: () => undefined,
                unregisterControl: () => undefined,
            },
            get children() {
                if (!opts.isLabeled) return resolve();

                return LabelContextProvider({
                    value: { ...LABEL_CONTEXT, getCaptionId: () => opts.labelCaptionId },
                    get children() {
                        return resolve();
                    },
                });
            },
        });

        return disposeRoot;
    });

    const value = { ariaLabel: resolved.getAriaLabel(), ariaLabelledBy: resolved.getAriaLabelledBy() };

    dispose();

    return value;
};

describe("resolveAriaName", () => {
    it("names the control by the field's caption", () => {
        expect(resolveNameInsideField({ captionId: "field-caption", isLabeled: false })).toEqual({
            ariaLabel: undefined,
            ariaLabelledBy: "field-caption",
        });
    });

    it("drops the control's own label for the caption, and warns once", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

        expect(resolveNameInsideField({ captionId: "field-caption", isLabeled: false, ariaLabel: "Email" })).toEqual({
            ariaLabel: undefined,
            ariaLabelledBy: "field-caption",
        });
        expect(warn).toHaveBeenCalledTimes(1);

        warn.mockRestore();
    });

    it("keeps the control's own label when the field draws no caption", () => {
        expect(resolveNameInsideField({ captionId: undefined, isLabeled: false, ariaLabel: "Email" })).toEqual({
            ariaLabel: "Email",
            ariaLabelledBy: undefined,
        });
    });

    it("names the control by the caption of a Label around it, over the field's", () => {
        expect(
            resolveNameInsideField({ captionId: "field-caption", isLabeled: true, labelCaptionId: "label-caption" }),
        ).toEqual({ ariaLabel: undefined, ariaLabelledBy: "label-caption" });
    });

    it("leaves naming to a Label around the control whose caption registered no id", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

        expect(resolveNameInsideField({ captionId: "field-caption", isLabeled: true })).toEqual({
            ariaLabel: undefined,
            ariaLabelledBy: undefined,
        });
        expect(warn).not.toHaveBeenCalled();

        warn.mockRestore();
    });
});
