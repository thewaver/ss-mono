import type { TooltipProps } from "../Tooltip/Tooltip.types";

export type SharedTooltipClaim = {
    anchorRef: HTMLElement;
    tooltipProps: Omit<TooltipProps, "anchorRef"> | undefined;
};

export type SharedTooltipReactContextType = {
    claim: (claim: SharedTooltipClaim) => void;
    update: (claim: SharedTooltipClaim) => void;
    release: (anchorRef: HTMLElement) => void;
};
