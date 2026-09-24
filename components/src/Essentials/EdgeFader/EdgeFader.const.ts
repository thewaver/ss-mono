import type { EdgeFaderEdge } from "./EdgeFader.types";

export const EDGE_FADER_DEFAULTS = {
    edges: ["top", "right", "bottom", "left"] as EdgeFaderEdge[],
    size: 40,
    isScrollAware: false,
};
