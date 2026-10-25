import { createSignal } from "solid-js";

import { Range, RangeUtils } from "@thewaver/ss-components-solid";

import { PageRangeKnob } from "../../../StyledComponents/RangeKnob/RangeKnob";

const MIN = 0;
const MAX = 100;
const START_ANGLE = 135;
const SWEEP_ANGLE = 270;
const KNOB_TRAVEL = { min: MIN, max: MAX, startAngle: START_ANGLE, sweepAngle: SWEEP_ANGLE };

export const KnobDocsExample = () => {
    const valueSignal = createSignal(30);

    return (
        <Range
            value={valueSignal}
            id={"gain"}
            min={MIN}
            max={MAX}
            ariaLabel={"Gain"}
            computeValueAtPoint={(point, rect) => RangeUtils.computeAngularValue(point, rect, KNOB_TRAVEL)}
            renderContent={(getRenderProps) => (
                <PageRangeKnob renderProps={getRenderProps} startAngle={START_ANGLE} sweepAngle={SWEEP_ANGLE} />
            )}
        />
    );
};
