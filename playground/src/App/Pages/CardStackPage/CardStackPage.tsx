import { createMemo, createSignal } from "solid-js";

import { CARD_STACK_DEFAULTS } from "@thewaver/ss-components";
import type { SwipeDirection } from "@thewaver/ss-utils";

import { CardStackKnobs } from "../../Knobs/CardStacks.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { DeckExample } from "./Examples/Deck";
import { EndlessExample } from "./Examples/Endless";

const EXAMPLES_ROOT = "/src/App/Pages/CardStackPage/Examples";

const FIELD_WIDTH = 110;

export const CardStackPage = () => {
    const [getIsDisabled, setIsDisabled] = createSignal(CardStackKnobs.STARTING_IS_DISABLED);
    const [getCommitRatio, setCommitRatio] = createSignal(CARD_STACK_DEFAULTS.commitRatio);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(CARD_STACK_DEFAULTS.transitionDurationMs);
    const [getMountedCount, setMountedCount] = createSignal(CARD_STACK_DEFAULTS.mountedCount);
    const [getCardGap, setCardGap] = createSignal(CARD_STACK_DEFAULTS.cardGap);
    const [getFunnelRatio, setFunnelRatio] = createSignal(CARD_STACK_DEFAULTS.funnelRatio);

    const [getLastSend, setLastSend] = createSignal<{ direction: SwipeDirection; card: string }>();
    const [getIsEmpty, setIsEmpty] = createSignal(false);

    const [getLastEndlessSend, setLastEndlessSend] = createSignal<{ direction: SwipeDirection; card: string }>();
    const [getLoadedCount, setLoadedCount] = createSignal(0);

    const getExamples = createMemo(() => [
        {
            key: "deck",
            name: "Deck of cards",
            readout: () => {
                if (getIsEmpty()) return "the pile is empty — deal again to put every card back";

                const last = getLastSend();

                if (!last) return "push the top card any of the four ways, or use the buttons or the arrow keys";

                return `${last.card} went ${last.direction}`;
            },
            component: () => (
                <DeckExample
                    isDisabled={getIsDisabled}
                    commitRatio={getCommitRatio}
                    transitionDurationMs={getTransitionDurationMs}
                    mountedCount={getMountedCount}
                    cardGap={getCardGap}
                    funnelRatio={getFunnelRatio}
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
                const last = getLastEndlessSend();

                if (!last)
                    return "left or right only — an upward push springs back, and on a touch screen it scrolls the page instead";

                return `${last.card} went ${last.direction} — ${getLoadedCount()} cards loaded so far, more arrive as the pile runs low`;
            },
            component: () => (
                <EndlessExample
                    isDisabled={getIsDisabled}
                    commitRatio={getCommitRatio}
                    transitionDurationMs={getTransitionDurationMs}
                    mountedCount={getMountedCount}
                    cardGap={getCardGap}
                    funnelRatio={getFunnelRatio}
                    onSend={(direction, card) => setLastEndlessSend({ direction, card })}
                    onLoad={setLoadedCount}
                />
            ),
            path: `${EXAMPLES_ROOT}/Endless.tsx`,
        },
    ]);

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"isDisabled"}
                    label={"Disabled"}
                    hint={"Turns the stack off, so no card moves by gesture, button or key."}
                >
                    <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp
                    key={"commitRatio"}
                    label={"Commit ratio"}
                    hint={
                        "How far across the stack a card has to be pushed before it leaves. Let go short of it and it springs back."
                    }
                >
                    <PageNumberField
                        value={getCommitRatio}
                        min={() => CardStackKnobs.MIN_COMMIT_RATIO}
                        max={() => CardStackKnobs.MAX_COMMIT_RATIO}
                        step={() => CardStackKnobs.COMMIT_RATIO_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Commit ratio"}
                        onInput={setCommitRatio}
                    />
                </PageProp>

                <PageProp
                    key={"transitionDurationMs"}
                    label={"Duration (ms)"}
                    hint={"How long a card takes to fly out, and how long one that fell short takes to settle back."}
                >
                    <PageNumberField
                        value={getTransitionDurationMs}
                        min={() => CardStackKnobs.MIN_DURATION_MS}
                        max={() => CardStackKnobs.MAX_DURATION_MS}
                        step={() => CardStackKnobs.DURATION_STEP_MS}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Duration in milliseconds"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>

                <PageProp
                    key={"mountedCount"}
                    label={"Mounted cards"}
                    hint={"How many cards are in the document at once, counting the top one."}
                >
                    <PageNumberField
                        value={getMountedCount}
                        min={() => CardStackKnobs.MIN_MOUNTED_COUNT}
                        max={() => CardStackKnobs.MAX_MOUNTED_COUNT}
                        step={() => CardStackKnobs.MOUNTED_COUNT_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Mounted cards"}
                        onInput={setMountedCount}
                    />
                </PageProp>

                <PageProp
                    key={"cardGap"}
                    label={"Card gap (px)"}
                    hint={
                        "How far apart the cards in the pile sit. The bottom one fills the stack's box, and each card above it is lifted by one more of these."
                    }
                >
                    <PageNumberField
                        value={getCardGap}
                        min={() => CardStackKnobs.MIN_CARD_GAP}
                        max={() => CardStackKnobs.MAX_CARD_GAP}
                        step={() => CardStackKnobs.CARD_GAP_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Card gap in pixels"}
                        onInput={setCardGap}
                    />
                </PageProp>

                <PageProp
                    key={"funnelRatio"}
                    label={"Funnel"}
                    hint={
                        "How much narrower each card is than the one in front of it. The top card is the widest and fills the stack; 0 stacks cards of equal width."
                    }
                >
                    <PageNumberField
                        value={getFunnelRatio}
                        min={() => CardStackKnobs.MIN_FUNNEL_RATIO}
                        max={() => CardStackKnobs.MAX_FUNNEL_RATIO}
                        step={() => CardStackKnobs.FUNNEL_RATIO_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Funnel"}
                        onInput={setFunnelRatio}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
