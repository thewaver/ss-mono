import { useState } from "react";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import type { WheelExampleProps } from "../Wheels.types";
import { useWheelsControls } from "../Wheels.utils";
import { PageWheelsPanel } from "../WheelsPanel";
import { OverheadExample } from "./Examples/Overhead";

const EXAMPLES_ROOT = "/src/App/Pages/Wheels/OverheadWheelPage/Examples";

const FLAT_WHEEL_SIZE = 340;

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
            name: "Overhead",
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
