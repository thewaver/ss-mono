import { createMemo, createSignal } from "solid-js";

import { MediaQueryMonitorSolidUtils, SHAPE_REVEAL_DEFAULTS, ShapeRevealUtils } from "@thewaver/ss-components-solid";
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
    const [getShape, setShape] = createSignal<ShapeRevealPageShape>(ShapeRevealKnobs.STARTING_SHAPE);
    const [getOrigin, setOrigin] = createSignal<ShapeRevealPageOrigin>(ShapeRevealKnobs.STARTING_ORIGIN);
    const [getDurationMs, setDurationMs] = createSignal(SHAPE_REVEAL_DEFAULTS.durationMs);
    const [getBlur, setBlur] = createSignal(SHAPE_REVEAL_DEFAULTS.blur);
    const [getRun, setRun] = createSignal<ShapeRevealRun>();

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    const getExamples = createMemo(() => [
        {
            key: "switch",
            name: "A panel switched",
            readout: () => computeShapeRevealReadout(getRun(), ShapeRevealUtils.getIsSupported()),
            component: () => (
                <SwitchExample
                    shape={getShape}
                    origin={getOrigin}
                    durationMs={() => (getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : getDurationMs())}
                    blur={getBlur}
                    onRun={setRun}
                />
            ),
            path: `${EXAMPLES_ROOT}/Switch.tsx`,
        },
    ]);

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"computePoints"}
                    label={"Shape"}
                    hint={
                        "The contour the new page is uncovered through. Every one grows until it covers the whole window."
                    }
                >
                    <PageSelectField
                        value={getShape}
                        values={() => ShapeRevealKnobs.SHAPES}
                        width={() => SELECT_FIELD_WIDTH}
                        ariaLabel={"Shape"}
                        onChange={(shape) => setShape(() => shape)}
                    />
                </PageProp>

                <PageProp
                    key={"origin"}
                    label={"Grows from"}
                    hint={"Where the shape starts: the Switch button, the middle of the window, or one of its corners."}
                >
                    <PageSelectField
                        value={getOrigin}
                        values={() => ShapeRevealKnobs.ORIGINS}
                        computeLabel={(origin) => ORIGIN_LABELS[origin]}
                        width={() => SELECT_FIELD_WIDTH}
                        ariaLabel={"Grows from"}
                        onChange={(origin) => setOrigin(() => origin)}
                    />
                </PageProp>

                <PageProp
                    key={"durationMs"}
                    label={"Duration (ms)"}
                    hint={
                        "How long the shape takes to cover the window. It is off while the visitor has asked for reduced motion, and the panel then simply switches."
                    }
                >
                    <PageNumberField
                        value={getDurationMs}
                        min={() => ShapeRevealKnobs.MIN_DURATION_MS}
                        max={() => ShapeRevealKnobs.MAX_DURATION_MS}
                        step={() => ShapeRevealKnobs.DURATION_STEP_MS}
                        width={() => FIELD_WIDTH}
                        isDisabled={getPrefersReducedMotion}
                        ariaLabel={"Duration in milliseconds"}
                        onInput={setDurationMs}
                    />
                </PageProp>

                <PageProp
                    key={"blur"}
                    label={"Blur (px)"}
                    hint={"How soft the shape's edge is by the time it covers the window. 0 gives a hard edge."}
                >
                    <PageNumberField
                        value={getBlur}
                        min={() => ShapeRevealKnobs.MIN_BLUR}
                        max={() => ShapeRevealKnobs.MAX_BLUR}
                        step={() => ShapeRevealKnobs.BLUR_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Blur in pixels"}
                        onInput={setBlur}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
