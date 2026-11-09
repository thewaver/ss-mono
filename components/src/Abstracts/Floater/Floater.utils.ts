import { ElementObserverUtils } from "../ElementObserver/ElementObserver.utils";
import type { PlacementLayout, PlacementRect } from "../Placement/Placement.types";
import { PlacementUtils } from "../Placement/Placement.utils";
import type { FloaterBounds } from "./Floater.types";

const HALF = 0.5;
const NO_ANGLE = 0;

/** How far an element's box sits from a container's, in layout pixels, walking up the chain of offset parents. */
const measureOffset = (container: HTMLElement, target: HTMLElement) => {
    let top = 0;
    let left = 0;
    let element: HTMLElement | null = target;

    while (element && element !== container) {
        top += element.offsetTop;
        left += element.offsetLeft;

        const parent = element.offsetParent as HTMLElement | null;

        if (parent && parent !== container && container.contains(parent)) {
            top -= parent.scrollTop;
            left -= parent.scrollLeft;
        }

        element = parent;
    }

    return { top, left };
};

const sumPixels = (...lengths: string[]) => lengths.reduce((total, length) => total + Number.parseFloat(length), 0);

/** An element's border box in layout pixels, to the fraction, falling back to whole pixels where it has no used size. */
const measureExactSize = (target: HTMLElement) => {
    const style = getComputedStyle(target);
    const width = Number.parseFloat(style.width);
    const height = Number.parseFloat(style.height);

    if (Number.isNaN(width) || Number.isNaN(height)) return { width: target.offsetWidth, height: target.offsetHeight };
    if (style.boxSizing === "border-box") return { width, height };

    return {
        width: width + sumPixels(style.paddingLeft, style.paddingRight, style.borderLeftWidth, style.borderRightWidth),
        height:
            height + sumPixels(style.paddingTop, style.paddingBottom, style.borderTopWidth, style.borderBottomWidth),
    };
};

/**
 * A marker that slides to whichever item a control is pointing at — the selected tab, the highlighted option — drawn
 * by the consumer behind the items.
 *
 * The control owns where the box goes; the consumer owns what is inside it. In a plain row or column the box is
 * measured from the item's element and measured again whenever the item or the control changes size; in an
 * arrangement a layout placed, it is derived from the item's placement and nothing is measured.
 */
export namespace FloaterUtils {
    /**
     * Where the marker's box goes for an item a layout placed.
     *
     * @param placement The placement the layout gave the item.
     * @returns The box, in shares of the control's width so it scales with it, turned the way the item was.
     */
    export const computePlacedBounds = (placement: PlacementRect): FloaterBounds => ({
        top: PlacementUtils.toContainerWidth(placement.topShare - placement.heightShare * HALF),
        left: PlacementUtils.toContainerWidth(placement.leftShare - placement.widthShare * HALF),
        width: PlacementUtils.toContainerWidth(placement.widthShare),
        height: PlacementUtils.toContainerWidth(placement.heightShare),
        transform: `rotate(${placement.angle ?? NO_ANGLE}deg)`,
    });

    /**
     * Where the marker's box goes, whichever kind of control it is.
     *
     * @param layout The control's layout, if it has one.
     * @param measuredBounds The last measurement, for a control with no layout.
     * @param placement The item's placement, for a control with one.
     * @returns The box, or `undefined` when there is nothing to put it round yet.
     */
    export const resolveBounds = (
        layout: PlacementLayout | undefined,
        measuredBounds: FloaterBounds | undefined,
        placement: PlacementRect | undefined,
    ) => {
        if (layout === undefined) return measuredBounds;
        if (placement === undefined) return undefined;

        return computePlacedBounds(placement);
    };

    /**
     * The box round an item, against the container the marker is drawn in.
     *
     * Measured in layout pixels, so a scaled ancestor does not throw it off, and with any scrolling between the two
     * taken out. The size keeps its fraction, so a marker round an item that fills a scrolling box never overflows it.
     *
     * @param container The element the marker is positioned in. It has to be the item's offset parent or one of its
     * ancestors' — a positioned element round the items.
     * @param target The item's element.
     * @returns The box, as CSS lengths.
     */
    export const measureBounds = (container: HTMLElement, target: HTMLElement): FloaterBounds => {
        const { top, left } = measureOffset(container, target);
        const { width, height } = measureExactSize(target);

        return {
            top: `${top}px`,
            left: `${left}px`,
            width: `${width}px`,
            height: `${height}px`,
        };
    };

    /**
     * Measures the box round an item, and keeps measuring it, until the returned function is called.
     *
     * The box is measured again whenever the item or the container changes size — so a label that grows, or a control
     * that is squeezed, carries the marker with it. The first reading arrives as soon as observing starts.
     *
     * @param container The element the marker is positioned in.
     * @param target The item's element.
     * @param onBounds Called with each reading.
     * @returns The function that stops measuring.
     */
    export const observeBounds = (
        container: HTMLElement,
        target: HTMLElement,
        onBounds: (bounds: FloaterBounds) => void,
    ) => {
        return ElementObserverUtils.observeBorderBoxSizes([container, target], () =>
            onBounds(measureBounds(container, target)),
        );
    };
}
