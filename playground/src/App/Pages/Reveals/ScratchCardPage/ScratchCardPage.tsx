import { createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { SCRATCH_CARD_DEFAULTS } from "@thewaver/ss-components";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField, PageSelectField } from "../../../StyledComponents/Field/Field";
import { FrostedExample } from "./Examples/Frosted";
import { TicketExample } from "./Examples/Ticket";
import { WindowsExample } from "./Examples/Windows";
import type {
    ExampleKey,
    ExampleProgress,
    ScratchCardExampleProps,
    ScratchCardWindowsExampleProps,
} from "./ScratchCardPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/Reveals/ScratchCardPage/Examples";

const MIN_PRECISION = 8;
const MAX_PRECISION = 64;
const PRECISION_STEP = 4;
const MIN_BRUSH_RADIUS = 2;
const MAX_BRUSH_RADIUS = 90;
const BRUSH_STEP = 2;
const MIN_SOFTNESS = 0;
const MAX_SOFTNESS = 1;
const SOFTNESS_STEP = 0.05;
const MIN_THRESHOLD = 0.05;
const MAX_THRESHOLD = 1;
const THRESHOLD_STEP = 0.05;
const RATIO_DIGITS = 2;
const CIRCLE = "circle";
const BRUSH_SHAPES = [CIRCLE, ...ShapeConst.DEFAULT_SHAPES] as const;
const NOTHING_SCRATCHED = 0;
const WINDOW_COUNT = 3;
const FIRST_WINDOW = 1;

export const ScratchCardPage = () => {
    const [getPrecision, setPrecision] = createSignal(SCRATCH_CARD_DEFAULTS.precision);
    const [getBrushRadius, setBrushRadius] = createSignal(SCRATCH_CARD_DEFAULTS.brushRadius);
    const [getSoftness, setSoftness] = createSignal(SCRATCH_CARD_DEFAULTS.softness);
    const [getBrushShape, setBrushShape] = createSignal<(typeof BRUSH_SHAPES)[number]>(CIRCLE);

    const getComputePoints = createMemo(() => {
        const shape = getBrushShape();

        if (shape === CIRCLE) return undefined;

        return (size: Size2d) => ShapeConst.getDefaultShapePoints(shape, size);
    });
    const [getThreshold, setThreshold] = createSignal(SCRATCH_CARD_DEFAULTS.clearThreshold);
    const [getProgress, setProgress] = createStore<Record<ExampleKey, ExampleProgress>>({
        ticket: { ratio: NOTHING_SCRATCHED, hasCleared: false },
        frosted: { ratio: NOTHING_SCRATCHED, hasCleared: false },
    });
    const [getWindowProgress, setWindowProgress] = createStore<ExampleProgress[]>(
        Array.from({ length: WINDOW_COUNT }, () => ({ ratio: NOTHING_SCRATCHED, hasCleared: false })),
    );

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

        const windowsProps: ScratchCardWindowsExampleProps = {
            brushRadius: getBrushRadius,
            precision: getPrecision,
            softness: getSoftness,
            computePoints: getComputePoints,
            clearThreshold: getThreshold,
            onWindowScratch: (index, ratio) => {
                setWindowProgress(index, "ratio", ratio);

                if (ratio === NOTHING_SCRATCHED) setWindowProgress(index, "hasCleared", false);
            },
            onWindowClear: (index) => setWindowProgress(index, "hasCleared", true),
        };

        const describeWindows = () =>
            getWindowProgress
                .map(
                    (progress, index) =>
                        `window ${index + FIRST_WINDOW}: ${
                            progress.hasCleared ? "cleared" : `${(progress.ratio * 100).toFixed(RATIO_DIGITS)}%`
                        }`,
                )
                .join(" · ");

        const describe = (key: ExampleKey, whileGoing: string) =>
            `${(getProgress[key].ratio * MAX_THRESHOLD * 100).toFixed(RATIO_DIGITS)}% rubbed off — ${
                getProgress[key].hasCleared ? "the rest went by itself once the threshold was crossed" : whileGoing
            }`;

        return [
            {
                key: "ticket",
                name: "Ticket",
                readout: () => describe("ticket", "keep going"),
                component: () => <TicketExample {...exampleProps("ticket")} />,
                path: `${EXAMPLES_ROOT}/Ticket.tsx`,
            },
            {
                key: "frosted",
                name: "Frosted",
                readout: () => describe("frosted", "what is under it sharpens as the frost goes"),
                component: () => <FrostedExample {...exampleProps("frosted")} />,
                path: `${EXAMPLES_ROOT}/Frosted.tsx`,
            },
            {
                key: "windows",
                name: "Ticket with windows",
                readout: describeWindows,
                component: () => <WindowsExample {...windowsProps} />,
                path: `${EXAMPLES_ROOT}/Windows.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"precision"}
                    label={"Precision"}
                    hint={
                        "How finely the card measures how much has been scratched off. Finer measurement costs more work each frame."
                    }
                >
                    <PageNumberField
                        value={getPrecision}
                        min={() => MIN_PRECISION}
                        max={() => MAX_PRECISION}
                        step={() => PRECISION_STEP}
                        ariaLabel={"Precision"}
                        onInput={setPrecision}
                    />
                </PageProp>

                <PageProp
                    key={"brushRadius"}
                    label={"Brush radius (px)"}
                    hint={"How large a patch one stroke of the pointer clears."}
                >
                    <PageNumberField
                        value={getBrushRadius}
                        min={() => MIN_BRUSH_RADIUS}
                        max={() => MAX_BRUSH_RADIUS}
                        step={() => BRUSH_STEP}
                        ariaLabel={"Brush radius in pixels"}
                        onInput={setBrushRadius}
                    />
                </PageProp>

                <PageProp key={"brushShape"} label={"Brush shape"} hint={"The outline of the patch a stroke clears."}>
                    <PageSelectField
                        value={getBrushShape}
                        values={() => BRUSH_SHAPES}
                        ariaLabel={"Brush shape"}
                        onChange={(shape) => setBrushShape(() => shape)}
                    />
                </PageProp>

                <PageProp
                    key={"softness"}
                    label={"Edge softness"}
                    hint={"How gradually a cleared patch fades into what is still covered. 0 gives a hard edge."}
                >
                    <PageNumberField
                        value={getSoftness}
                        min={() => MIN_SOFTNESS}
                        max={() => MAX_SOFTNESS}
                        step={() => SOFTNESS_STEP}
                        ariaLabel={"Edge softness"}
                        onInput={setSoftness}
                    />
                </PageProp>

                <PageProp
                    key={"clearThreshold"}
                    label={"Clear threshold"}
                    hint={"How much of the card has to be scratched off before the rest is cleared for you."}
                >
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
