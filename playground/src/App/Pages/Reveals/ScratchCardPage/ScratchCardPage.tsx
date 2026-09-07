import { createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField, PageSelectField } from "../../../StyledComponents/Field/Field";
import { FrostedExample } from "./Examples/Frosted";
import { TicketExample } from "./Examples/Ticket";
import type { ExampleKey, ExampleProgress, ScratchCardExampleProps } from "./ScratchCardPage.types";

import { MEASURE_BOX_PADDING } from "../../../PageComponents/MeasureBox/MeasureBox.css";

const EXAMPLES_ROOT = "/src/App/Pages/Reveals/ScratchCardPage/Examples";

const STARTING_PRECISION = 32;
const MIN_PRECISION = 8;
const MAX_PRECISION = 64;
const PRECISION_STEP = 4;
const STARTING_BRUSH_RADIUS = 20;
const MIN_BRUSH_RADIUS = 2;
const MAX_BRUSH_RADIUS = 90;
const BRUSH_STEP = 2;
const STARTING_SOFTNESS = 0.8;
const MIN_SOFTNESS = 0;
const MAX_SOFTNESS = 1;
const SOFTNESS_STEP = 0.05;
const STARTING_THRESHOLD = 0.6;
const MIN_THRESHOLD = 0.05;
const MAX_THRESHOLD = 1;
const THRESHOLD_STEP = 0.05;
const RATIO_DIGITS = 2;
const CARD_WIDTH = 360;
const CIRCLE = "circle";
const BRUSH_SHAPES = [CIRCLE, ...ShapeConst.DEFAULT_SHAPES] as const;
const NOTHING_SCRATCHED = 0;

export const ScratchCardPage = () => {
    const [getPrecision, setPrecision] = createSignal(STARTING_PRECISION);
    const [getBrushRadius, setBrushRadius] = createSignal(STARTING_BRUSH_RADIUS);
    const [getSoftness, setSoftness] = createSignal(STARTING_SOFTNESS);
    const [getBrushShape, setBrushShape] = createSignal<(typeof BRUSH_SHAPES)[number]>(CIRCLE);

    const getComputePoints = createMemo(() => {
        const shape = getBrushShape();

        if (shape === CIRCLE) return undefined;

        return (size: Size2d) => ShapeConst.getDefaultShapePoints(shape, size);
    });
    const [getThreshold, setThreshold] = createSignal(STARTING_THRESHOLD);
    const [getProgress, setProgress] = createStore<Record<ExampleKey, ExampleProgress>>({
        ticket: { ratio: NOTHING_SCRATCHED, hasCleared: false },
        frosted: { ratio: NOTHING_SCRATCHED, hasCleared: false },
    });

    const getExamples = createMemo(() => {
        const exampleProps = (key: ExampleKey): ScratchCardExampleProps => ({
            brushRadius: getBrushRadius,
            precision: getPrecision,
            softness: getSoftness,
            computePoints: getComputePoints,
            clearThreshold: getThreshold,
            onScratch: (ratio) => {
                setProgress(key, "ratio", ratio);

                if (ratio === NOTHING_SCRATCHED) setProgress(key, "hasCleared", false);
            },
            onClear: () => setProgress(key, "hasCleared", true),
        });

        const describe = (key: ExampleKey, whileGoing: string) =>
            `${(getProgress[key].ratio * MAX_THRESHOLD * 100).toFixed(RATIO_DIGITS)}% rubbed off — ${
                getProgress[key].hasCleared ? "the rest went by itself once the threshold was crossed" : whileGoing
            }`;

        return [
            {
                key: "ticket",
                name: "Ticket",
                readout: () => describe("ticket", "keep going"),
                component: () => (
                    <PageMeasureBox width={() => CARD_WIDTH} padding={() => MEASURE_BOX_PADDING}>
                        <TicketExample {...exampleProps("ticket")} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Ticket.tsx`,
            },
            {
                key: "frosted",
                name: "Frosted",
                readout: () => describe("frosted", "what is under it sharpens as the frost goes"),
                component: () => (
                    <PageMeasureBox width={() => CARD_WIDTH} padding={() => MEASURE_BOX_PADDING}>
                        <FrostedExample {...exampleProps("frosted")} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Frosted.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"precision"} label={"Precision"}>
                    <PageNumberField
                        value={getPrecision}
                        min={() => MIN_PRECISION}
                        max={() => MAX_PRECISION}
                        step={() => PRECISION_STEP}
                        ariaLabel={"Precision"}
                        onInput={setPrecision}
                    />
                </PageProp>

                <PageProp key={"brushRadius"} label={"Brush radius (px)"}>
                    <PageNumberField
                        value={getBrushRadius}
                        min={() => MIN_BRUSH_RADIUS}
                        max={() => MAX_BRUSH_RADIUS}
                        step={() => BRUSH_STEP}
                        ariaLabel={"Brush radius in pixels"}
                        onInput={setBrushRadius}
                    />
                </PageProp>

                <PageProp key={"brushShape"} label={"Brush shape"}>
                    <PageSelectField
                        value={getBrushShape}
                        values={() => BRUSH_SHAPES}
                        ariaLabel={"Brush shape"}
                        onChange={(shape) => setBrushShape(() => shape)}
                    />
                </PageProp>

                <PageProp key={"softness"} label={"Edge softness"}>
                    <PageNumberField
                        value={getSoftness}
                        min={() => MIN_SOFTNESS}
                        max={() => MAX_SOFTNESS}
                        step={() => SOFTNESS_STEP}
                        ariaLabel={"Edge softness"}
                        onInput={setSoftness}
                    />
                </PageProp>

                <PageProp key={"clearThreshold"} label={"Clear threshold"}>
                    <PageNumberField
                        value={getThreshold}
                        min={() => MIN_THRESHOLD}
                        max={() => MAX_THRESHOLD}
                        step={() => THRESHOLD_STEP}
                        ariaLabel={"Clear threshold"}
                        onInput={setThreshold}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
