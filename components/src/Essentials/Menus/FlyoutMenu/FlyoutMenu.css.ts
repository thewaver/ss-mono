import { createVar, style } from "@vanilla-extract/css";

import { buttonElement } from "../../Buttons/Button/Button.css";

export const bridgeTopVar = createVar();
export const bridgeRightVar = createVar();
export const bridgeBottomVar = createVar();
export const bridgeLeftVar = createVar();

export const flyoutMenuRoot = style({
    display: "flex",
    width: "100%",
    minWidth: 0,
});

export const flyoutMenuList = style({
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    minWidth: 0,
    margin: 0,
    padding: 0,
    listStyle: "none",
});

export const flyoutMenuEntry = style({
    display: "flex",
    alignItems: "center",
    flex: "none",
});

export const flyoutMenuMeasuredEntry = style({
    position: "absolute",
    top: 0,
    left: 0,
    visibility: "hidden",
    pointerEvents: "none",
});

export const flyoutMenuLink = style({
    display: "flex",
    alignItems: "center",
    color: "inherit !important",
    textDecoration: "none !important",
    pointerEvents: "all",
});

export const flyoutMenuToggle = style([buttonElement, {}]);

export const flyoutMenuPanel = style({
    position: "fixed",
    top: 0,
    left: 0,
    pointerEvents: "all",
    isolation: "isolate",
    outline: "none",

    selectors: {
        "&::before": {
            content: '""',
            position: "absolute",
            zIndex: -1,
            top: bridgeTopVar,
            right: bridgeRightVar,
            bottom: bridgeBottomVar,
            left: bridgeLeftVar,
        },
    },
});

export const flyoutMenuPanelLinks = style({
    width: "max-content",
});

export const flyoutMenuPanelList = style({
    display: "flex",
    flexDirection: "column",
    margin: 0,
    padding: 0,
    listStyle: "none",
});

export const flyoutMenuPanelEntry = style({
    display: "flex",
    flexDirection: "column",
});

export const flyoutMenuPanelRow = style({
    display: "flex",
    alignItems: "center",
});

export const flyoutMenuNestedList = style([flyoutMenuPanelList, {}]);
