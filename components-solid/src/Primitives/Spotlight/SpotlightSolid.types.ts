import type { JSX } from "solid-js";

import type {
    AnchorPlacement,
    BaseSpotlightCbs,
    BaseSpotlightGuideValues,
    BaseSpotlightHintValues,
    BaseSpotlightValues,
} from "@thewaver/ss-components";

import type { AccessorValues, SignalSource } from "../../Utils/typeUtils";

export type SpotlightRenderer = (
    getVisibilityTarget: () => 0 | 1,
    getTransitionDurationMs: () => number,
) => JSX.Element;

export type SpotlightOverlayRenderer = (
    getVisibilityTarget: () => 0 | 1,
    getTransitionDurationMs: () => number,
    getMaskStyle: () => JSX.CSSProperties,
) => JSX.Element;

export type SpotlightState = {
    /** Whether the spotlight is showing. It is the only thing that shows or hides it. */
    visibility: SignalSource<boolean>;
};

export type SpotlightSlots = {
    /** Draws the lit area itself. */
    renderHighlight?: SpotlightRenderer;
    /** Draws the cover over everything that is not lit. */
    renderOverlay: SpotlightOverlayRenderer;
};

export type SpotlightPopupSlot = {
    /** Draws the popup shown beside the lit element. The fade is handed in rather than applied. */
    renderPopup: (
        getVisibilityTarget: () => 0 | 1,
        getTransitionDurationMs: () => number,
        getPlacement: () => AnchorPlacement,
    ) => JSX.Element;
};

export type SpotlightProps = SpotlightState &
    SpotlightSlots &
    Partial<SpotlightPopupSlot> &
    AccessorValues<BaseSpotlightValues> &
    BaseSpotlightCbs;

export type SpotlightHintProps = SpotlightState &
    SpotlightSlots &
    AccessorValues<BaseSpotlightHintValues> &
    BaseSpotlightCbs;

export type SpotlightPromptProps = SpotlightState &
    SpotlightSlots &
    AccessorValues<BaseSpotlightHintValues> &
    BaseSpotlightCbs;

export type SpotlightGuideProps = SpotlightState &
    SpotlightSlots &
    SpotlightPopupSlot &
    AccessorValues<BaseSpotlightGuideValues> &
    BaseSpotlightCbs;
