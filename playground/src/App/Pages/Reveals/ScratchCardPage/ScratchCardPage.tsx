import { createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { SCRATCH_CARD_DEFAULTS } from "@thewaver/ss-components";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { ScratchCardKnobs } from "../../../Knobs/ScratchCards.const";
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

const RATIO_DIGITS = 2;
const NOTHING_SCRATCHED = 0;
const WINDOW_COUNT = 3;
const FIRST_WINDOW = 1;

export const ScratchCardPage = () => {
    const [getPrecision, setPrecision] = createSignal(SCRATCH_CARD_DEFAULTS.precision);
    const [getBrushRadius, setBrushRadius] = createSignal(SCRATCH_CARD_DEFAULTS.brushRadius);
    const [getSoftness, setSoftness] = createSignal(SCRATCH_CARD_DEFAULTS.softness);
    const [getBrushShape, setBrushShape] = createSignal<(typeof ScratchCardKnobs.BRUSH_SHAPES)[number]>(
        ScratchCardKnobs.STARTING_BRUSH_SHAPE,
    );

    const getComputePoints = createMemo(() => {
        const shape = getBrushShape();

        if (shape === ScratchCardKnobs.CIRCLE) return undefined;

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
            `${(getProgress[key].ratio * ScratchCardKnobs.MAX_THRESHOLD * 100).toFixed(RATIO_DIGITS)}% rubbed off — ${
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
                        min={() => ScratchCardKnobs.MIN_PRECISION}
                        max={() => ScratchCardKnobs.MAX_PRECISION}
                        step={() => ScratchCardKnobs.PRECISION_STEP}
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
                        min={() => ScratchCardKnobs.MIN_BRUSH_RADIUS}
                        max={() => ScratchCardKnobs.MAX_BRUSH_RADIUS}
                        step={() => ScratchCardKnobs.BRUSH_STEP}
                        ariaLabel={"Brush radius in pixels"}
                        onInput={setBrushRadius}
                    />
                </PageProp>

                <PageProp key={"brushShape"} label={"Brush shape"} hint={"The outline of the patch a stroke clears."}>
                    <PageSelectField
                        value={getBrushShape}
                        values={() => ScratchCardKnobs.BRUSH_SHAPES}
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
                        min={() => ScratchCardKnobs.MIN_SOFTNESS}
                        max={() => ScratchCardKnobs.MAX_SOFTNESS}
                        step={() => ScratchCardKnobs.SOFTNESS_STEP}
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
                        min={() => ScratchCardKnobs.MIN_THRESHOLD}
                        max={() => ScratchCardKnobs.MAX_THRESHOLD}
                        step={() => ScratchCardKnobs.THRESHOLD_STEP}
                        ariaLabel={"Clear threshold"}
                        onInput={setThreshold}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
