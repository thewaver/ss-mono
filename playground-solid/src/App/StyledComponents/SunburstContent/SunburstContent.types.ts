import type { AccessorProps, InteractionFlags, SunburstArcState } from "@thewaver/ss-components-solid";
import type { PAGE_SUNBURST_FAMILIES } from "@thewaver/ss-playground/App/StyledComponents/SunburstContent/SunburstContent.css";

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
