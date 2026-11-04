import { styleVariants } from "@vanilla-extract/css";

import { skinEntries } from "../../Skins/Skin.css";

export const blurredOverlayVariants = styleVariants({
    on: [skinEntries.blurredOverlay],
    off: { backdropFilter: "none" },
});

export const opaqueOverlayVariants = styleVariants({
    on: [skinEntries.opaqueOverlay, { opacity: 1 }],
    off: [skinEntries.opaqueOverlay, { opacity: 0 }],
});
