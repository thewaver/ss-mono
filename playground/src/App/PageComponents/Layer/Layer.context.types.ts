import type { Accessor } from "solid-js";

export type LayerLevel = 0 | 1 | 2;

export type LayerContextType = {
    level: Accessor<LayerLevel>;
};
