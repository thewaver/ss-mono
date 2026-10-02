import { useMemo, useState } from "react";

import { SCRATCH_CARD_DEFAULTS } from "@thewaver/ss-components-react";
import { ScratchCardKnobs } from "@thewaver/ss-playground/App/Knobs/ScratchCards.const";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageNumberField, PageSelectField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
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

const applyScratch = (progress: ExampleProgress, ratio: number): ExampleProgress => ({
    ratio,
    hasCleared: ratio === NOTHING_SCRATCHED ? false : progress.hasCleared,
});

export const ScratchCardPage = () => {
    const [precision, setPrecision] = useState(SCRATCH_CARD_DEFAULTS.precision);
    const [brushRadius, setBrushRadius] = useState(SCRATCH_CARD_DEFAULTS.brushRadius);
    const [softness, setSoftness] = useState(SCRATCH_CARD_DEFAULTS.softness);
    const [brushShape, setBrushShape] = useState<(typeof ScratchCardKnobs.BRUSH_SHAPES)[number]>(
        ScratchCardKnobs.STARTING_BRUSH_SHAPE,
    );

    const computePoints = useMemo(() => {
        if (brushShape === ScratchCardKnobs.CIRCLE) return undefined;

        return (size: Size2d) => ShapeConst.getDefaultShapePoints(brushShape, size);
    }, [brushShape]);
    const [threshold, setThreshold] = useState(SCRATCH_CARD_DEFAULTS.clearThreshold);
    const [progress, setProgress] = useState<Record<ExampleKey, ExampleProgress>>({
        ticket: { ratio: NOTHING_SCRATCHED, hasCleared: false },
        frosted: { ratio: NOTHING_SCRATCHED, hasCleared: false },
    });
    const [windowProgress, setWindowProgress] = useState<ExampleProgress[]>(() =>
        Array.from({ length: WINDOW_COUNT }, () => ({ ratio: NOTHING_SCRATCHED, hasCleared: false })),
    );

    const exampleProps = (key: ExampleKey): ScratchCardExampleProps => ({
        brushRadius,
        precision,
        softness,
        computePoints,
        clearThreshold: threshold,
        onScratch: (ratio) => {
            setProgress((previous) => ({ ...previous, [key]: applyScratch(previous[key], ratio) }));
        },
        onClear: () => setProgress((previous) => ({ ...previous, [key]: { ...previous[key], hasCleared: true } })),
    });

    const windowsProps: ScratchCardWindowsExampleProps = {
        brushRadius,
        precision,
        softness,
        computePoints,
        clearThreshold: threshold,
        onWindowScratch: (index, ratio) => {
            setWindowProgress((previous) =>
                previous.map((entry, at) => (at === index ? applyScratch(entry, ratio) : entry)),
            );
        },
        onWindowClear: (index) =>
            setWindowProgress((previous) =>
                previous.map((entry, at) => (at === index ? { ...entry, hasCleared: true } : entry)),
            ),
    };

    const describeWindows = () =>
        windowProgress
            .map(
                (entry, index) =>
                    `window ${index + FIRST_WINDOW}: ${
                        entry.hasCleared ? "cleared" : `${(entry.ratio * 100).toFixed(RATIO_DIGITS)}%`
                    }`,
            )
            .join(" · ");

    const describe = (key: ExampleKey, whileGoing: string) =>
        `${(progress[key].ratio * ScratchCardKnobs.MAX_THRESHOLD * 100).toFixed(RATIO_DIGITS)}% rubbed off — ${
            progress[key].hasCleared ? "the rest went by itself once the threshold was crossed" : whileGoing
        }`;

    const examples = [
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

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"precision"}
                    label={"Precision"}
                    hint={
                        "How finely the card measures how much has been scratched off. Finer measurement costs more work each frame."
                    }
                >
                    <PageNumberField
                        value={precision}
                        min={ScratchCardKnobs.MIN_PRECISION}
                        max={ScratchCardKnobs.MAX_PRECISION}
                        step={ScratchCardKnobs.PRECISION_STEP}
                        ariaLabel={"Precision"}
                        onInput={setPrecision}
                    />
                </PageProp>

                <PageProp
                    itemKey={"brushRadius"}
                    label={"Brush radius (px)"}
                    hint={"How large a patch one stroke of the pointer clears."}
                >
                    <PageNumberField
                        value={brushRadius}
                        min={ScratchCardKnobs.MIN_BRUSH_RADIUS}
                        max={ScratchCardKnobs.MAX_BRUSH_RADIUS}
                        step={ScratchCardKnobs.BRUSH_STEP}
                        ariaLabel={"Brush radius in pixels"}
                        onInput={setBrushRadius}
                    />
                </PageProp>

                <PageProp
                    itemKey={"brushShape"}
                    label={"Brush shape"}
                    hint={"The contour of the patch a stroke clears."}
                >
                    <PageSelectField
                        value={brushShape}
                        values={ScratchCardKnobs.BRUSH_SHAPES}
                        ariaLabel={"Brush shape"}
                        onChange={setBrushShape}
                    />
                </PageProp>

                <PageProp
                    itemKey={"softness"}
                    label={"Edge softness"}
                    hint={"How gradually a cleared patch fades into what is still covered. 0 gives a hard edge."}
                >
                    <PageNumberField
                        value={softness}
                        min={ScratchCardKnobs.MIN_SOFTNESS}
                        max={ScratchCardKnobs.MAX_SOFTNESS}
                        step={ScratchCardKnobs.SOFTNESS_STEP}
                        ariaLabel={"Edge softness"}
                        onInput={setSoftness}
                    />
                </PageProp>

                <PageProp
                    itemKey={"clearThreshold"}
                    label={"Clear threshold"}
                    hint={"How much of the card has to be scratched off before the rest is cleared for you."}
                >
                    <PageNumberField
                        value={threshold}
                        min={ScratchCardKnobs.MIN_THRESHOLD}
                        max={ScratchCardKnobs.MAX_THRESHOLD}
                        step={ScratchCardKnobs.THRESHOLD_STEP}
                        ariaLabel={"Clear threshold"}
                        onInput={setThreshold}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} layout={"flow"} />
        </>
    );
};
