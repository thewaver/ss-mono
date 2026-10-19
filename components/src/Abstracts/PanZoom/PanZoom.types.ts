import type { Point2d, Size2d } from "@thewaver/ss-utils";

export type PanZoomSpan = {
    /** Where the stretch begins, in the content's own units. */
    start: number;
    /** Where it ends, in the same units. */
    end: number;
};

export type PanZoomView = {
    /** The stretch across, in the content's own units. */
    x: PanZoomSpan;
    /** The stretch down, in the same units. */
    y: PanZoomSpan;
};

export type PanZoomAxes = {
    x: boolean;
    y: boolean;
};

export type PanZoomBounds = {
    range: PanZoomView;
    aspect: number;
    minWidth: number;
    canCenterEdges?: boolean;
};

export type PanZoomGestureDefs = {
    getAxes: () => PanZoomAxes;
    getIsPannable: () => boolean;
    getIsZoomable: () => boolean;
    getSize: () => Size2d;
    computePointerRatio: (client: Point2d) => Point2d;
    zoomBy: (factor: number, focusRatio: Point2d) => void;
    panBy: (ratio: Point2d) => void;
    onSettle?: () => void;
};

export type PanZoomGestureTracker = {
    press: (e: PointerEvent) => void;
    move: (e: PointerEvent, element: HTMLElement) => void;
    release: (e: PointerEvent, element: HTMLElement) => void;
    wheel: (e: WheelEvent) => void;
};

export type PanZoomController = {
    /** The part of the content in the window right now, once it has been fitted to the window. */
    getView: () => PanZoomView;
    /**
     * Zooms the view in or out about a point, gliding there.
     *
     * @param factor How much to scale what is visible by; below `1` zooms in.
     * @param focusRatio Where in the window to keep fixed, as a ratio across and down it. The middle by default.
     * @returns `false` when the view was already at the limit and clamping left it unmoved.
     */
    zoomBy: (factor: number, focusRatio?: Point2d) => boolean;
    /**
     * Slides the view without changing how much it shows, gliding there.
     *
     * @param ratio How far to travel across and down, each as a fraction of what is visible that way.
     * @returns `false` when the view was already against the edge of the content.
     */
    panBy: (ratio: Point2d) => boolean;
    /**
     * Moves the view as little as needed to bring an area into it, without zooming, gliding there.
     *
     * @param area The area that must end up visible, in the content's own units.
     * @returns `false` when it was already fully in view.
     */
    showArea: (area: PanZoomView) => boolean;
};
