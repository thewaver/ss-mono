import { type BracketConnectorDefs, BracketConnectorPaths } from "@thewaver/ss-components";

import { markup } from "../../../Utils/markupUtils.js";
import BracketConnectorElement from "./BracketConnectorElement.svelte";
import type { BracketConnectorFn } from "./BracketConnectorsSvelte.types.js";

const strokeOnly =
    (build: (defs: BracketConnectorDefs, radius: number) => string): BracketConnectorFn =>
    (paint) =>
        markup(BracketConnectorElement, { paint, d: build(paint.defs, paint.radius) });

export namespace BracketConnectors {
    export const flat = strokeOnly(BracketConnectorPaths.elbow);

    export const rounded = strokeOnly(BracketConnectorPaths.roundedElbow);

    export const curved = strokeOnly(BracketConnectorPaths.curve);

    export const ballAndArrow: BracketConnectorFn = (paint) => {
        return markup(BracketConnectorElement, {
            paint,
            d: BracketConnectorPaths.roundedElbow(paint.defs, paint.radius),
            tips: {
                ballRadius: BracketConnectorPaths.getBallRadius(paint.width),
                arrowPoints: BracketConnectorPaths.getArrowPoints(paint.defs),
            },
        });
    };

    export const SAMPLE_CONNECTORS = { flat, rounded, curved, ball_and_arrow: ballAndArrow } satisfies Record<
        string,
        BracketConnectorFn
    >;

    export type SampleKey = keyof typeof SAMPLE_CONNECTORS;

    export const SAMPLE_KEYS = Object.keys(SAMPLE_CONNECTORS) as SampleKey[];
}
