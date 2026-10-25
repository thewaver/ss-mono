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

type BaseSpotlightPopupValues = {
    /**
     * The sentence announced when the spotlight moves, so a reader who cannot see the hole is told what it is on.
     * Focus stays in the popup while its content is replaced, so without it a screen reader user hears nothing of the
     * new step ({@link https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html WCAG 4.1.3}); a shown guide
     * with none warns in the console, once.
     */
    announcement?: string;
    /** Where the popup sits against the lit element. */
    popupPlacement?: AnchorPlacement;
    /** How far the popup is held clear of the lit element. */
    popupOffset?: Point2d;
};

export type BaseSpotlightGuideValues = BaseSpotlightHintValues &
    BaseSpotlightPopupValues & {
        /**
         * Names the guide's popup for assistive technology. Required because the popup is a dialog, and a dialog
         * with no name is announced only by its role
         * ({@link https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html WCAG 4.1.2}).
         */
        ariaLabel: string;
    };

export type BaseSpotlightValues = BaseSpotlightHintValues &
    BaseSpotlightPopupValues & {
        /** Names the popup for assistive technology. Only a guide has a popup, and `SpotlightGuide` requires it. */
        ariaLabel?: string;
        /**
         * Whether the spotlight only lights an element or also blocks everything else, which is the difference between
         * pointing something out and insisting on it.
         */
        mode: SpotlightMode;
    };

export type BaseSpotlightCbs = {
    /**
     * Runs as the spotlight opens, when its fade in begins. Not run again when it comes back after a spotlight opened
     * above it has closed, since it was open all along.
     */
    onShow?: () => void;
    /**
     * Runs as the spotlight closes, when its fade out begins. Not run when a spotlight opened above it takes its
     * place, since it is still open beneath.
     */
    onHide?: () => void;
};

export type BaseSpotlightHintProps = BaseSpotlightHintValues & BaseSpotlightCbs;

export type BaseSpotlightGuideProps = BaseSpotlightGuideValues & BaseSpotlightCbs;

export type BaseSpotlightProps = BaseSpotlightValues & BaseSpotlightCbs;
