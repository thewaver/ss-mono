import { useState } from "react";

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
import type { SizeValue } from "./RadioPage.types";

const STARTING_RATING = 3;
const EXAMPLES_ROOT = "/src/App/Pages/RadioPage/Examples";

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
            name: "Default",
            readout: () => `value: ${defaultState[0]}`,
            component: () => <DefaultExample value={defaultState} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "rightToLeft",
            name: "In a right-to-left box",
            readout: () =>
                `value: ${rightToLeftState[0]} — the box around the radios sets dir="rtl", so they run from the right and the left arrow moves on to the next one, while up and down keep their meaning`,
            component: () => <RightToLeftExample value={rightToLeftState} />,
            path: `${EXAMPLES_ROOT}/RightToLeft.tsx`,
        },
        {
            key: "segmented",
            name: "Segmented",
            readout: () => `value: ${segmentedState[0]}`,
            component: () => <SegmentedExample value={segmentedState} />,
            path: `${EXAMPLES_ROOT}/Segmented.tsx`,
        },
        {
            key: "rating",
            name: "Rating",
            readout: () => `value: ${ratingState[0]}`,
            component: () => <RatingExample value={ratingState} hovered={hoveredRatingState} />,
            path: `${EXAMPLES_ROOT}/Rating.tsx`,
        },
        {
            key: "arc",
            name: "Rating, bent into an arc",
            readout: () => `value: ${arcState[0]} — the same radios, placed by a layout instead of laid in a row`,
            component: () => <ArcExample value={arcState} hovered={hoveredArcState} />,
            path: `${EXAMPLES_ROOT}/Arc.tsx`,
        },
        {
            key: "decorated",
            name: "Decorated",
            readout: () => `value: ${decoratedState[0]}`,
            component: () => <DecoratedExample value={decoratedState} />,
            path: `${EXAMPLES_ROOT}/Decorated.tsx`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `value: ${disabledState[0]}`,
            component: () => <DisabledExample value={disabledState} />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
        {
            key: "reachable",
            name: "Disabled + reachable",
            readout: () => `value: ${reachableState[0]}`,
            component: () => <ReachableExample value={reachableState} />,
            path: `${EXAMPLES_ROOT}/Reachable.tsx`,
        },
        {
            key: "errored",
            name: "Error",
            readout: () => `value: ${erroredState[0]}`,
            component: () => <ErroredExample value={erroredState} />,
            path: `${EXAMPLES_ROOT}/Errored.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
