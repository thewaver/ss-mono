const BASE_LAYOUT = {
    menuExpandedWidth: 320,
    menuPadding: 20,
    iconButtonSize: 32,
    pageMargin: 40,
    contentWidth: 960,
    readingWidth: 720,
    tableOfContentsWidth: 200,
    tableOfContentsGap: 40,
};

const PAGE_BODY_MAX_WIDTH =
    BASE_LAYOUT.contentWidth + BASE_LAYOUT.tableOfContentsGap + BASE_LAYOUT.tableOfContentsWidth;

const PAGE_MAX_WIDTH = BASE_LAYOUT.menuExpandedWidth + 2 * BASE_LAYOUT.pageMargin + PAGE_BODY_MAX_WIDTH;

export const LAYOUT = {
    ...BASE_LAYOUT,
    menuCollapsedWidth: 2 * BASE_LAYOUT.menuPadding + BASE_LAYOUT.iconButtonSize,
    menuHideableBelow: PAGE_MAX_WIDTH - BASE_LAYOUT.menuExpandedWidth,
    pageBodyMaxWidth: PAGE_BODY_MAX_WIDTH,
    pageMaxWidth: PAGE_MAX_WIDTH,
    tableOfContentsMinLayoutWidth:
        BASE_LAYOUT.readingWidth + BASE_LAYOUT.tableOfContentsGap + BASE_LAYOUT.tableOfContentsWidth,
};
