import type { JSX } from "solid-js";

import type { AnchorPlacement } from "../../Abstracts/Anchor/Anchor.types";
import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

export type SpotlightMode = "hint" | "prompt" | "guide";

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
    visibilitySignal: SignalSource<boolean>;
    padding?: number;
    transitionDurationMs?: number;
    elementRef: HTMLElement | undefined;
};

export type SpotlightCbs = {
    onShow?: () => void;
    onHide?: () => void;
};

export type SpotlightSlots = {
    renderHighlight?: SpotlightRenderer;
    renderOverlay: SpotlightOverlayRenderer;
};

export type SpotlightPopupState = {
    ariaLabel?: string;
    announcement?: string;
    popupPlacement?: AnchorPlacement;
    popupOffset?: { x: number; y: number };
};

export type SpotlightPopupSlot = {
    renderPopup: (
        getVisibilityTarget: () => 0 | 1,
        getTransitionDurationMs: () => number,
        getPlacement: () => AnchorPlacement,
    ) => JSX.Element;
};

export type SpotlightProps = AccessorProps<
    SpotlightState &
        SpotlightCbs &
        SpotlightSlots &
        SpotlightPopupState & { mode: SpotlightMode } & Partial<SpotlightPopupSlot>
>;

export type SpotlightHintProps = AccessorProps<SpotlightState & SpotlightCbs & SpotlightSlots>;

export type SpotlightPromptProps = AccessorProps<SpotlightState & SpotlightCbs & SpotlightSlots>;

export type SpotlightGuideProps = AccessorProps<
    SpotlightState & SpotlightCbs & SpotlightSlots & SpotlightPopupState & SpotlightPopupSlot
>;
