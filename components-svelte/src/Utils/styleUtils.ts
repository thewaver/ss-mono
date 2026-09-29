import { StringUtils } from "@thewaver/ss-utils";

/**
 * A style as a record, with the values that are left out spelled as nothing at all.
 *
 * Keys may be camelCase, as the core's style helpers and vanilla-extract's `assignInlineVars` give them, or already
 * hyphenated; a custom property keeps its `--` name exactly.
 */
export type StyleRecord = Record<string, string | number | false | null | undefined>;

/**
 * Turns a style record into the text a Svelte `style` attribute takes.
 *
 * Svelte's `style` is a string, where React's is an object, so every style the core hands over as a record passes
 * through here. camelCase keys are hyphenated, a custom property's name is kept as it is, and a value that is
 * `undefined`, `null` or `false` leaves its property out. A number is written as it is, with no unit added, so a
 * length must arrive with its unit.
 *
 * @param styles The records to combine, later ones winning where two set the same property.
 * @returns The declarations, separated by semicolons. Empty when nothing is set.
 */
export const toStyle = (...styles: (StyleRecord | undefined)[]) => {
    const merged: Record<string, string | number> = {};

    for (const style of styles) {
        if (!style) continue;

        for (const [key, value] of Object.entries(style)) {
            const property = key.startsWith("--") ? key : StringUtils.camelToKebabCase(key);

            if (value === undefined || value === null || value === false) {
                delete merged[property];

                continue;
            }

            merged[property] = value;
        }
    }

    return Object.entries(merged)
        .map(([property, value]) => `${property}: ${value}`)
        .join("; ");
};
