import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageCarouselBox } from "../../../StyledComponents/CarouselContent/CarouselContent";
import { createCarouselsControls } from "../Carousels.utils";
import { PageCarouselsPanel } from "../CarouselsPanel";
import { DrumExample } from "./Examples/Drum";

const EXAMPLES_ROOT = "/src/App/Pages/Carousels/DrumCarouselPage/Examples";

export const DrumCarouselPage = () => {
    const controls = createCarouselsControls();

    const drumIndexSignal = createSignal(0);

    const getExamples = createMemo(() => [
        {
            key: "drum",
            name: "Turned on a barrel",
            readout: () =>
                `slide ${drumIndexSignal[0]() + 1} of ${controls.getSlideCount()} — the slides sit on the faces of a drum, turning about the axis the direction names and swiped along it`,
            component: () => (
                <PageCarouselBox>
                    <DrumExample
                        {...controls.getSharedProps()}
                        indexSignal={drumIndexSignal}
                        axis={controls.dirSignal[0]}
                    />
                </PageCarouselBox>
            ),
            path: `${EXAMPLES_ROOT}/Drum.tsx`,
        },
    ]);

    return (
        <>
            <PageCarouselsPanel controls={controls} />

            <PageExamples items={getExamples} />
        </>
    );
};
