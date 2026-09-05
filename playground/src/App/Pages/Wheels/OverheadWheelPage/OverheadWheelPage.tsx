import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import type { WheelExampleProps } from "../Wheels.types";
import { createWheelsControls } from "../Wheels.utils";
import { PageWheelsPanel } from "../WheelsPanel";
import { OverheadExample } from "./Examples/Overhead";

const EXAMPLES_ROOT = "/src/App/Pages/Wheels/OverheadWheelPage/Examples";

const FLAT_WHEEL_SIZE = 340;

const OverheadExampleWrapper = (props: WheelExampleProps) => {
    return (
        <PageMeasureBox width={() => FLAT_WHEEL_SIZE}>
            <OverheadExample {...props} />
        </PageMeasureBox>
    );
};

export const OverheadWheelPage = () => {
    const controls = createWheelsControls();

    const indexSignal = createSignal(0);

    const [getMarkedIndex, setMarkedIndex] = createSignal(0);

    const getExamples = createMemo(() => [
        {
            key: "overhead",
            name: "Overhead",
            component: () => (
                <OverheadExampleWrapper
                    {...controls.getSharedProps()}
                    indexSignal={indexSignal}
                    onSelectedWedgeChange={setMarkedIndex}
                />
            ),
            readout: () =>
                `under the marker: ${controls.getWedges()[getMarkedIndex()] ?? "nothing"} — settled on: ${controls.getWedges()[indexSignal[0]()] ?? "nothing"}`,
            path: `${EXAMPLES_ROOT}/Overhead.tsx`,
        },
    ]);

    return (
        <>
            <PageWheelsPanel controls={controls} />

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
