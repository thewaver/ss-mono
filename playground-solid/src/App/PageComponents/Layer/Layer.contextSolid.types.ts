import type { Accessor } from "solid-js";

import type { LayerLevel } from "@thewaver/ss-playground/App/PageComponents/Layer/Layer.context.types";

export type { LayerLevel } from "@thewaver/ss-playground/App/PageComponents/Layer/Layer.context.types";

export type LayerContextType = {
    level: Accessor<LayerLevel>;
};
