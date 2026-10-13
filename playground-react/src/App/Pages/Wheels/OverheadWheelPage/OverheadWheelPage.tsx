import { useState } from "react";

import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FLAT_WHEEL_SIZE,
} from "@thewaver/ss-playground/App/Pages/Wheels/OverheadWheelPage/OverheadWheelPage.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import type { WheelExampleProps } from "../Wheels.types";
import { useWheelsControls } from "../Wheels.utils";
import { PageWheelsPanel } from "../WheelsPanel";
import { OverheadExample } from "./Examples/Overhead";

const OverheadExampleWrapper = (props: WheelExampleProps) => {
    return (
        <PageMeasureBox width={FLAT_WHEEL_SIZE}>
            <OverheadExample {...props} />
        </PageMeasureBox>
    );
};

export const OverheadWheelPage = () => {
    const controls = useWheelsControls();

    const targetIndexState = useState(0);

    const [markedIndex, setMarkedIndex] = useState(0);

    const examples = [
        {
            key: "overhead",
            name: EXAMPLE_NAMES.overhead,
            component: () => (
                <OverheadExampleWrapper
                    {...controls.sharedProps}
                    targetIndex={targetIndexState}
                    onSelectedWedgeChange={setMarkedIndex}
                />
            ),
            readout: () =>
                `under the marker: ${controls.wedges[markedIndex] ?? "nothing"} — heading for: ${controls.wedges[targetIndexState[0]] ?? "nothing"}`,
            path: `${EXAMPLES_ROOT}/Overhead.tsx`,
        },
    ];

    return (
        <>
            <PageWheelsPanel controls={controls} />

            <PageExamples items={examples} layout={"flow"} />
        </>
    );
};
