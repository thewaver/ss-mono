import { createRoot } from "solid-js";
import { describe, expect, it } from "vitest";

import { FormFieldContextProvider } from "./FormField.context";
import { FormFieldUtils } from "./FormField.utils";

const resolveOutsideField = (getAriaDescribedBy?: () => string) => {
    let resolved!: () => string | undefined;

    const dispose = createRoot((disposeRoot) => {
        resolved = FormFieldUtils.resolveAriaDescribedBy(getAriaDescribedBy);

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
            value: { getDescriptionId: () => descriptionId },
            get children() {
                resolved = FormFieldUtils.resolveAriaDescribedBy(getAriaDescribedBy);

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
                value: { getDescriptionId: () => descriptionId },
                get children() {
                    resolved = FormFieldUtils.resolveAriaDescribedBy();

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
