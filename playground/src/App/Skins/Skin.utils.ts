import { createVar, globalStyle } from "@vanilla-extract/css";

import type { LayerLevel } from "../PageComponents/Layer/Layer.context.types";
import type { SkinColorFamily, SkinEntry, SkinLevelFamilies, SkinLevelValues, SkinRule, SkinRules } from "./Skin.types";

import { layerLevelVariants } from "../StyledComponents/Layer/Layer.css";
import { BODY_FONT_FAMILY } from "../Theme.css";
import { skinBoundary, skinColorVars, skinEntries, skinLayer, skinSelectors } from "./Skin.css";

const UNSET_VARS = Object.fromEntries(Object.values(skinColorVars).map((skinVar) => [skinVar, "initial"]));

const ROOT_RESET = { fontFamily: BODY_FONT_FAMILY, vars: UNSET_VARS };

const LEVELS: LayerLevel[] = [0, 1, 2];

const pendingLevelVars: [string, SkinLevelValues][] = [];

const pickLevel = (values: SkinLevelValues, level: LayerLevel) =>
    [values.l0, values.l1 ?? values.l0, values.l2 ?? values.l1 ?? values.l0][level];

const computeLevelVars = (levelVars: [string, SkinLevelValues][], level: LayerLevel) =>
    Object.fromEntries(levelVars.map(([levelVar, values]) => [levelVar, pickLevel(values, level)]));

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
    export const PILL_RADIUS = "9999px";

    export const anyOf = (...selectors: string[]) => selectors.join(", ");

    export const allOf = (...selectors: string[]) => `&${selectors.map((selector) => `:is(${selector})`).join("")}`;

    export const joinedCorners = (radius: string | number = 0): NonNullable<SkinRule["selectors"]> =>
        Object.fromEntries(
            JOINED_CORNERS.map(([selector, corners]) => [
                selector,
                Object.fromEntries(corners.map((corner) => [corner, radius])),
            ]),
        );

    export const roundedFillEnds = (thickness: string): SkinRule => {
        const radius = `calc(${thickness} * 0.5)`;
        const pullBack = `calc(${thickness} * -0.5)`;

        return {
            height: thickness,
            paddingInline: radius,
            marginInlineStart: pullBack,
            selectors: {
                [skinSelectors.isStart]: {
                    paddingInlineStart: 0,
                    marginInlineStart: 0,
                },
                [skinSelectors.isVertical]: {
                    width: thickness,
                    height: "auto",
                    paddingInline: 0,
                    marginInlineStart: 0,
                    paddingBlock: radius,
                    marginBottom: pullBack,
                },
                [allOf(skinSelectors.isVertical, skinSelectors.isStart)]: {
                    paddingBottom: 0,
                    marginBottom: 0,
                },
            },
        };
    };

    export const byLevel = (values: SkinLevelValues) => {
        const levelVar = createVar();

        pendingLevelVars.push([levelVar, values]);

        return levelVar;
    };

    export const computeLevelFamily = (families: SkinLevelFamilies): SkinColorFamily => {
        const computeShade = (shade: keyof SkinColorFamily) =>
            byLevel({ l0: families.level0[shade], l1: families.level1[shade], l2: families.level2[shade] });

        return {
            dark: computeShade("dark"),
            main: computeShade("main"),
            light: computeShade("light"),
            contrast: computeShade("contrast"),
        };
    };

    export const define = (root: string, rules: SkinRules) => {
        const levelVars = pendingLevelVars.splice(0);

        globalStyle(`.${root}`, {
            "@layer": {
                [skinLayer]: { ...ROOT_RESET, vars: { ...ROOT_RESET.vars, ...computeLevelVars(levelVars, 0) } },
            },
        });

        LEVELS.forEach((level) => {
            defineRule(root, `.${layerLevelVariants[level]}`, { vars: computeLevelVars(levelVars, level) });
        });

        (Object.keys(rules) as SkinEntry[]).forEach((entry) => {
            defineRule(root, `.${skinEntries[entry]}`, rules[entry]);
        });
    };
}
