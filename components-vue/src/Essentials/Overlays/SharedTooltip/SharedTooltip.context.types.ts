import type { TooltipProps, TooltipSlots } from "../Tooltip/Tooltip.types";

export type SharedTooltipDefs = Omit<TooltipProps, "anchorRef"> & TooltipSlots;

export type SharedTooltipClaim = {
    anchorRef: HTMLElement;
    getTooltipDefs: () => SharedTooltipDefs | undefined;
};

export type SharedTooltipContextType = {
    claim: (claim: SharedTooltipClaim) => void;
    release: (anchorRef: HTMLElement) => void;
};
