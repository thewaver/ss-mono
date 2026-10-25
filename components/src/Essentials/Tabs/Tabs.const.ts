import type { TabsOrientation } from "./Tabs.types";

export const TABS_DEFAULTS = {
    transitionDurationMs: 200,
    orientation: "horizontal" as TabsOrientation,
    tabGap: 0,
};

export const TABS_ORIENTATIONS: readonly TabsOrientation[] = ["horizontal", "vertical"];
