import { createMemo, createSignal } from "solid-js";

import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    LOCK_COUNT,
} from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { ArmingExample } from "./Examples/Arming";

export const SlideButtonPage = () => {
    const [getArmedCount, setArmedCount] = createSignal(0);

    const getExamples = createMemo(() => [
        {
            key: "arming",
            name: EXAMPLE_NAMES.arming,
            readout: () => `armed: ${getArmedCount()} of ${LOCK_COUNT}`,
            component: () => <ArmingExample onArmedCountChange={setArmedCount} />,
            path: `${EXAMPLES_ROOT}/Arming.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
