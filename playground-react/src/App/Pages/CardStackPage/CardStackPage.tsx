import { useState } from "react";

import { CARD_STACK_DEFAULTS } from "@thewaver/ss-components-react";
import { CardStackKnobs } from "@thewaver/ss-playground-core/App/Knobs/CardStacks.const";
import type { SwipeDirection } from "@thewaver/ss-utils";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { DeckExample } from "./Examples/Deck";
import { EndlessExample } from "./Examples/Endless";

const EXAMPLES_ROOT = "/src/App/Pages/CardStackPage/Examples";

const FIELD_WIDTH = 110;

export const CardStackPage = () => {
    const [isDisabled, setIsDisabled] = useState(CardStackKnobs.STARTING_IS_DISABLED);
    const [commitRatio, setCommitRatio] = useState(CARD_STACK_DEFAULTS.commitRatio);
    const [transitionDurationMs, setTransitionDurationMs] = useState(CARD_STACK_DEFAULTS.transitionDurationMs);
    const [mountedCount, setMountedCount] = useState(CARD_STACK_DEFAULTS.mountedCount);
    const [cardGap, setCardGap] = useState(CARD_STACK_DEFAULTS.cardGap);
    const [funnelRatio, setFunnelRatio] = useState(CARD_STACK_DEFAULTS.funnelRatio);

    const [lastSend, setLastSend] = useState<{ direction: SwipeDirection; card: string }>();
    const [isEmpty, setIsEmpty] = useState(false);

    const [lastEndlessSend, setLastEndlessSend] = useState<{ direction: SwipeDirection; card: string }>();
    const [loadedCount, setLoadedCount] = useState(0);

    const examples = [
        {
            key: "deck",
            name: "Deck of cards",
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
            name: "A deck that never runs out",
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
                <PageProp
                    itemKey={"isDisabled"}
                    label={"Disabled"}
                    hint={"Turns the stack off, so no card moves by gesture, button or key."}
                >
                    <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp
                    itemKey={"commitRatio"}
                    label={"Commit ratio"}
                    hint={
                        "How far across the stack a card has to be pushed before it leaves. Let go short of it and it springs back."
                    }
                >
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

                <PageProp
                    itemKey={"transitionDurationMs"}
                    label={"Duration (ms)"}
                    hint={"How long a card takes to fly out, and how long one that fell short takes to settle back."}
                >
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

                <PageProp
                    itemKey={"mountedCount"}
                    label={"Mounted cards"}
                    hint={"How many cards are in the document at once, counting the top one."}
                >
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

                <PageProp
                    itemKey={"cardGap"}
                    label={"Card gap (px)"}
                    hint={
                        "How far apart the cards in the pile sit. The bottom one fills the stack's box, and each card above it is lifted by one more of these."
                    }
                >
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

                <PageProp
                    itemKey={"funnelRatio"}
                    label={"Funnel"}
                    hint={
                        "How much narrower each card is than the one in front of it. The top card is the widest and fills the stack; 0 stacks cards of equal width."
                    }
                >
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
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
