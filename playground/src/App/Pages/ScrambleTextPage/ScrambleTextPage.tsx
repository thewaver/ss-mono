import { createMemo, createSignal } from "solid-js";

import { MediaQueryMonitor } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField, PageSelectField } from "../../StyledComponents/Field/Field";
import { HeadlineExample } from "./Examples/Headline";
import { SequentialExample } from "./Examples/Sequential";
import { SwapExample } from "./Examples/Swap";
import type { ScrambleTextExampleProps } from "./ScrambleTextPage.types";

import { MEASURE_BOX_PADDING } from "../../PageComponents/MeasureBox/MeasureBox.css";

const EXAMPLES_ROOT = "/src/App/Pages/ScrambleTextPage/Examples";

const GLYPH_SETS = ["library", "hexadecimal", "katakana", "binary"] as const;
const GLYPH_SET_MAP: Record<(typeof GLYPH_SETS)[number], string | undefined> = {
    library: undefined,
    hexadecimal: "0123456789ABCDEF",
    katakana: "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ",
    binary: "01",
};

const SETTLE_ORDERS = ["leftToRight", "rightToLeft", "fromMiddle", "scattered"] as const;
const GOLDEN_RATIO_CONJUGATE = 0.618033988749895;
const SINGLE_CHARACTER = 1;
const HALF = 0.5;
const FULL_WEIGHT = 1;

const SETTLE_ORDER_MAP: Record<(typeof SETTLE_ORDERS)[number], ((count: number) => number[]) | undefined> = {
    leftToRight: undefined,
    rightToLeft: (count) =>
        Array.from(
            { length: count },
            (_unused, index) => FULL_WEIGHT - index / Math.max(count - SINGLE_CHARACTER, SINGLE_CHARACTER),
        ),
    fromMiddle: (count) => {
        const middle = (count - SINGLE_CHARACTER) * HALF;

        return Array.from(
            { length: count },
            (_unused, index) => Math.abs(index - middle) / Math.max(middle, SINGLE_CHARACTER),
        );
    },
    scattered: (count) =>
        Array.from({ length: count }, (_unused, index) => (index * GOLDEN_RATIO_CONJUGATE) % FULL_WEIGHT),
};

const STARTING_SETTLE_DURATION_MS = 1000;
const MIN_SETTLE_DURATION_MS = 0;
const MAX_SETTLE_DURATION_MS = 4000;
const SETTLE_DURATION_STEP_MS = 100;
const STARTING_SCRAMBLE_INTERVAL_MS = 50;
const MIN_SCRAMBLE_INTERVAL_MS = 10;
const MAX_SCRAMBLE_INTERVAL_MS = 200;
const SCRAMBLE_INTERVAL_STEP_MS = 5;
const NO_MOTION_DURATION_MS = 0;
const BOX_WIDTH = 320;

export const ScrambleTextPage = () => {
    const [getSettleDurationMs, setSettleDurationMs] = createSignal(STARTING_SETTLE_DURATION_MS);
    const [getScrambleIntervalMs, setScrambleIntervalMs] = createSignal(STARTING_SCRAMBLE_INTERVAL_MS);
    const [getGlyphSet, setGlyphSet] = createSignal<(typeof GLYPH_SETS)[number]>(GLYPH_SETS[0]);
    const [getSettleOrder, setSettleOrder] = createSignal<(typeof SETTLE_ORDERS)[number]>(SETTLE_ORDERS[0]);

    const getPrefersReducedMotion = MediaQueryMonitor.createReducedMotion();

    const getExamples = createMemo(() => {
        const commonProps: ScrambleTextExampleProps = {
            glyphs: () => GLYPH_SET_MAP[getGlyphSet()],
            settleDurationMs: () => (getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : getSettleDurationMs()),
            scrambleIntervalMs: getScrambleIntervalMs,
            computeCharacterWeights: (count) => SETTLE_ORDER_MAP[getSettleOrder()]?.(count) ?? [],
        };

        return [
            {
                key: "headline",
                name: "Headline",
                readout: () => "the controller refuses a restart while a run is still going",
                component: () => (
                    <PageMeasureBox width={() => BOX_WIDTH} padding={() => MEASURE_BOX_PADDING}>
                        <HeadlineExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Headline.tsx`,
            },
            {
                key: "sequential",
                name: "Sequential",
                readout: () =>
                    "one character at a time, each churning inside its own window and landing before the next starts — which needs a run several times longer than a whole-line churn, or there is no time to see anything happen",
                component: () => (
                    <PageMeasureBox width={() => BOX_WIDTH} padding={() => MEASURE_BOX_PADDING}>
                        <SequentialExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Sequential.tsx`,
            },
            {
                key: "swap",
                name: "Swap",
                readout: () => "nothing asks for a restart here — changing the text is what starts the run",
                component: () => (
                    <PageMeasureBox width={() => BOX_WIDTH} padding={() => MEASURE_BOX_PADDING}>
                        <SwapExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Swap.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"settleDurationMs"} label={"Settle duration (ms)"}>
                    <PageNumberField
                        value={getSettleDurationMs}
                        min={() => MIN_SETTLE_DURATION_MS}
                        max={() => MAX_SETTLE_DURATION_MS}
                        step={() => SETTLE_DURATION_STEP_MS}
                        isDisabled={getPrefersReducedMotion}
                        ariaLabel={"Settle duration in milliseconds"}
                        onInput={setSettleDurationMs}
                    />
                </PageProp>

                <PageProp key={"scrambleIntervalMs"} label={"Scramble interval (ms)"}>
                    <PageNumberField
                        value={getScrambleIntervalMs}
                        min={() => MIN_SCRAMBLE_INTERVAL_MS}
                        max={() => MAX_SCRAMBLE_INTERVAL_MS}
                        step={() => SCRAMBLE_INTERVAL_STEP_MS}
                        ariaLabel={"Scramble interval in milliseconds"}
                        onInput={setScrambleIntervalMs}
                    />
                </PageProp>

                <PageProp key={"glyphSet"} label={"Glyphs"}>
                    <PageSelectField
                        value={getGlyphSet}
                        values={() => GLYPH_SETS}
                        ariaLabel={"Glyphs"}
                        onChange={(glyphSet) => setGlyphSet(() => glyphSet)}
                    />
                </PageProp>

                <PageProp key={"settleOrder"} label={"Settle order"}>
                    <PageSelectField
                        value={getSettleOrder}
                        values={() => SETTLE_ORDERS}
                        ariaLabel={"Settle order"}
                        onChange={(settleOrder) => setSettleOrder(() => settleOrder)}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
