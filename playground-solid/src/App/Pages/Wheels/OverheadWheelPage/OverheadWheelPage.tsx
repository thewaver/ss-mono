import { createMemo, createSignal } from "solid-js";

import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FLAT_WHEEL_SIZE,
} from "@thewaver/ss-playground/App/Pages/Wheels/OverheadWheelPage/OverheadWheelPage.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import type { WheelExampleProps } from "../Wheels.types";
import { createWheelsControls } from "../Wheels.utils";
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
    const controls = createWheelsControls();

    const targetIndexSignal = createSignal(0);

    const [getMarkedIndex, setMarkedIndex] = createSignal(0);

    const getExamples = createMemo(() => [
        {
            key: "overhead",
            name: EXAMPLE_NAMES.overhead,
            component: () => (
                <OverheadExampleWrapper
                    {...controls.getSharedProps()}
                    targetIndex={targetIndexSignal}
                    onSelectedWedgeChange={setMarkedIndex}
                />
            ),
            readout: () =>
                `under the marker: ${controls.getWedges()[getMarkedIndex()] ?? "nothing"} — heading for: ${controls.getWedges()[targetIndexSignal[0]()] ?? "nothing"}`,
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
