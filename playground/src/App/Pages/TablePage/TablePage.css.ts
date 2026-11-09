import { style } from "@vanilla-extract/css";

import { skinEntries } from "../../Skins/Skin.css";
import { docsAccordion } from "../Accordions/Accordions.css";

export const tableFrame = style([
    skinEntries.panel,
    {
        width: "100%",
        overflow: "auto",
    },
]);

export const tableFrameShort = style([tableFrame, { maxHeight: 260 }]);

export const tableFrameCapped = style([tableFrameShort, docsAccordion]);

export const tableFrameTall = style([tableFrame, { height: 420 }]);
