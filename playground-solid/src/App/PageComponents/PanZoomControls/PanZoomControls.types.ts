import type { Accessor } from "solid-js";

import type { PanZoomController } from "@thewaver/ss-components-solid";

export type PagePanZoomControlsProps = {
    idPrefix: string;
    controller: Accessor<PanZoomController | undefined>;
};
