import { useState } from "react";

import { MediaQueryMonitorReactUtils, SHAPE_REVEAL_DEFAULTS, ShapeRevealUtils } from "@thewaver/ss-components-react";
import { ShapeRevealKnobs } from "@thewaver/ss-playground/App/Knobs/ShapeReveals.const";
import {
    ORIGIN_LABELS,
    computeShapeRevealReadout,
} from "@thewaver/ss-playground/App/Pages/ShapeRevealPage/ShapeRevealPage.const";
import type {
    ShapeRevealPageOrigin,
    ShapeRevealPageShape,
    ShapeRevealRun,
} from "@thewaver/ss-playground/App/Pages/ShapeRevealPage/ShapeRevealPage.types";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { SwitchExample } from "./Examples/Switch";

const EXAMPLES_ROOT = "/src/App/Pages/ShapeRevealPage/Examples";
const FIELD_WIDTH = 110;
const SELECT_FIELD_WIDTH = 190;

const NO_MOTION_DURATION_MS = 0;

export const ShapeRevealPage = () => {
    const [shape, setShape] = useState<ShapeRevealPageShape>(ShapeRevealKnobs.STARTING_SHAPE);
    const [origin, setOrigin] = useState<ShapeRevealPageOrigin>(ShapeRevealKnobs.STARTING_ORIGIN);
    const [durationMs, setDurationMs] = useState(SHAPE_REVEAL_DEFAULTS.durationMs);
    const [blur, setBlur] = useState(SHAPE_REVEAL_DEFAULTS.blur);
    const [run, setRun] = useState<ShapeRevealRun>();

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const examples = [
        {
            key: "switch",
            name: "A panel switched",
            readout: () => computeShapeRevealReadout(run, ShapeRevealUtils.getIsSupported()),
            component: () => (
                <SwitchExample
                    shape={shape}
                    origin={origin}
                    durationMs={prefersReducedMotion ? NO_MOTION_DURATION_MS : durationMs}
                    blur={blur}
                    onRun={setRun}
                />
            ),
            path: `${EXAMPLES_ROOT}/Switch.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"computePoints"}
                    label={"Shape"}
                    hint={
                        "The contour the new page is uncovered through. Every one grows until it covers the whole window."
                    }
                >
                    <PageSelectField
                        value={shape}
                        values={ShapeRevealKnobs.SHAPES}
                        width={SELECT_FIELD_WIDTH}
                        ariaLabel={"Shape"}
                        onChange={setShape}
                    />
                </PageProp>

                <PageProp
                    itemKey={"origin"}
                    label={"Grows from"}
                    hint={"Where the shape starts: the Switch button, the middle of the window, or one of its corners."}
                >
                    <PageSelectField
                        value={origin}
                        values={ShapeRevealKnobs.ORIGINS}
                        computeLabel={(value) => ORIGIN_LABELS[value]}
                        width={SELECT_FIELD_WIDTH}
                        ariaLabel={"Grows from"}
                        onChange={setOrigin}
                    />
                </PageProp>

                <PageProp
                    itemKey={"durationMs"}
                    label={"Duration (ms)"}
                    hint={
                        "How long the shape takes to cover the window. It is off while the visitor has asked for reduced motion, and the panel then simply switches."
                    }
                >
                    <PageNumberField
                        value={durationMs}
                        min={ShapeRevealKnobs.MIN_DURATION_MS}
                        max={ShapeRevealKnobs.MAX_DURATION_MS}
                        step={ShapeRevealKnobs.DURATION_STEP_MS}
                        width={FIELD_WIDTH}
                        isDisabled={prefersReducedMotion}
                        ariaLabel={"Duration in milliseconds"}
                        onInput={setDurationMs}
                    />
                </PageProp>

                <PageProp
                    itemKey={"blur"}
                    label={"Blur (px)"}
                    hint={"How soft the shape's edge is by the time it covers the window. 0 gives a hard edge."}
                >
                    <PageNumberField
                        value={blur}
                        min={ShapeRevealKnobs.MIN_BLUR}
                        max={ShapeRevealKnobs.MAX_BLUR}
                        step={ShapeRevealKnobs.BLUR_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Blur in pixels"}
                        onInput={setBlur}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
