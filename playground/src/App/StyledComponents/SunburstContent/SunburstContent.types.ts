import type { AccessorProps, InteractionFlags, SunburstArcState } from "@thewaver/ss-components";

import type { PAGE_SUNBURST_FAMILIES } from "./SunburstContent.css";

export type PageSunburstFamily = (typeof PAGE_SUNBURST_FAMILIES)[number];

export type PageSunburstArcProps = AccessorProps<{
    state: SunburstArcState;
    family: PageSunburstFamily;
    name: string;
    title: string;
}>;

export type PageSunburstHubProps = AccessorProps<{
    flags: InteractionFlags;
    name: string;
    weight: string;
}>;
