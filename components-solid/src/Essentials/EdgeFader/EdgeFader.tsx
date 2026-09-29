import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";

import { EDGE_FADER_DEFAULTS, EdgeFaderUtils, EdgeFaderStyles as styles } from "@thewaver/ss-components";

import { access } from "../../Utils/propUtils";
import type { EdgeFaderProps } from "./EdgeFaderSolid.types";

export const EdgeFader = (props: EdgeFaderProps) => {
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getMetrics, setMetrics] = createSignal(EdgeFaderUtils.NO_METRICS);
    const [getHasFocusable, setHasFocusable] = createSignal(false);

    const getEdges = createMemo(() => access(props.edges) ?? EDGE_FADER_DEFAULTS.edges);

    const getSize = createMemo(() => access(props.size) ?? EDGE_FADER_DEFAULTS.size);

    const getIsScrollAware = createMemo(() => access(props.isScrollAware) ?? EDGE_FADER_DEFAULTS.isScrollAware);

    createEffect(() => {
        const root = getRootRef();

        if (!root) return;

        onCleanup(EdgeFaderUtils.observe(root, { onMetrics: setMetrics, onHasFocusable: setHasFocusable }));
    });

    const getIsScrollable = createMemo(() => EdgeFaderUtils.getIsScrollable(getMetrics()));

    const getIsNamedRegion = () => getIsScrollable() && access(props.ariaLabel) !== undefined;

    const getMaskStyle = createMemo(() =>
        EdgeFaderUtils.computeMaskStyle({
            edges: getEdges(),
            size: getSize(),
            isScrollAware: getIsScrollAware(),
            metrics: getMetrics(),
        }),
    );

    return (
        <div
            ref={setRootRef}
            class={styles.edgeFaderRoot}
            tabIndex={getIsScrollable() && !getHasFocusable() ? 0 : undefined}
            role={getIsNamedRegion() ? "region" : undefined}
            aria-label={getIsNamedRegion() ? access(props.ariaLabel) : undefined}
            style={{
                "mask-image": getMaskStyle().maskImage,
                "mask-size": getMaskStyle().maskSize,
                "mask-position": getMaskStyle().maskPosition,
                "mask-composite": getMaskStyle().maskComposite,
            }}
        >
            {props.children}
        </div>
    );
};
