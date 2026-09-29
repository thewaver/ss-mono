import { type SlotsType, defineComponent, shallowRef } from "vue";

import type { EdgeFaderMetrics } from "@thewaver/ss-components";
import { EDGE_FADER_DEFAULTS, EdgeFaderStyles, EdgeFaderUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";
import { declareProps } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { EdgeFaderProps, EdgeFaderSlots } from "./EdgeFader.types";

const getIsSameMetrics = (a: EdgeFaderMetrics, b: EdgeFaderMetrics) =>
    a.gutterWidth === b.gutterWidth &&
    a.gutterHeight === b.gutterHeight &&
    a.remaining.top === b.remaining.top &&
    a.remaining.right === b.remaining.right &&
    a.remaining.bottom === b.remaining.bottom &&
    a.remaining.left === b.remaining.left;

export const EdgeFader = defineComponent(
    (props: EdgeFaderProps, { slots }: SlotsContext<EdgeFaderSlots>) => {
        const rootRef = shallowRef<HTMLDivElement>();

        const metrics = shallowRef(EdgeFaderUtils.NO_METRICS);
        const hasFocusable = shallowRef(false);

        watchAfterRender([rootRef], ([root]) => {
            if (!root) return undefined;

            return EdgeFaderUtils.observe(root, {
                onMetrics: (next) => {
                    if (!getIsSameMetrics(metrics.value, next)) metrics.value = next;
                },
                onHasFocusable: (value) => {
                    hasFocusable.value = value;
                },
            });
        });

        return () => {
            const isScrollable = EdgeFaderUtils.getIsScrollable(metrics.value);
            const isNamedRegion = isScrollable && props.ariaLabel !== undefined;

            const maskStyle = EdgeFaderUtils.computeMaskStyle({
                edges: props.edges ?? EDGE_FADER_DEFAULTS.edges,
                size: props.size ?? EDGE_FADER_DEFAULTS.size,
                isScrollAware: props.isScrollAware ?? EDGE_FADER_DEFAULTS.isScrollAware,
                metrics: metrics.value,
            });

            return (
                <div
                    ref={rootRef}
                    class={EdgeFaderStyles.edgeFaderRoot}
                    tabindex={isScrollable && !hasFocusable.value ? 0 : undefined}
                    role={isNamedRegion ? "region" : undefined}
                    aria-label={isNamedRegion ? props.ariaLabel : undefined}
                    style={maskStyle}
                >
                    {slots.default?.()}
                </div>
            );
        };
    },
    {
        name: "EdgeFader",
        slots: Object as SlotsType<EdgeFaderSlots>,
        props: declareProps<EdgeFaderProps>({ edges: null, size: null, isScrollAware: Boolean, ariaLabel: null }),
    },
);
