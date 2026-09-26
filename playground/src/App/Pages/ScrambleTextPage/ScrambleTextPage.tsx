import { createMemo, createSignal } from "solid-js";

import {
    MediaQueryMonitorUtils,
    SCRAMBLE_TEXT_DEFAULTS,
    ScrambleTextGlyphs,
    ScrambleTextWeights,
} from "@thewaver/ss-components";

import { ScrambleTextKnobs } from "../../Knobs/ScrambleTexts.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { ChangedOnlyExample } from "./Examples/ChangedOnly";
import { HeadlineExample } from "./Examples/Headline";
import { SequentialExample } from "./Examples/Sequential";
import { SwapExample } from "./Examples/Swap";
import type { ScrambleTextExampleProps } from "./ScrambleTextPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/ScrambleTextPage/Examples";

const NO_MOTION_DURATION_MS = 0;

export const ScrambleTextPage = () => {
    const [getSettleDurationMs, setSettleDurationMs] = createSignal(SCRAMBLE_TEXT_DEFAULTS.settleDurationMs);
    const [getScrambleIntervalMs, setScrambleIntervalMs] = createSignal(SCRAMBLE_TEXT_DEFAULTS.scrambleIntervalMs);
    const [getGlyphSet, setGlyphSet] = createSignal<(typeof ScrambleTextKnobs.GLYPH_SETS)[number]>(
        ScrambleTextKnobs.STARTING_GLYPH_SET,
    );
    const [getSettleOrder, setSettleOrder] = createSignal<(typeof ScrambleTextKnobs.SETTLE_ORDERS)[number]>(
        ScrambleTextKnobs.STARTING_SETTLE_ORDER,
    );

    const getPrefersReducedMotion = MediaQueryMonitorUtils.createReducedMotion();

    const getExamples = createMemo(() => {
        const commonProps: ScrambleTextExampleProps = {
            settleDurationMs: () => (getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : getSettleDurationMs()),
            scrambleIntervalMs: getScrambleIntervalMs,
            computeGlyphs: (character) => {
                const glyphSet = getGlyphSet();

                return glyphSet === "library"
                    ? SCRAMBLE_TEXT_DEFAULTS.computeGlyphs()
                    : ScrambleTextGlyphs.SAMPLE_GLYPHS[glyphSet](character);
            },
            computeCharacterWeights: (count) => {
                const settleOrder = getSettleOrder();

                return settleOrder === "leftToRight" ? [] : ScrambleTextWeights.SAMPLE_WEIGHTS[settleOrder](count);
            },
        };

        return [
            {
                key: "headline",
                name: "Headline",
                readout: () =>
                    "a restart asked for mid-run throws away the run in progress and plays again from the start",
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
            {
                key: "changedOnly",
                name: "Changed Only",
                readout: () =>
                    "only what differs from the last text scrambles, and the characters an insertion pushes along stay put",
                component: () => <ChangedOnlyExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/ChangedOnly.tsx`,
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
                        min={() => ScrambleTextKnobs.MIN_SETTLE_DURATION_MS}
                        max={() => ScrambleTextKnobs.MAX_SETTLE_DURATION_MS}
                        step={() => ScrambleTextKnobs.SETTLE_DURATION_STEP_MS}
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
                        min={() => ScrambleTextKnobs.MIN_SCRAMBLE_INTERVAL_MS}
                        max={() => ScrambleTextKnobs.MAX_SCRAMBLE_INTERVAL_MS}
                        step={() => ScrambleTextKnobs.SCRAMBLE_INTERVAL_STEP_MS}
                        ariaLabel={"Scramble interval in milliseconds"}
                        onInput={setScrambleIntervalMs}
                    />
                </PageProp>

                <PageProp
                    key={"glyphSet"}
                    label={"Glyphs"}
                    hint={
                        "Which characters the unsettled positions are drawn from. Matched churns a digit among digits and a letter among letters of its own case."
                    }
                >
                    <PageSelectField
                        value={getGlyphSet}
                        values={() => ScrambleTextKnobs.GLYPH_SETS}
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
                        values={() => ScrambleTextKnobs.SETTLE_ORDERS}
                        ariaLabel={"Settle order"}
                        onChange={(settleOrder) => setSettleOrder(() => settleOrder)}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
