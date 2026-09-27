import { FocusManagerUtils } from "../../Abstracts/FocusManager/FocusManager.utils";
import type { EdgeFaderEdge, EdgeFaderMaskStyle, EdgeFaderMetrics } from "./EdgeFader.types";

type MaskLayer = {
    image: string;
    size: string;
    position: string;
    composite: string;
};

/** A mask layer that keeps everything it covers, laid over each scrollbar strip. */
const SOLID = "linear-gradient(#000, #000)";

/** The attributes whose change can make something inside the box focusable or stop it being so. */
const FOCUS_ATTRIBUTES = ["tabindex", "disabled", "href", "contenteditable", "inert", "hidden", "aria-hidden"];

const computeAxisGradient = (direction: string, start: number, end: number) =>
    `linear-gradient(${direction}, transparent, #000 ${start}px, #000 calc(100% - ${end}px), transparent)`;

/**
 * The parts of an edge fader that are not about any framework: what it measures, when it counts as scrolling, and
 * the mask it draws.
 */
export namespace EdgeFaderUtils {
    /** The reading of a box that has not been measured yet: nothing left to scroll and no scrollbars. */
    export const NO_METRICS: EdgeFaderMetrics = {
        remaining: { top: 0, right: 0, bottom: 0, left: 0 },
        gutterWidth: 0,
        gutterHeight: 0,
    };

    /**
     * Measures how far a box can still scroll towards each side, and how wide its scrollbars are.
     *
     * The scrollbars are read as the difference between the box's outer and inner sizes, so a box with none reads
     * zero for both, which is what keeps the mask arithmetic unchanged there.
     *
     * @param root The scrolling box.
     * @returns The distance left to scroll past each side, in pixels, and the width of each scrollbar strip.
     */
    export const readMetrics = (root: HTMLElement): EdgeFaderMetrics => ({
        remaining: {
            top: root.scrollTop,
            right: root.scrollWidth - root.clientWidth - root.scrollLeft,
            bottom: root.scrollHeight - root.clientHeight - root.scrollTop,
            left: root.scrollLeft,
        },
        gutterWidth: root.offsetWidth - root.clientWidth,
        gutterHeight: root.offsetHeight - root.clientHeight,
    });

    /**
     * Whether a box has anything to scroll, along either axis.
     *
     * @param metrics The box's reading.
     * @returns `true` when any side has distance left to scroll.
     */
    export const getIsScrollable = (metrics: EdgeFaderMetrics) => {
        const { remaining } = metrics;

        return remaining.left + remaining.right > 0 || remaining.top + remaining.bottom > 0;
    };

    /**
     * The mask that fades a box's chosen sides, as the four CSS properties that carry it.
     *
     * Each axis with a faded side is one gradient layer, and the two axes intersect so that a vertical and a
     * horizontal fade combine rather than cancel. Scroll-aware sides fade by the lesser of `size` and the distance
     * left to scroll that way, so a fade shrinks to nothing as its end arrives. Both scrollbar strips are then added
     * back as solid layers, so the mask never eats a scrollbar. No side chosen means no mask at all.
     *
     * @param params The sides to fade, how far in, whether the fade follows the scroll, and the box's reading.
     * @returns The mask's image, size, position and composite lists, with `maskImage` `"none"` when nothing fades.
     */
    export const computeMaskStyle = (params: {
        edges: EdgeFaderEdge[];
        size: number;
        isScrollAware: boolean;
        metrics: EdgeFaderMetrics;
    }): EdgeFaderMaskStyle => {
        const { edges, size, isScrollAware, metrics } = params;
        const { gutterWidth, gutterHeight } = metrics;
        const contentSize = `calc(100% - ${gutterWidth}px) calc(100% - ${gutterHeight}px)`;
        const fades: MaskLayer[] = [];

        const computeLength = (edge: EdgeFaderEdge) => {
            if (!edges.includes(edge)) return 0;
            if (!isScrollAware) return size;

            return Math.min(size, Math.max(metrics.remaining[edge], 0));
        };

        if (edges.includes("left") || edges.includes("right")) {
            fades.push({
                image: computeAxisGradient("to right", computeLength("left"), computeLength("right")),
                size: contentSize,
                position: "0 0",
                composite: "intersect",
            });
        }

        if (edges.includes("top") || edges.includes("bottom")) {
            fades.push({
                image: computeAxisGradient("to bottom", computeLength("top"), computeLength("bottom")),
                size: contentSize,
                position: "0 0",
                composite: "add",
            });
        }

        const layers: MaskLayer[] =
            fades.length === 0
                ? []
                : [
                      { image: SOLID, size: `${gutterWidth}px 100%`, position: "100% 0", composite: "add" },
                      { image: SOLID, size: `100% ${gutterHeight}px`, position: "0 100%", composite: "add" },
                      ...fades,
                  ];

        const joinLayers = (key: keyof MaskLayer) => layers.map((layer) => layer[key]).join(", ");

        return {
            maskImage: layers.length === 0 ? "none" : joinLayers("image"),
            maskSize: joinLayers("size"),
            maskPosition: joinLayers("position"),
            maskComposite: joinLayers("composite"),
        };
    };

    /**
     * Watches a box for everything that changes its reading or whether anything inside it can take focus.
     *
     * The box and each of its children are watched for size, children arriving later are picked up as they arrive,
     * the box's own scroll is followed, and a change to any attribute that affects focusability anywhere inside it
     * is heard. Both callbacks run once at the start.
     *
     * @param root The scrolling box.
     * @param cbs.onMetrics Receives each new reading.
     * @param cbs.onHasFocusable Receives whether anything inside the box can take focus.
     * @returns A function that stops watching.
     */
    export const observe = (
        root: HTMLElement,
        cbs: { onMetrics: (metrics: EdgeFaderMetrics) => void; onHasFocusable: (hasFocusable: boolean) => void },
    ) => {
        const update = () => cbs.onMetrics(readMetrics(root));
        const updateHasFocusable = () => cbs.onHasFocusable(FocusManagerUtils.getFirstFocusableChild(root) !== null);
        const sizeObserver = new ResizeObserver(update);
        const childObserver = new MutationObserver(() => {
            for (const child of root.children) sizeObserver.observe(child);

            update();
            updateHasFocusable();
        });

        sizeObserver.observe(root);

        for (const child of root.children) sizeObserver.observe(child);

        childObserver.observe(root, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: FOCUS_ATTRIBUTES,
        });
        root.addEventListener("scroll", update, { passive: true });

        update();
        updateHasFocusable();

        return () => {
            sizeObserver.disconnect();
            childObserver.disconnect();
            root.removeEventListener("scroll", update);
        };
    };
}
