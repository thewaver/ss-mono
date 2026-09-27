import type { Point2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../Abstracts/Anchor/Anchor.types";

export type SpotlightMode = "hint" | "prompt" | "guide";

export type SpotlightCbs = {
    /** Runs once the spotlight is showing and has finished arriving. */
    onShow?: () => void;
    /** Runs once the spotlight is hidden and has finished leaving. */
    onHide?: () => void;
};

export type SpotlightPopupState = {
    /** Names the spotlight for assistive technology. */
    ariaLabel?: string;
    /** The sentence announced when the spotlight moves, so a reader who cannot see the hole is told what it is on. */
    announcement?: string;
    /** Where the popup sits against the lit element. */
    popupPlacement?: AnchorPlacement;
    /** How far the popup is held clear of the lit element. */
    popupOffset?: Point2d;
};
