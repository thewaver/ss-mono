import { Range, RangeUtils } from "@thewaver/ss-components";

import { PageRangeKnob } from "../../../StyledComponents/RangeKnob/RangeKnob";
import type { RangeExampleProps } from "../RangePage.types";

const MIN = 0;
const MAX = 100;
const START_ANGLE = 135;
const SWEEP_ANGLE = 270;
const KNOB_TRAVEL = { min: MIN, max: MAX, startAngle: START_ANGLE, sweepAngle: SWEEP_ANGLE };

type Props = RangeExampleProps;

export const KnobExample = (props: Props) => (
    <Range
        valueSignal={props.valueSignal}
        min={MIN}
        max={MAX}
        ariaLabel={"Gain"}
        computeValueAtPoint={(point, rect) => RangeUtils.computeAngularValue(point, rect, KNOB_TRAVEL)}
        renderContent={(getRenderProps) => (
            <PageRangeKnob renderProps={getRenderProps} startAngle={START_ANGLE} sweepAngle={SWEEP_ANGLE} />
        )}
    />
);
