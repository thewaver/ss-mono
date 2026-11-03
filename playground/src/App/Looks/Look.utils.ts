import { globalStyle } from "@vanilla-extract/css";

import type { LookEntry, LookRule, LookRules } from "./Look.types";

import { lookBoundary, lookEntries, lookLayer } from "./Look.css";

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

const scopeSelector = (target: string, selector: string) =>
    splitSelectorList(selector)
        .map((part) => `:scope ${part.replaceAll("&", target)}`)
        .join(", ");

const computeScopeBounds = (root: string) => `(.${root}) to (.${lookBoundary})`;

const defineRule = (root: string, target: string, rule: LookRule) => {
    const { selectors, ...base } = rule;
    const bounds = computeScopeBounds(root);

    globalStyle(scopeSelector(target, "&"), { "@layer": { [lookLayer]: { "@scope": { [bounds]: base } } } });

    Object.entries(selectors ?? {}).forEach(([selector, nested]) => {
        globalStyle(scopeSelector(target, selector), {
            "@layer": { [lookLayer]: { "@scope": { [bounds]: nested } } },
        });
    });
};

export namespace LookUtils {
    export const anyOf = (...selectors: string[]) => selectors.join(", ");

    export const hollow = (rule: LookRule): LookRule =>
        Object.fromEntries(FRAME_PROPERTIES.filter((key) => key in rule).map((key) => [key, rule[key]]));

    export const allOf = (...selectors: string[]) => `&${selectors.map((selector) => `:is(${selector})`).join("")}`;

    export const define = (root: string, rules: LookRules) => {
        (Object.keys(rules) as LookEntry[]).forEach((entry) => {
            defineRule(root, `.${lookEntries[entry]}`, rules[entry]);
        });
    };
}
