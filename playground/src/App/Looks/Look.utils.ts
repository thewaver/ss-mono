import { globalStyle } from "@vanilla-extract/css";

import type { LookEntry, LookRule, LookRules } from "./Look.types";

import { lookEntries, lookLayer } from "./Look.css";

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

const scopeSelector = (root: string, target: string, selector: string) =>
    splitSelectorList(selector)
        .map((part) => `.${root} ${part.replaceAll("&", target)}`)
        .join(", ");

const defineRule = (root: string, target: string, rule: LookRule) => {
    const { selectors, ...base } = rule;

    globalStyle(scopeSelector(root, target, "&"), { "@layer": { [lookLayer]: base } });

    Object.entries(selectors ?? {}).forEach(([selector, nested]) => {
        globalStyle(scopeSelector(root, target, selector), { "@layer": { [lookLayer]: nested } });
    });
};

export namespace LookUtils {
    export const anyOf = (...selectors: string[]) => selectors.join(", ");

    export const define = (root: string, rules: LookRules) => {
        (Object.keys(rules) as LookEntry[]).forEach((entry) => {
            defineRule(root, `.${lookEntries[entry]}`, rules[entry]);
        });
    };
}
