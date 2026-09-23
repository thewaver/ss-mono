import { createMemo, createSignal } from "solid-js";

import { CARD_STACK_DEFAULTS } from "@thewaver/ss-components";
import type { SwipeDirection } from "@thewaver/ss-utils";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageNumberField } from "../../StyledComponents/Field/Field";
import { DeckExample } from "./Examples/Deck";

const EXAMPLES_ROOT = "/src/App/Pages/CardStackPage/Examples";

const MIN_COMMIT_RATIO = 0.05;
const MAX_COMMIT_RATIO = 0.9;
const COMMIT_RATIO_STEP = 0.05;

const MIN_DURATION_MS = 0;
const MAX_DURATION_MS = 2000;
const DURATION_STEP_MS = 50;

const MIN_MOUNTED_COUNT = 1;
const MAX_MOUNTED_COUNT = 13;
const MOUNTED_COUNT_STEP = 1;

const MIN_CARD_GAP = 0;
const MAX_CARD_GAP = 12;
const CARD_GAP_STEP = 2;

const MIN_FUNNEL_RATIO = 0;
const MAX_FUNNEL_RATIO = 0.25;
const FUNNEL_RATIO_STEP = 0.01;

const FIELD_WIDTH = 110;

export const CardStackPage = () => {
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getCommitRatio, setCommitRatio] = createSignal(CARD_STACK_DEFAULTS.commitRatio);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(CARD_STACK_DEFAULTS.transitionDurationMs);
    const [getMountedCount, setMountedCount] = createSignal(CARD_STACK_DEFAULTS.mountedCount);
    const [getCardGap, setCardGap] = createSignal(CARD_STACK_DEFAULTS.cardGap);
    const [getFunnelRatio, setFunnelRatio] = createSignal(CARD_STACK_DEFAULTS.funnelRatio);

    const [getLastSend, setLastSend] = createSignal<{ direction: SwipeDirection; card: string }>();
    const [getIsEmpty, setIsEmpty] = createSignal(false);

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
                />
            ),
            path: `${EXAMPLES_ROOT}/Deck.tsx`,
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
                        min={() => MIN_COMMIT_RATIO}
                        max={() => MAX_COMMIT_RATIO}
                        step={() => COMMIT_RATIO_STEP}
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
                        min={() => MIN_DURATION_MS}
                        max={() => MAX_DURATION_MS}
                        step={() => DURATION_STEP_MS}
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
                        min={() => MIN_MOUNTED_COUNT}
                        max={() => MAX_MOUNTED_COUNT}
                        step={() => MOUNTED_COUNT_STEP}
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
                        min={() => MIN_CARD_GAP}
                        max={() => MAX_CARD_GAP}
                        step={() => CARD_GAP_STEP}
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
                        min={() => MIN_FUNNEL_RATIO}
                        max={() => MAX_FUNNEL_RATIO}
                        step={() => FUNNEL_RATIO_STEP}
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
