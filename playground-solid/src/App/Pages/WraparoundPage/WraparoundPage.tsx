import { createMemo, createSignal } from "solid-js";

import { NOTHING_PRESSED } from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { GridExample } from "./Examples/Grid";
import { MosaicExample } from "./Examples/Mosaic";

const EXAMPLES_ROOT = "/src/App/Pages/WraparoundPage/Examples";

export const WraparoundPage = () => {
    const [getMosaicPressed, setMosaicPressed] = createSignal(NOTHING_PRESSED);
    const [getGridPressed, setGridPressed] = createSignal(NOTHING_PRESSED);

    const getExamples = createMemo(() => [
        {
            key: "mosaic",
            span: 2,
            name: "A mosaic that never ends",
            readout: () =>
                `opened: ${getMosaicPressed()} — drag and let go to send it coasting, or use the wheel; with the window focused the arrows and page keys move it and Home brings it back, and tabbing into the pictures brings the one focused into view`,
            component: () => <MosaicExample onPress={setMosaicPressed} />,
            path: `${EXAMPLES_ROOT}/Mosaic.tsx`,
        },
        {
            key: "grid",
            span: 2,
            name: "Content smaller than the window",
            readout: () =>
                `pressed: ${getGridPressed()} — six buttons, copied until the window is full; only one set can be tabbed to or read out, and pressing any copy presses the real button`,
            component: () => <GridExample onPress={setGridPressed} />,
            path: `${EXAMPLES_ROOT}/Grid.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
