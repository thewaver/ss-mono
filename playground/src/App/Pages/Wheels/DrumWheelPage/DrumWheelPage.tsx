import type { Accessor } from "solid-js";
import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { createWheelsControls } from "../Wheels.utils";
import { PageWheelsPanel } from "../WheelsPanel";
import { OverExample } from "./Examples/Over";
import { ReelsExample } from "./Examples/Reels";
import { SidewaysExample } from "./Examples/Sideways";

const EXAMPLES_ROOT = "/src/App/Pages/Wheels/DrumWheelPage/Examples";

export const DrumWheelPage = () => {
    const controls = createWheelsControls();

    const sidewaysIndexSignal = createSignal(0);
    const reelIndexSignal = createSignal(0);

    const [getSidewaysMarkedIndex, setSidewaysMarkedIndex] = createSignal(0);
    const [getReelMarkedIndex, setReelMarkedIndex] = createSignal(0);
    const [getReelsReadout, setReelsReadout] = createSignal("not spun yet — one press spins all three");

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
        {
            key: "reels",
            name: "Three reels, one result",
            component: () => (
                <ReelsExample
                    {...controls.getSharedProps()}
                    onSpinStart={() => setReelsReadout("spinning — each reel stops a little after the one before")}
                    onAllStopped={(indices) =>
                        setReelsReadout(
                            `all stopped on: ${indices.map((index) => controls.getWedges()[index] ?? "nothing").join(", ")}`,
                        )
                    }
                />
            ),
            readout: getReelsReadout,
            path: `${EXAMPLES_ROOT}/Reels.tsx`,
        },
    ]);

    return (
        <>
            <PageWheelsPanel controls={controls} />

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
