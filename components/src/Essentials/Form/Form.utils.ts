import type { FormEntry } from "./Form.context.types";

/**
 * What a `Form` and a `FormSection` conclude from the entries reporting to them.
 *
 * Both collect the same thing — one entry per field or nested section, in the order they were first drawn — and
 * both answer the same two questions of it: whether anything is in error, and where focus should go if so.
 */
export namespace FormUtils {
    /**
     * Whether no entry reports an error.
     *
     * The library validates nothing, so this is only the union of what the fields were told by their owner. An
     * empty collection is valid.
     *
     * @param entries The entries reporting, in the order they were first drawn.
     * @returns `true` while none of them reports an error.
     */
    export const computeIsValid = (entries: FormEntry[]) => entries.every((entry) => !entry.getHasError());

    /**
     * The element focus should move to once a form has been submitted.
     *
     * The first entry then reporting an error, in the order the entries were first drawn, so the reader lands on
     * what needs fixing.
     *
     * @param entries The entries reporting, in the order they were first drawn.
     * @returns That entry's control, or `undefined` when nothing is in error or the entry in error has no control
     * that handed it an element — in which case focus stays where it was.
     */
    export const findErrorFocusTarget = (entries: FormEntry[]) =>
        entries.find((entry) => entry.getHasError())?.getFocusTarget?.();

    /**
     * The element a section hands up as its own, for a form moving focus to it.
     *
     * A section is one entry to the form above it, so it has to name one element for all its fields: the first
     * of them in error, and the first of them when none is — which is what the form reaches for when the section
     * is in error on a rule of its own, belonging to no single field.
     *
     * @param entries The section's own entries, in the order they were first drawn.
     * @returns That entry's control, or `undefined` when the section is empty or the entry has no control.
     */
    export const findSectionFocusTarget = (entries: FormEntry[]) =>
        (entries.find((entry) => entry.getHasError()) ?? entries[0])?.getFocusTarget?.();
}
