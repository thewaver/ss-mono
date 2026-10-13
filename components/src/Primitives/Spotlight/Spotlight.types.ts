import type { Point2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../Abstracts/Anchor/Anchor.types";

export type SpotlightMode = "hint" | "prompt" | "guide";

export type BaseSpotlightHintValues = {
    /** How much room is left around the element being lit, so the hole is not cut tight against it. */
    padding?: number;
    /** How long the spotlight takes to fade in and out, and to move from one element to the next. */
    transitionDurationMs?: number;
    /** The element being lit. Changing it moves the spotlight rather than restarting it. */
    elementRef: HTMLElement | undefined;
};

export type BaseSpotlightGuideValues = BaseSpotlightHintValues & {
    /** Names the spotlight for assistive technology. */
    ariaLabel?: string;
    /** The sentence announced when the spotlight moves, so a reader who cannot see the hole is told what it is on. */
    announcement?: string;
    /** Where the popup sits against the lit element. */
    popupPlacement?: AnchorPlacement;
    /** How far the popup is held clear of the lit element. */
    popupOffset?: Point2d;
};

export type BaseSpotlightValues = BaseSpotlightGuideValues & {
    /**
     * Whether the spotlight only lights an element or also blocks everything else, which is the difference between
     * pointing something out and insisting on it.
     */
    mode: SpotlightMode;
};

export type BaseSpotlightCbs = {
    /** Runs once the spotlight is showing and has finished arriving. */
    onShow?: () => void;
    /** Runs once the spotlight is hidden and has finished leaving. */
    onHide?: () => void;
};

export type BaseSpotlightHintProps = BaseSpotlightHintValues & BaseSpotlightCbs;

export type BaseSpotlightGuideProps = BaseSpotlightGuideValues & BaseSpotlightCbs;

export type BaseSpotlightProps = BaseSpotlightValues & BaseSpotlightCbs;
