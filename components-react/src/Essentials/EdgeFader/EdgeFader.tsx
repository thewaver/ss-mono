import { useLayoutEffect, useRef, useState } from "react";

import type { EdgeFaderMetrics } from "@thewaver/ss-components";
import { EDGE_FADER_DEFAULTS, EdgeFaderStyles, EdgeFaderUtils } from "@thewaver/ss-components";

import { useElement } from "../../Utils/refUtils";
import type { EdgeFaderProps } from "./EdgeFader.types";

const getIsSameMetrics = (a: EdgeFaderMetrics, b: EdgeFaderMetrics) =>
    a.gutterWidth === b.gutterWidth &&
    a.gutterHeight === b.gutterHeight &&
    a.remaining.top === b.remaining.top &&
    a.remaining.right === b.remaining.right &&
    a.remaining.bottom === b.remaining.bottom &&
    a.remaining.left === b.remaining.left;

export const EdgeFader = (props: EdgeFaderProps) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const root = useElement(rootRef);

    const [metrics, setMetrics] = useState(EdgeFaderUtils.NO_METRICS);
    const [hasFocusable, setHasFocusable] = useState(false);

    useLayoutEffect(() => {
        if (!root) return undefined;

        return EdgeFaderUtils.observe(root, {
            onMetrics: (next) => setMetrics((prev) => (getIsSameMetrics(prev, next) ? prev : next)),
            onHasFocusable: setHasFocusable,
        });
    }, [root]);

    const isScrollable = EdgeFaderUtils.getIsScrollable(metrics);
    const isNamedRegion = isScrollable && props.ariaLabel !== undefined;

    const maskStyle = EdgeFaderUtils.computeMaskStyle({
        edges: props.edges ?? EDGE_FADER_DEFAULTS.edges,
        size: props.size ?? EDGE_FADER_DEFAULTS.size,
        isScrollAware: props.isScrollAware ?? EDGE_FADER_DEFAULTS.isScrollAware,
        metrics,
    });

    return (
        <div
            ref={rootRef}
            className={EdgeFaderStyles.edgeFaderRoot}
            tabIndex={isScrollable && !hasFocusable ? 0 : undefined}
            role={isNamedRegion ? "region" : undefined}
            aria-label={isNamedRegion ? props.ariaLabel : undefined}
            style={maskStyle}
        >
            {props.children}
        </div>
    );
};
