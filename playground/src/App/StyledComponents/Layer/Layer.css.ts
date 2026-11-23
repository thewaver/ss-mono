import { style } from "@vanilla-extract/css";

import type { LayerLevel } from "../../PageComponents/Layer/Layer.context.types";

export const layerLevelVariants: Record<LayerLevel, string> = {
    0: style({}),
    1: style({}),
    2: style({}),
};

export const layerScope = style({
    display: "contents",
});
