import { styleVariants } from "@vanilla-extract/css";

import { skinEntries } from "../../Skins/Skin.css";

export const blurredOverlayVariants = styleVariants({
    on: [skinEntries.overlay],
    off: { backdropFilter: "none" },
});

export const opaqueOverlayVariants = styleVariants({
    on: { backgroundColor: "black", opacity: 1 },
    off: { backgroundColor: "black", opacity: 0 },
});
