import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";

import { FocusManagerUtils } from "../../Abstracts/FocusManager/FocusManager.utils";
import { access } from "../../Utils/propUtils";
import { EDGE_FADER_DEFAULTS } from "./EdgeFader.const";
import type { EdgeFaderEdge, EdgeFaderProps } from "./EdgeFader.types";

import * as styles from "./EdgeFader.css";

type EdgeLengths = Record<EdgeFaderEdge, number>;

type MaskLayer = {
    image: string;
    size: string;
    position: string;
    composite: string;
};

const NO_METRICS = {
    remaining: { top: 0, right: 0, bottom: 0, left: 0 } as EdgeLengths,
    gutterWidth: 0,
    gutterHeight: 0,
};

const SOLID = "linear-gradient(#000, #000)";

const FOCUS_ATTRIBUTES = ["tabindex", "disabled", "href", "contenteditable", "inert", "hidden", "aria-hidden"];

const readMetrics = (root: HTMLElement) => ({
    remaining: {
        top: root.scrollTop,
        right: root.scrollWidth - root.clientWidth - root.scrollLeft,
        bottom: root.scrollHeight - root.clientHeight - root.scrollTop,
        left: root.scrollLeft,
    },
    gutterWidth: root.offsetWidth - root.clientWidth,
    gutterHeight: root.offsetHeight - root.clientHeight,
});

const computeAxisGradient = (direction: string, start: number, end: number) =>
    `linear-gradient(${direction}, transparent, #000 ${start}px, #000 calc(100% - ${end}px), transparent)`;

export const EdgeFader = (props: EdgeFaderProps) => {
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getMetrics, setMetrics] = createSignal(NO_METRICS);
    const [getHasFocusable, setHasFocusable] = createSignal(false);

    const getEdges = createMemo(() => access(props.edges) ?? EDGE_FADER_DEFAULTS.edges);

    const getSize = createMemo(() => access(props.size) ?? EDGE_FADER_DEFAULTS.size);

    const getIsScrollAware = createMemo(() => access(props.isScrollAware) ?? EDGE_FADER_DEFAULTS.isScrollAware);

    createEffect(() => {
        const root = getRootRef();

        if (!root) return;

        const update = () => setMetrics(readMetrics(root));
        const updateHasFocusable = () => setHasFocusable(FocusManagerUtils.getFirstFocusableChild(root) !== null);
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

        onCleanup(() => {
            sizeObserver.disconnect();
            childObserver.disconnect();
            root.removeEventListener("scroll", update);
        });

        update();
        updateHasFocusable();
    });

    const getIsScrollable = createMemo(() => {
        const { remaining } = getMetrics();

        return remaining.left + remaining.right > 0 || remaining.top + remaining.bottom > 0;
    });

    const getIsNamedRegion = () => getIsScrollable() && access(props.ariaLabel) !== undefined;

    const computeLength = (edge: EdgeFaderEdge) => {
        if (!getEdges().includes(edge)) return 0;
        if (!getIsScrollAware()) return getSize();

        return Math.min(getSize(), Math.max(getMetrics().remaining[edge], 0));
    };

    const getMaskLayers = createMemo((): MaskLayer[] => {
        const edges = getEdges();
        const { gutterWidth, gutterHeight } = getMetrics();
        const contentSize = `calc(100% - ${gutterWidth}px) calc(100% - ${gutterHeight}px)`;
        const fades: MaskLayer[] = [];

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

        if (fades.length === 0) return [];

        const gutters: MaskLayer[] = [
            { image: SOLID, size: `${gutterWidth}px 100%`, position: "100% 0", composite: "add" },
            { image: SOLID, size: `100% ${gutterHeight}px`, position: "0 100%", composite: "add" },
        ];

        return [...gutters, ...fades];
    });

    const joinLayers = (key: keyof MaskLayer) =>
        getMaskLayers()
            .map((layer) => layer[key])
            .join(", ");

    return (
        <div
            ref={setRootRef}
            class={styles.edgeFaderRoot}
            tabIndex={getIsScrollable() && !getHasFocusable() ? 0 : undefined}
            role={getIsNamedRegion() ? "region" : undefined}
            aria-label={getIsNamedRegion() ? access(props.ariaLabel) : undefined}
            style={{
                "mask-image": getMaskLayers().length === 0 ? "none" : joinLayers("image"),
                "mask-size": joinLayers("size"),
                "mask-position": joinLayers("position"),
                "mask-composite": joinLayers("composite"),
            }}
        >
            {props.children}
        </div>
    );
};
