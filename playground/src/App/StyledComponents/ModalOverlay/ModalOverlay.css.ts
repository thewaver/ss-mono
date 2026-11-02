import { styleVariants } from "@vanilla-extract/css";

import { lookEntries } from "../../Looks/Look.css";

export const blurredOverlayVariants = styleVariants({
    on: [lookEntries.blurredOverlay],
    off: { backdropFilter: "none" },
});

export const opaqueOverlayVariants = styleVariants({
    on: [lookEntries.opaqueOverlay, { opacity: 1 }],
    off: [lookEntries.opaqueOverlay, { opacity: 0 }],
});
