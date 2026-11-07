import { globalStyle } from "@vanilla-extract/css";

import type { SkinEntry, SkinRule, SkinRules } from "./Skin.types";

import { BODY_FONT_FAMILY } from "../Theme.css";
import { skinBoundary, skinEntries, skinLayer, skinSelectors, skinSizeVars } from "./Skin.css";

const UNSET_SIZE_VARS = Object.fromEntries(Object.values(skinSizeVars).map((sizeVar) => [sizeVar, "initial"]));

const ROOT_RESET = { fontFamily: BODY_FONT_FAMILY, vars: UNSET_SIZE_VARS };

const splitSelectorList = (selector: string) => {
    const parts: string[] = [];
    let depth = 0;
    let start = 0;

    [...selector].forEach((char, index) => {
        if (char === "(") {
            depth += 1;
        } else if (char === ")") {
            depth -= 1;
        } else if (char === "," && depth === 0) {
            parts.push(selector.slice(start, index));
            start = index + 1;
        }
    });

    parts.push(selector.slice(start));

    return parts.map((part) => part.trim());
};

const FRAME_PROPERTIES = [
    "border",
    "borderColor",
    "borderStyle",
    "borderWidth",
    "borderRadius",
    "boxShadow",
    "clipPath",
] as const;

const JOINED_CORNERS = [
    [skinSelectors.isJoinedBlockStart, ["borderStartStartRadius", "borderStartEndRadius"]],
    [skinSelectors.isJoinedBlockEnd, ["borderEndStartRadius", "borderEndEndRadius"]],
    [skinSelectors.isJoinedInlineStart, ["borderStartStartRadius", "borderEndStartRadius"]],
    [skinSelectors.isJoinedInlineEnd, ["borderStartEndRadius", "borderEndEndRadius"]],
] as const;

const OVERRIDE_ENTRIES: Partial<Record<SkinEntry, SkinEntry>> = {
    itemWithHoverFloater: "itemBase",
    itemWithSelectionFloater: "itemBase",
};

const computeEntryTarget = (entry: SkinEntry) => {
    const overridden = OVERRIDE_ENTRIES[entry];

    return overridden === undefined ? `.${skinEntries[entry]}` : `.${skinEntries[overridden]}.${skinEntries[entry]}`;
};

const scopeSelector = (target: string, selector: string) =>
    splitSelectorList(selector)
        .map((part) => `:scope ${part.replaceAll("&", target)}`)
        .join(", ");

const computeScopeBounds = (root: string) => `(.${root}) to (.${skinBoundary})`;

const defineRule = (root: string, target: string, rule: SkinRule) => {
    const { selectors, ...base } = rule;
    const bounds = computeScopeBounds(root);

    globalStyle(scopeSelector(target, "&"), { "@layer": { [skinLayer]: { "@scope": { [bounds]: base } } } });

    Object.entries(selectors ?? {}).forEach(([selector, nested]) => {
        globalStyle(scopeSelector(target, selector), {
            "@layer": { [skinLayer]: { "@scope": { [bounds]: nested } } },
        });
    });
};

export namespace SkinUtils {
    export const anyOf = (...selectors: string[]) => selectors.join(", ");

    export const allOf = (...selectors: string[]) => `&${selectors.map((selector) => `:is(${selector})`).join("")}`;

    export const hollow = (rule: SkinRule): SkinRule =>
        Object.fromEntries(FRAME_PROPERTIES.filter((key) => key in rule).map((key) => [key, rule[key]]));

    export const joinedCorners = (radius: string | number = 0): NonNullable<SkinRule["selectors"]> =>
        Object.fromEntries(
            JOINED_CORNERS.map(([selector, corners]) => [
                selector,
                Object.fromEntries(corners.map((corner) => [corner, radius])),
            ]),
        );

    export const define = (root: string, rules: SkinRules) => {
        globalStyle(`.${root}`, { "@layer": { [skinLayer]: ROOT_RESET } });

        (Object.keys(rules) as SkinEntry[]).forEach((entry) => {
            defineRule(root, computeEntryTarget(entry), rules[entry]);
        });
    };
}
