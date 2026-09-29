import { useState } from "react";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { useWheelsControls } from "../Wheels.utils";
import { PageWheelsPanel } from "../WheelsPanel";
import { OverExample } from "./Examples/Over";
import { SidewaysExample } from "./Examples/Sideways";

const EXAMPLES_ROOT = "/src/App/Pages/Wheels/DrumWheelPage/Examples";

export const DrumWheelPage = () => {
    const controls = useWheelsControls();

    const sidewaysIndexState = useState(0);
    const reelIndexState = useState(0);

    const [sidewaysMarkedIndex, setSidewaysMarkedIndex] = useState(0);
    const [reelMarkedIndex, setReelMarkedIndex] = useState(0);

    const getReadout = (markedIndex: number, settledIndex: number) => () =>
        `under the marker: ${controls.wedges[markedIndex] ?? "nothing"} — settled on: ${controls.wedges[settledIndex] ?? "nothing"}`;

    const examples = [
        {
            key: "sideways",
            name: "Turning sideways",
            component: () => (
                <SidewaysExample
                    {...controls.sharedProps}
                    targetIndex={sidewaysIndexState}
                    onSelectedWedgeChange={setSidewaysMarkedIndex}
                />
            ),
            readout: getReadout(sidewaysMarkedIndex, sidewaysIndexState[0]),
            path: `${EXAMPLES_ROOT}/Sideways.tsx`,
        },
        {
            key: "reel",
            name: "Turning over",
            component: () => (
                <OverExample
                    {...controls.sharedProps}
                    targetIndex={reelIndexState}
                    onSelectedWedgeChange={setReelMarkedIndex}
                />
            ),
            readout: getReadout(reelMarkedIndex, reelIndexState[0]),
            path: `${EXAMPLES_ROOT}/Over.tsx`,
        },
    ];

    return (
        <>
            <PageWheelsPanel controls={controls} />

            <PageExamples items={examples} layout={"flow"} />
        </>
    );
};
