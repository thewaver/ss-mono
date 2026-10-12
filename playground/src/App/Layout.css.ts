import { createGlobalTheme } from "@vanilla-extract/css";

import { LAYOUT } from "./Layout.const";

const toPx = (value: number) => `${value}px`;

const baseVars = createGlobalTheme(":root", {
    menuExpandedWidth: toPx(LAYOUT.menuExpandedWidth),
    menuPadding: toPx(LAYOUT.menuPadding),
    iconButtonSize: toPx(LAYOUT.iconButtonSize),
    pageMargin: toPx(LAYOUT.pageMargin),
    contentWidth: toPx(LAYOUT.contentWidth),
    readingWidth: toPx(LAYOUT.readingWidth),
    tableOfContentsWidth: toPx(LAYOUT.tableOfContentsWidth),
    tableOfContentsGap: toPx(LAYOUT.tableOfContentsGap),
});

const derivedVars = createGlobalTheme(":root", {
    pageBodyMaxWidth: `calc(${baseVars.contentWidth} + ${baseVars.tableOfContentsGap} + ${baseVars.tableOfContentsWidth})`,
});

export const layoutVars = { ...baseVars, ...derivedVars };
