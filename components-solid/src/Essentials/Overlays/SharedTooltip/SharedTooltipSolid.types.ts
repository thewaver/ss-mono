import type { JSX } from "solid-js";

import type { TooltipProps } from "../Tooltip/TooltipSolid.types";

export type SharedTooltipProps = {
    /**
     * The controls that share the tooltip. Every control inside that was given a tooltip of its own hands it
     * over instead of drawing it, so one tooltip follows the pointer and the keyboard from control to control,
     * gliding between them rather than hiding and reappearing. A control without one is a gap: the tooltip
     * closes over it and reopens on the next control that has one, without waiting again.
     */
    children: JSX.Element;
};

export type SharedTooltipClaim = {
    anchorRef: HTMLElement;
    getTooltipProps: () => Omit<TooltipProps, "anchorRef"> | undefined;
};

export type SharedTooltipContextType = {
    claim: (claim: SharedTooltipClaim) => void;
    release: (anchorRef: HTMLElement) => void;
};
