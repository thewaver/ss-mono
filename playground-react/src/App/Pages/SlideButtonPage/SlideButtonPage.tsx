import { useState } from "react";

import { SLIDE_BUTTON_DEFAULTS } from "@thewaver/ss-components-react";
import { SlideButtonKnobs } from "@thewaver/ss-playground/App/Knobs/SlideButtons.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    PERCENT,
} from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.css";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { DefaultExample } from "./Examples/Default";
import { DescribedExample } from "./Examples/Described";
import { DisabledExample } from "./Examples/Disabled";
import { ErroredExample } from "./Examples/Errored";
import { HeldExample } from "./Examples/Held";
import { HoldOnlyExample } from "./Examples/HoldOnly";
import { ReachableExample } from "./Examples/Reachable";
import { RightToLeftExample } from "./Examples/RightToLeft";
import { SlideOnlyExample } from "./Examples/SlideOnly";
import { VerticalExample } from "./Examples/Vertical";

export const SlideButtonPage = () => {
    const [sends, setSends] = useState(0);
    const progressState = useState(0);
    const [completionRatio, setCompletionRatio] = useState(SLIDE_BUTTON_DEFAULTS.completionRatio);
    const [isArmed, setIsArmed] = useState(false);
    const [describedSends, setDescribedSends] = useState(0);
    const [disabledSends, setDisabledSends] = useState(0);
    const [reachableSends, setReachableSends] = useState(0);
    const [hasError, setHasError] = useState(true);
    const [slideOnlySends, setSlideOnlySends] = useState(0);
    const [holdOnlySends, setHoldOnlySends] = useState(0);
    const [verticalSends, setVerticalSends] = useState(0);
    const [rightToLeftSends, setRightToLeftSends] = useState(0);

    const examples = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () =>
                `activations: ${sends} — progress ${Math.round(progressState[0] * PERCENT)}%, which the owner reads while the gesture is still running`,
            component: () => (
                <div className={styles.stage}>
                    <DefaultExample
                        progress={progressState}
                        completionRatio={completionRatio}
                        onActivate={() => {
                            setSends((prev) => prev + 1);
                        }}
                    />
                </div>
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "described",
            name: EXAMPLE_NAMES.described,
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
            name: EXAMPLE_NAMES.slideOnly,
            readout: () =>
                `activations: ${slideOnlySends} — a held press does nothing here, so carrying the thumb is the only pointer route, and a held Enter still confirms`,
            component: () => (
                <div className={styles.stage}>
                    <SlideOnlyExample
                        onActivate={() => {
                            setSlideOnlySends((prev) => prev + 1);
                        }}
                    />
                </div>
            ),
            path: `${EXAMPLES_ROOT}/SlideOnly.tsx`,
        },
        {
            key: "holdOnly",
            name: EXAMPLE_NAMES.holdOnly,
            readout: () =>
                `activations: ${holdOnlySends} — dragging the thumb does nothing here, so a stray drag cannot reach the action, and a held press or a held Enter both can`,
            component: () => (
                <div className={styles.stage}>
                    <HoldOnlyExample
                        onActivate={() => {
                            setHoldOnlySends((prev) => prev + 1);
                        }}
                    />
                </div>
            ),
            path: `${EXAMPLES_ROOT}/HoldOnly.tsx`,
        },
        {
            key: "vertical",
            name: EXAMPLE_NAMES.vertical,
            readout: () =>
                `activations: ${verticalSends} — the thumb rests at the bottom and slides up, and a held press or a held Enter fill it the same way`,
            component: () => (
                <div className={styles.stage}>
                    <VerticalExample
                        onActivate={() => {
                            setVerticalSends((prev) => prev + 1);
                        }}
                    />
                </div>
            ),
            path: `${EXAMPLES_ROOT}/Vertical.tsx`,
        },
        {
            key: "rightToLeft",
            name: EXAMPLE_NAMES.rightToLeft,
            readout: () =>
                `activations: ${rightToLeftSends} — the box around the button sets dir="rtl", so the thumb rests at the right and slides leftward`,
            component: () => (
                <div className={styles.stage}>
                    <RightToLeftExample
                        onActivate={() => {
                            setRightToLeftSends((prev) => prev + 1);
                        }}
                    />
                </div>
            ),
            path: `${EXAMPLES_ROOT}/RightToLeft.tsx`,
        },
        {
            key: "held",
            name: EXAMPLE_NAMES.held,
            readout: () => `armed: ${isArmed}`,
            component: () => (
                <div className={styles.stage}>
                    <HeldExample
                        isArmed={isArmed}
                        onActivate={() => {
                            setIsArmed(true);
                        }}
                        onReset={() => {
                            setIsArmed(false);
                        }}
                    />
                </div>
            ),
            path: `${EXAMPLES_ROOT}/Held.tsx`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () => `activations: ${disabledSends}`,
            component: () => (
                <div className={styles.stage}>
                    <DisabledExample
                        onActivate={() => {
                            setDisabledSends((prev) => prev + 1);
                        }}
                    />
                </div>
            ),
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
        {
            key: "reachable",
            name: EXAMPLE_NAMES.reachable,
            readout: () => `activations: ${reachableSends}`,
            component: () => (
                <div className={styles.stage}>
                    <ReachableExample
                        onActivate={() => {
                            setReachableSends((prev) => prev + 1);
                        }}
                    />
                </div>
            ),
            path: `${EXAMPLES_ROOT}/Reachable.tsx`,
        },
        {
            key: "errored",
            name: EXAMPLE_NAMES.errored,
            readout: () => `hasError: ${hasError}`,
            component: () => (
                <div className={styles.stage}>
                    <ErroredExample
                        hasError={hasError}
                        onActivate={() => {
                            setHasError((prev) => !prev);
                        }}
                    />
                </div>
            ),
            path: `${EXAMPLES_ROOT}/Errored.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"completionRatio"}
                    label={"Completion ratio"}
                    hint={
                        "How far along the track the thumb has to be when let go for the slide to complete. At 1 it has to reach the end; short of it, it springs back."
                    }
                    controls={"Sets SlideButtonProps.completionRatio on the default example"}
                >
                    <PageNumberField
                        value={completionRatio}
                        min={SlideButtonKnobs.MIN_COMPLETION_RATIO}
                        max={SlideButtonKnobs.MAX_COMPLETION_RATIO}
                        step={SlideButtonKnobs.COMPLETION_RATIO_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Completion ratio"}
                        onInput={setCompletionRatio}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
