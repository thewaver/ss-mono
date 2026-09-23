import { createMemo, createSignal } from "solid-js";

import { MediaQueryMonitorUtils, SCRAMBLE_TEXT_DEFAULTS } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField, PageSelectField } from "../../StyledComponents/Field/Field";
import { HeadlineExample } from "./Examples/Headline";
import { SequentialExample } from "./Examples/Sequential";
import { SwapExample } from "./Examples/Swap";
import type { ScrambleTextExampleProps } from "./ScrambleTextPage.types";

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

const MIN_SETTLE_DURATION_MS = 0;
const MAX_SETTLE_DURATION_MS = 4000;
const SETTLE_DURATION_STEP_MS = 100;
const MIN_SCRAMBLE_INTERVAL_MS = 10;
const MAX_SCRAMBLE_INTERVAL_MS = 200;
const SCRAMBLE_INTERVAL_STEP_MS = 5;
const NO_MOTION_DURATION_MS = 0;

export const ScrambleTextPage = () => {
    const [getSettleDurationMs, setSettleDurationMs] = createSignal(SCRAMBLE_TEXT_DEFAULTS.settleDurationMs);
    const [getScrambleIntervalMs, setScrambleIntervalMs] = createSignal(SCRAMBLE_TEXT_DEFAULTS.scrambleIntervalMs);
    const [getGlyphSet, setGlyphSet] = createSignal<(typeof GLYPH_SETS)[number]>(GLYPH_SETS[0]);
    const [getSettleOrder, setSettleOrder] = createSignal<(typeof SETTLE_ORDERS)[number]>(SETTLE_ORDERS[0]);

    const getPrefersReducedMotion = MediaQueryMonitorUtils.createReducedMotion();

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
                component: () => <HeadlineExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Headline.tsx`,
            },
            {
                key: "sequential",
                name: "Sequential",
                readout: () =>
                    "one character at a time, each churning inside its own window and landing before the next starts — which needs a run several times longer than a whole-line churn, or there is no time to see anything happen",
                component: () => <SequentialExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Sequential.tsx`,
            },
            {
                key: "swap",
                name: "Swap",
                readout: () => "nothing asks for a restart here — changing the text is what starts the run",
                component: () => <SwapExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Swap.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"settleDurationMs"}
                    label={"Settle duration (ms)"}
                    hint={
                        "How long the text takes to go from all scrambled to fully settled. It is off while the visitor has asked for reduced motion."
                    }
                >
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

                <PageProp
                    key={"scrambleIntervalMs"}
                    label={"Scramble interval (ms)"}
                    hint={
                        "How often an unsettled character is swapped for another. Shorter intervals make a busier churn."
                    }
                >
                    <PageNumberField
                        value={getScrambleIntervalMs}
                        min={() => MIN_SCRAMBLE_INTERVAL_MS}
                        max={() => MAX_SCRAMBLE_INTERVAL_MS}
                        step={() => SCRAMBLE_INTERVAL_STEP_MS}
                        ariaLabel={"Scramble interval in milliseconds"}
                        onInput={setScrambleIntervalMs}
                    />
                </PageProp>

                <PageProp
                    key={"glyphSet"}
                    label={"Glyphs"}
                    hint={"Which characters the unsettled positions are drawn from."}
                >
                    <PageSelectField
                        value={getGlyphSet}
                        values={() => GLYPH_SETS}
                        ariaLabel={"Glyphs"}
                        onChange={(glyphSet) => setGlyphSet(() => glyphSet)}
                    />
                </PageProp>

                <PageProp
                    key={"settleOrder"}
                    label={"Settle order"}
                    hint={
                        "The order the characters settle in: left to right, from the middle out, at random, and so on."
                    }
                >
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
