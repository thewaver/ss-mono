import { useState } from "react";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { DefaultExample } from "./Examples/Default";
import { DescribedExample } from "./Examples/Described";
import { DisabledExample } from "./Examples/Disabled";
import { ErroredExample } from "./Examples/Errored";
import { HeldExample } from "./Examples/Held";
import { HoldOnlyExample } from "./Examples/HoldOnly";
import { ReachableExample } from "./Examples/Reachable";
import { SlideOnlyExample } from "./Examples/SlideOnly";

const EXAMPLES_ROOT = "/src/App/Pages/SlideButtonPage/Examples";
const PERCENT = 100;

export const SlideButtonPage = () => {
    const [sends, setSends] = useState(0);
    const progressState = useState(0);
    const [isArmed, setIsArmed] = useState(false);
    const [describedSends, setDescribedSends] = useState(0);
    const [disabledSends, setDisabledSends] = useState(0);
    const [reachableSends, setReachableSends] = useState(0);
    const [hasError, setHasError] = useState(true);
    const [slideOnlySends, setSlideOnlySends] = useState(0);
    const [holdOnlySends, setHoldOnlySends] = useState(0);

    const examples = [
        {
            key: "default",
            name: "Default",
            readout: () =>
                `activations: ${sends} — progress ${Math.round(progressState[0] * PERCENT)}%, which the owner reads while the gesture is still running`,
            component: () => (
                <DefaultExample
                    progress={progressState}
                    onActivate={() => {
                        setSends((prev) => prev + 1);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "described",
            name: "Described by its field",
            readout: () =>
                `activations: ${describedSends} — the hint under the control is what a screen reader reads after its name, so the gesture is stated before anyone has to guess it`,
            component: () => (
                <DescribedExample
                    onActivate={() => {
                        setDescribedSends((prev) => prev + 1);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Described.tsx`,
        },
        {
            key: "slideOnly",
            name: "Slide only",
            readout: () =>
                `activations: ${slideOnlySends} — a held press does nothing here, so carrying the thumb is the only pointer route, and a held Enter still confirms`,
            component: () => (
                <SlideOnlyExample
                    onActivate={() => {
                        setSlideOnlySends((prev) => prev + 1);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/SlideOnly.tsx`,
        },
        {
            key: "holdOnly",
            name: "Hold only",
            readout: () =>
                `activations: ${holdOnlySends} — dragging the thumb does nothing here, so a stray drag cannot reach the action, and a held press or a held Enter both can`,
            component: () => (
                <HoldOnlyExample
                    onActivate={() => {
                        setHoldOnlySends((prev) => prev + 1);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/HoldOnly.tsx`,
        },
        {
            key: "held",
            name: "Held at the end by the owner",
            readout: () => `armed: ${isArmed}`,
            component: () => (
                <HeldExample
                    isArmed={isArmed}
                    onActivate={() => {
                        setIsArmed(true);
                    }}
                    onReset={() => {
                        setIsArmed(false);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Held.tsx`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `activations: ${disabledSends}`,
            component: () => (
                <DisabledExample
                    onActivate={() => {
                        setDisabledSends((prev) => prev + 1);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
        {
            key: "reachable",
            name: "Disabled + reachable",
            readout: () => `activations: ${reachableSends}`,
            component: () => (
                <ReachableExample
                    onActivate={() => {
                        setReachableSends((prev) => prev + 1);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Reachable.tsx`,
        },
        {
            key: "errored",
            name: "Error",
            readout: () => `hasError: ${hasError}`,
            component: () => (
                <ErroredExample
                    hasError={hasError}
                    onActivate={() => {
                        setHasError((prev) => !prev);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Errored.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
