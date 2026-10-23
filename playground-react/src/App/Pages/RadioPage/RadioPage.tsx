import { useState } from "react";

import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    STARTING_RATING,
} from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { ArcExample } from "./Examples/Arc";
import { DecoratedExample } from "./Examples/Decorated";
import { DefaultExample } from "./Examples/Default";
import { DisabledExample } from "./Examples/Disabled";
import { ErroredExample } from "./Examples/Errored";
import { RatingExample } from "./Examples/Rating";
import { ReachableExample } from "./Examples/Reachable";
import { RightToLeftExample } from "./Examples/RightToLeft";
import { SegmentedExample } from "./Examples/Segmented";
import type { SizeValue } from "./RadioPageReact.types";

export const RadioPage = () => {
    const defaultState = useState<SizeValue | undefined>(undefined);
    const rightToLeftState = useState<SizeValue | undefined>(undefined);
    const segmentedState = useState<SizeValue>("medium");
    const ratingState = useState(STARTING_RATING);
    const hoveredRatingState = useState<number | undefined>(undefined);
    const arcState = useState(STARTING_RATING);
    const hoveredArcState = useState<number | undefined>(undefined);
    const decoratedState = useState<SizeValue>("medium");
    const disabledState = useState<SizeValue>("small");
    const reachableState = useState<SizeValue>("small");
    const erroredState = useState<SizeValue | undefined>(undefined);

    const examples = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () => `value: ${defaultState[0]}`,
            component: () => <DefaultExample value={defaultState} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "rightToLeft",
            name: EXAMPLE_NAMES.rightToLeft,
            readout: () =>
                `value: ${rightToLeftState[0]} — the box around the radios sets dir="rtl", so they run from the right and the left arrow moves on to the next one, while up and down keep their meaning`,
            component: () => <RightToLeftExample value={rightToLeftState} />,
            path: `${EXAMPLES_ROOT}/RightToLeft.tsx`,
        },
        {
            key: "segmented",
            name: EXAMPLE_NAMES.segmented,
            readout: () => `value: ${segmentedState[0]}`,
            component: () => <SegmentedExample value={segmentedState} />,
            path: `${EXAMPLES_ROOT}/Segmented.tsx`,
        },
        {
            key: "rating",
            name: EXAMPLE_NAMES.rating,
            readout: () => `value: ${ratingState[0]}`,
            component: () => <RatingExample value={ratingState} hovered={hoveredRatingState} />,
            path: `${EXAMPLES_ROOT}/Rating.tsx`,
        },
        {
            key: "decorated",
            name: EXAMPLE_NAMES.decorated,
            readout: () => `value: ${decoratedState[0]}`,
            component: () => <DecoratedExample value={decoratedState} />,
            path: `${EXAMPLES_ROOT}/Decorated.tsx`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () => `value: ${disabledState[0]}`,
            component: () => <DisabledExample value={disabledState} />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
        {
            key: "reachable",
            name: EXAMPLE_NAMES.reachable,
            readout: () => `value: ${reachableState[0]}`,
            component: () => <ReachableExample value={reachableState} />,
            path: `${EXAMPLES_ROOT}/Reachable.tsx`,
        },
        {
            key: "errored",
            name: EXAMPLE_NAMES.errored,
            readout: () => `value: ${erroredState[0]}`,
            component: () => <ErroredExample value={erroredState} />,
            path: `${EXAMPLES_ROOT}/Errored.tsx`,
        },
        {
            key: "arc",
            name: EXAMPLE_NAMES.arc,
            readout: () => `value: ${arcState[0]} — the same radios, placed by a layout instead of laid in a row`,
            component: () => <ArcExample value={arcState} hovered={hoveredArcState} />,
            path: `${EXAMPLES_ROOT}/Arc.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
