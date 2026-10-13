import type { InteractionFlags, SunburstArcState } from "@thewaver/ss-components";

import type { PAGE_SUNBURST_FAMILIES } from "./SunburstContent.css";

export type PageSunburstFamily = (typeof PAGE_SUNBURST_FAMILIES)[number];

export type BasePageSunburstArcValues = {
    state: SunburstArcState;
    family: PageSunburstFamily;
    name: string;
    title: string;
};

export type BasePageSunburstArcProps = BasePageSunburstArcValues;

export type BasePageSunburstHubValues = {
    flags: InteractionFlags;
    name: string;
    weight: string;
};

export type BasePageSunburstHubProps = BasePageSunburstHubValues;
