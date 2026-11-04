import { globalStyle } from "@vanilla-extract/css";

import type { SkinEntry, SkinRule, SkinRules } from "./Skin.types";

import { skinBoundary, skinEntries, skinLayer, skinSelectors } from "./Skin.css";

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

    export const hollow = (rule: SkinRule): SkinRule =>
        Object.fromEntries(FRAME_PROPERTIES.filter((key) => key in rule).map((key) => [key, rule[key]]));

    export const allOf = (...selectors: string[]) => `&${selectors.map((selector) => `:is(${selector})`).join("")}`;

    export const joinedCorners = (radius: string | number = 0): NonNullable<SkinRule["selectors"]> =>
        Object.fromEntries(
            JOINED_CORNERS.map(([selector, corners]) => [
                selector,
                Object.fromEntries(corners.map((corner) => [corner, radius])),
            ]),
        );

    export const define = (root: string, rules: SkinRules) => {
        (Object.keys(rules) as SkinEntry[]).forEach((entry) => {
            defineRule(root, `.${skinEntries[entry]}`, rules[entry]);
        });
    };
}
