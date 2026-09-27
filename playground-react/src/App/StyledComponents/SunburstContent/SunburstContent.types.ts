import type { InteractionFlags, SunburstArcState } from "@thewaver/ss-components-react";
import type { PAGE_SUNBURST_FAMILIES } from "@thewaver/ss-playground-core/App/StyledComponents/SunburstContent/SunburstContent.css";

export type PageSunburstFamily = (typeof PAGE_SUNBURST_FAMILIES)[number];

export type PageSunburstArcProps = {
    state: SunburstArcState;
    family: PageSunburstFamily;
    name: string;
    title: string;
};

export type PageSunburstHubProps = {
    flags: InteractionFlags;
    name: string;
    weight: string;
};
