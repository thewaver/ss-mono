import type { Accessor } from "solid-js";
import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { createWheelsControls } from "../Wheels.utils";
import { PageWheelsPanel } from "../WheelsPanel";
import { OverExample } from "./Examples/Over";
import { SidewaysExample } from "./Examples/Sideways";

const EXAMPLES_ROOT = "/src/App/Pages/Wheels/DrumWheelPage/Examples";

export const DrumWheelPage = () => {
    const controls = createWheelsControls();

    const sidewaysIndexSignal = createSignal(0);
    const reelIndexSignal = createSignal(0);

    const [getSidewaysMarkedIndex, setSidewaysMarkedIndex] = createSignal(0);
    const [getReelMarkedIndex, setReelMarkedIndex] = createSignal(0);

    const getReadout = (getMarkedIndex: Accessor<number>, getSettledIndex: Accessor<number>) => () =>
        `under the marker: ${controls.getWedges()[getMarkedIndex()] ?? "nothing"} — settled on: ${controls.getWedges()[getSettledIndex()] ?? "nothing"}`;

    const getExamples = createMemo(() => [
        {
            key: "sideways",
            name: "Turning sideways",
            component: () => (
                <SidewaysExample
                    {...controls.getSharedProps()}
                    targetIndexSignal={sidewaysIndexSignal}
                    onSelectedWedgeChange={setSidewaysMarkedIndex}
                />
            ),
            readout: getReadout(getSidewaysMarkedIndex, sidewaysIndexSignal[0]),
            path: `${EXAMPLES_ROOT}/Sideways.tsx`,
        },
        {
            key: "reel",
            name: "Turning over",
            component: () => (
                <OverExample
                    {...controls.getSharedProps()}
                    targetIndexSignal={reelIndexSignal}
                    onSelectedWedgeChange={setReelMarkedIndex}
                />
            ),
            readout: getReadout(getReelMarkedIndex, reelIndexSignal[0]),
            path: `${EXAMPLES_ROOT}/Over.tsx`,
        },
    ]);

    return (
        <>
            <PageWheelsPanel controls={controls} />

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
