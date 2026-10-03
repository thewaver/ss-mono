import { defineComponent } from "vue";

import {
    type PatternProximityOpts,
    SVGDefsUtils,
    TrackedPatternDefaults,
    type TrackedPatternElementDefs,
    TrackedPatternUtils,
} from "@thewaver/ss-components";
import { MathUtils } from "@thewaver/ss-utils";

import { declareProps } from "../../../../Utils/propUtils";
import type { TrackedPatternConfig } from "../../SVGDefsVue.types";
import { SVGDefsVueUtils } from "../../SVGDefsVue.utils";
import { SVGPatterns } from "../../SVGPatterns.const";

type PatternElementProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedPatternElementDefs;
    opts?: PatternProximityOpts;
};

const DEFAULTS = TrackedPatternDefaults.GROW_DEFAULTS;

const PatternElement = defineComponent(
    (props: PatternElementProps) => {
        const getPointer = SVGDefsVueUtils.usePatternPointer(
            () => props.element,
            () => props.defs.getSize(),
        );

        return () => {
            const cellSize = props.defs.cellSize;
            const areaSize = props.defs.getSize();
            const pointer = getPointer();
            const r = Math.min(cellSize.width, cellSize.height) * 0.5;

            return SVGPatterns.computeTrackedLayoutPattern(
                "halfDrop",
                `pattern1-${props.id}`,
                cellSize,
                areaSize,
                pointer,
                TrackedPatternUtils.resolveOpts(props.opts, DEFAULTS),
                (cellId, index, isSplit, level) => (
                    <circle
                        id={cellId}
                        r={level * r}
                        cx={cellSize.width * 0.5}
                        cy={cellSize.height * 0.5}
                        fill={
                            SVGDefsUtils.DEBUG_SEAMS && isSplit
                                ? props.defs.colors.tertiary
                                : MathUtils.isEven(index.col + index.row)
                                  ? props.defs.colors.primary
                                  : props.defs.colors.secondary
                        }
                    />
                ),
            );
        };
    },
    {
        name: "PatternElement",
        props: declareProps<PatternElementProps>({ id: null, element: null, defs: null, opts: null }),
    },
);

export const circle_hd_grow_2 = (opts?: PatternProximityOpts): TrackedPatternConfig => ({
    computeSVGDefs: (id, __, element, defs) => [
        {
            gradientOrPattern: {
                id: `pattern1-${id}`,
                renderDefsElement: () => <PatternElement key={id} id={id} element={element} defs={defs} opts={opts} />,
            },
        },
    ],
});
