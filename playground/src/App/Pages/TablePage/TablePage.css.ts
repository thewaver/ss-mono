import { style } from "@vanilla-extract/css";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { docsAccordion } from "../Accordions/Accordions.css";

export const tableFrame = style({
    width: "100%",
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: layerVars.main,
    overflow: "auto",
});

export const tableFrameShort = style([tableFrame, { maxHeight: 260 }]);

export const tableFrameCapped = style([tableFrameShort, docsAccordion]);

export const tableFrameTall = style([tableFrame, { height: 420 }]);
