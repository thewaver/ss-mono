import { useState } from "react";

import { CARD_STACK_DEFAULTS, CARD_STACK_PILE_SIDES } from "@thewaver/ss-components-react";
import { CardStackKnobs } from "@thewaver/ss-playground/App/Knobs/CardStacks.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/CardStackPage/CardStackPage.const";
import type { SwipeDirection } from "@thewaver/ss-utils";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { DeckExample } from "./Examples/Deck";
import { EndlessExample } from "./Examples/Endless";

export const CardStackPage = () => {
    const [isDisabled, setIsDisabled] = useState(CardStackKnobs.STARTING_IS_DISABLED);
    const [commitRatio, setCommitRatio] = useState(CARD_STACK_DEFAULTS.commitRatio);
    const [transitionDurationMs, setTransitionDurationMs] = useState(CARD_STACK_DEFAULTS.transitionDurationMs);
    const [mountedCount, setMountedCount] = useState(CARD_STACK_DEFAULTS.mountedCount);
    const [cardGap, setCardGap] = useState(CARD_STACK_DEFAULTS.cardGap);
    const [funnelRatio, setFunnelRatio] = useState(CARD_STACK_DEFAULTS.funnelRatio);
    const [pileSide, setPileSide] = useState(CARD_STACK_DEFAULTS.pileSide);

    const [lastSend, setLastSend] = useState<{ direction: SwipeDirection; card: string }>();
    const [isEmpty, setIsEmpty] = useState(false);

    const [lastEndlessSend, setLastEndlessSend] = useState<{ direction: SwipeDirection; card: string }>();
    const [loadedCount, setLoadedCount] = useState(0);

    const examples = [
        {
            key: "deck",
            name: EXAMPLE_NAMES.deck,
            readout: () => {
                if (isEmpty) return "the pile is empty — deal again to put every card back";

                if (!lastSend) return "push the top card any of the four ways, or use the buttons or the arrow keys";

                return `${lastSend.card} went ${lastSend.direction}`;
            },
            component: () => (
                <DeckExample
                    isDisabled={isDisabled}
                    commitRatio={commitRatio}
                    transitionDurationMs={transitionDurationMs}
                    mountedCount={mountedCount}
                    cardGap={cardGap}
                    funnelRatio={funnelRatio}
                    pileSide={pileSide}
                    onSend={(direction, card) => setLastSend({ direction, card })}
                    onEmpty={() => setIsEmpty(true)}
                    onDeal={() => {
                        setIsEmpty(false);
                        setLastSend(undefined);
                    }}
                    onRecall={() => setIsEmpty(false)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Deck.tsx`,
        },
        {
            key: "endless",
            name: EXAMPLE_NAMES.endless,
            readout: () => {
                if (!lastEndlessSend)
                    return "left or right only — an upward push springs back, and on a touch screen it scrolls the page instead";

                return `${lastEndlessSend.card} went ${lastEndlessSend.direction} — ${loadedCount} cards loaded so far, more arrive as the pile runs low`;
            },
            component: () => (
                <EndlessExample
                    isDisabled={isDisabled}
                    commitRatio={commitRatio}
                    transitionDurationMs={transitionDurationMs}
                    mountedCount={mountedCount}
                    cardGap={cardGap}
                    funnelRatio={funnelRatio}
                    pileSide={pileSide}
                    onSend={(direction, card) => setLastEndlessSend({ direction, card })}
                    onLoad={setLoadedCount}
                />
            ),
            path: `${EXAMPLES_ROOT}/Endless.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp itemKey={"isDisabled"} {...CardStackKnobs.IS_DISABLED_TEXT}>
                    <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp itemKey={"commitRatio"} {...CardStackKnobs.COMMIT_RATIO_TEXT}>
                    <PageNumberField
                        value={commitRatio}
                        min={CardStackKnobs.MIN_COMMIT_RATIO}
                        max={CardStackKnobs.MAX_COMMIT_RATIO}
                        step={CardStackKnobs.COMMIT_RATIO_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Commit ratio"}
                        onInput={setCommitRatio}
                    />
                </PageProp>

                <PageProp itemKey={"transitionDurationMs"} {...CardStackKnobs.TRANSITION_DURATION_MS_TEXT}>
                    <PageNumberField
                        value={transitionDurationMs}
                        min={CardStackKnobs.MIN_DURATION_MS}
                        max={CardStackKnobs.MAX_DURATION_MS}
                        step={CardStackKnobs.DURATION_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Duration in milliseconds"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>

                <PageProp itemKey={"mountedCount"} {...CardStackKnobs.MOUNTED_COUNT_TEXT}>
                    <PageNumberField
                        value={mountedCount}
                        min={CardStackKnobs.MIN_MOUNTED_COUNT}
                        max={CardStackKnobs.MAX_MOUNTED_COUNT}
                        step={CardStackKnobs.MOUNTED_COUNT_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Mounted cards"}
                        onInput={setMountedCount}
                    />
                </PageProp>

                <PageProp itemKey={"cardGap"} {...CardStackKnobs.CARD_GAP_TEXT}>
                    <PageNumberField
                        value={cardGap}
                        min={CardStackKnobs.MIN_CARD_GAP}
                        max={CardStackKnobs.MAX_CARD_GAP}
                        step={CardStackKnobs.CARD_GAP_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Card gap in pixels"}
                        onInput={setCardGap}
                    />
                </PageProp>

                <PageProp itemKey={"funnelRatio"} {...CardStackKnobs.FUNNEL_RATIO_TEXT}>
                    <PageNumberField
                        value={funnelRatio}
                        min={CardStackKnobs.MIN_FUNNEL_RATIO}
                        max={CardStackKnobs.MAX_FUNNEL_RATIO}
                        step={CardStackKnobs.FUNNEL_RATIO_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Funnel"}
                        onInput={setFunnelRatio}
                    />
                </PageProp>

                <PageProp itemKey={"pileSide"} {...CardStackKnobs.PILE_SIDE_TEXT}>
                    <PageSelectField
                        value={pileSide}
                        values={CARD_STACK_PILE_SIDES}
                        ariaLabel={"Pile side"}
                        onChange={(side) => setPileSide(side)}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
