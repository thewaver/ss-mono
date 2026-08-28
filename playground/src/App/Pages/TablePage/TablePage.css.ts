import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const tableFrame = style({
    width: "100%",
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: themeVars.color.surface.dark,
    overflow: "auto",
});

export const tableFrameShort = style([tableFrame, { maxHeight: 260 }]);

export const tableFrameTall = style([tableFrame, { height: 420 }]);
