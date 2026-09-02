import { createMemo, createSignal } from "solid-js";

import type { InteractionDragEndReason, InteractionDragRatio, InteractionFlags } from "@thewaver/ss-components";
import type { SwipeDirection } from "@thewaver/ss-utils";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageNumberField } from "../../StyledComponents/Field/Field";
import { CardStackExample } from "./Examples/CardStack";
import { DragExample } from "./Examples/Drag";
import { FlagsExample } from "./Examples/Flags";
import { SwipeExample } from "./Examples/Swipe";

const EXAMPLES_ROOT = "/src/App/Pages/InteractionTrackerPage/Examples";
const RATIO_DIGITS = 2;
const MIN_COMMIT_RATIO = 0.05;
const MAX_COMMIT_RATIO = 0.9;
const COMMIT_RATIO_STEP = 0.05;
const STARTING_COMMIT_RATIO = 0.25;
const FIELD_WIDTH = 110;
const BOX_WIDTH = 300;
const BOX_PADDING = 10;
const SWIPE_HEIGHT = 140;
const STACK_HEIGHT = 200;

export const InteractionTrackerPage = () => {
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getIsReachable, setIsReachable] = createSignal(false);
    const [getCommitRatio, setCommitRatio] = createSignal(STARTING_COMMIT_RATIO);

    const [getFlags, setFlags] = createSignal<InteractionFlags>({});
    const [getDragRatio, setDragRatio] = createSignal<InteractionDragRatio>();
    const [getDragEndReason, setDragEndReason] = createSignal<InteractionDragEndReason>();
    const [getSwipeProgress, setSwipeProgress] = createSignal(0);
    const [getSwipeVerdict, setSwipeVerdict] = createSignal<SwipeDirection | "nothing">();
    const [getStackProgress, setStackProgress] = createSignal(0);
    const [getStackVerdict, setStackVerdict] = createSignal<SwipeDirection | "nothing">();

    const getExamples = createMemo(() => [
        {
            key: "flags",
            name: "Flags",
            readout: () => {
                const flags = getFlags();

                return `hovered: ${flags.isHovered ?? false} — focused: ${flags.isFocused ?? false} — active: ${flags.isActive ?? false}`;
            },
            component: () => (
                <FlagsExample isDisabled={getIsDisabled} isReachable={getIsReachable} onFlagsChange={setFlags} />
            ),
            path: `${EXAMPLES_ROOT}/Flags.tsx`,
        },
        {
            key: "drag",
            name: "Drag",
            readout: () => {
                const ratio = getDragRatio();

                if (!ratio) return "press anywhere on the pad — it answers on the press, not on the first move";

                return `x: ${ratio.x.toFixed(RATIO_DIGITS)} — y: ${ratio.y.toFixed(RATIO_DIGITS)} — ended by: ${getDragEndReason() ?? "still going"}`;
            },
            component: () => (
                <DragExample isDisabled={getIsDisabled} onDrag={setDragRatio} onDragEnd={setDragEndReason} />
            ),
            path: `${EXAMPLES_ROOT}/Drag.tsx`,
        },
        {
            key: "swipe",
            name: "Swipe",
            readout: () =>
                `travel: ${getSwipeProgress().toFixed(RATIO_DIGITS)} of the card's own width — last verdict: ${getSwipeVerdict() ?? "none yet"}`,
            component: () => (
                <PageMeasureBox width={() => BOX_WIDTH} height={() => SWIPE_HEIGHT} padding={() => BOX_PADDING}>
                    <SwipeExample
                        isDisabled={getIsDisabled}
                        commitRatio={getCommitRatio}
                        onSwipe={setSwipeProgress}
                        onSwipeEnd={(direction) => {
                            setSwipeProgress(0);
                            setSwipeVerdict(direction ?? "nothing");
                        }}
                    />
                </PageMeasureBox>
            ),
            path: `${EXAMPLES_ROOT}/Swipe.tsx`,
        },
        {
            key: "cardStack",
            name: "Card stack",
            readout: () =>
                `travel: ${getStackProgress().toFixed(RATIO_DIGITS)} of the card's own width — last verdict: ${getStackVerdict() ?? "none yet"} — the deck re-deals once it is empty`,
            component: () => (
                <PageMeasureBox width={() => BOX_WIDTH} height={() => STACK_HEIGHT} padding={() => BOX_PADDING}>
                    <CardStackExample
                        isDisabled={getIsDisabled}
                        commitRatio={getCommitRatio}
                        onSwipe={setStackProgress}
                        onSwipeEnd={(direction) => {
                            setStackProgress(0);
                            setStackVerdict(direction ?? "nothing");
                        }}
                    />
                </PageMeasureBox>
            ),
            path: `${EXAMPLES_ROOT}/CardStack.tsx`,
        },
    ]);

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"isDisabled"} label={"Disabled"}>
                    <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp key={"isReachable"} label={"Reachable while disabled"}>
                    <PageCheckField
                        value={getIsReachable}
                        ariaLabel={"Reachable while disabled"}
                        onChange={setIsReachable}
                    />
                </PageProp>

                <PageProp key={"commitRatio"} label={"Swipe commit ratio"}>
                    <PageNumberField
                        value={getCommitRatio}
                        min={() => MIN_COMMIT_RATIO}
                        max={() => MAX_COMMIT_RATIO}
                        step={() => COMMIT_RATIO_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Swipe commit ratio"}
                        onInput={setCommitRatio}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
