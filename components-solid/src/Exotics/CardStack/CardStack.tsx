import { For, batch, createMemo, createSignal, on, onCleanup, onMount } from "solid-js";

import {
    CARD_STACK_DEFAULTS,
    type CardStackCardState,
    CardStackUtils,
    CardStackStyles as styles,
} from "@thewaver/ss-components";
import type { SwipeDirection } from "@thewaver/ss-utils";

import { InteractionTrackerSolidUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerSolid.utils";
import { SignalMirrorSolidUtils } from "../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { access } from "../../Utils/propUtils";
import { accessStore } from "../../Utils/storeUtils";
import type { CardStackControls, CardStackProps } from "./CardStackSolid.types";

const MIN_MOUNTED_COUNT = 1;
const FIRST_INDEX = 0;
const TOP_DEPTH = 0;

export const CardStack = <T,>(props: CardStackProps<T>) => {
    const [getTopIndex, setTopIndex] = SignalMirrorSolidUtils.createOptional(() => props.topIndexSignal, FIRST_INDEX);

    const [getPileRef, setPileRef] = createSignal<HTMLElement>();

    const getCards = createMemo(() => access(props.cards));

    const getCommitRatio = createMemo(() => access(props.commitRatio) ?? CARD_STACK_DEFAULTS.commitRatio);

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? CARD_STACK_DEFAULTS.transitionDurationMs,
    );

    const getMountedCount = createMemo(() =>
        Math.max(access(props.mountedCount) ?? CARD_STACK_DEFAULTS.mountedCount, MIN_MOUNTED_COUNT),
    );

    const getCardGap = createMemo(() => access(props.cardGap) ?? CARD_STACK_DEFAULTS.cardGap);

    const getFunnelRatio = createMemo(() => access(props.funnelRatio) ?? CARD_STACK_DEFAULTS.funnelRatio);

    const getPileExtentPx = createMemo(() => CardStackUtils.getPileExtentPx(getMountedCount(), getCardGap()));

    const getAllowedDirections = createMemo(
        () => access(props.allowedDirections) ?? CARD_STACK_DEFAULTS.allowedDirections,
    );

    const getSwipeAxis = createMemo(() => CardStackUtils.getSwipeAxis(getAllowedDirections()));

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getIsEmpty = createMemo(() => getTopIndex() >= getCards().length);

    const getMounted = createMemo(() => CardStackUtils.getMounted(getCards(), getTopIndex(), getMountedCount()));

    const getMountedIndices = createMemo(() => getMounted().map((entry) => entry.index));

    const pile = CardStackUtils.createPile<T>({
        getCards,
        getTopIndex,
        setTopIndex: (index) => setTopIndex(index),
        getIsDisabled,
        getAllowedDirections,
        getTransitionDurationMs,
        onSend: (direction, card, index) => void props.onSend?.(direction, card, index),
        onEmpty: () => void props.onEmpty?.(),
        batch,
    });

    onCleanup(() => pile.stop());

    const getMotion = accessStore(pile.motion);

    const controls: CardStackControls = {
        getTopIndex,
        getIsEmpty,
        send: pile.send,
        recall: pile.recall,
        deal: pile.deal,
    };

    const getIsSwipeDisabled = () => getIsDisabled() || getIsEmpty() || getAllowedDirections().length === 0;

    const getSwipeTracker = createMemo(
        on(getSwipeAxis, (axis) =>
            axis === undefined
                ? InteractionTrackerSolidUtils.trackFreeSwipe(getPileRef, getIsSwipeDisabled, {
                      getCommitRatio,
                      onSwipe: pile.push,
                      onSwipeEnd: pile.release,
                  })
                : InteractionTrackerSolidUtils.trackAxialSwipe(getPileRef, getIsSwipeDisabled, {
                      getAxis: () => axis,
                      getCommitRatio,
                      onSwipe: (ratio) => pile.push(axis === "horizontal" ? { x: ratio, y: 0 } : { x: 0, y: ratio }),
                      onSwipeEnd: pile.release,
                  }),
        ),
    );

    const getIsSwiping = () => getSwipeTracker().getIsSwiping();

    const getCardTransform = (depth: number) =>
        CardStackUtils.getCardTransform(depth, {
            mountedLength: getMounted().length,
            pileExtentPx: getPileExtentPx(),
            cardGap: getCardGap(),
            motion: getMotion(),
        });

    const getCardTransitionDurationMs = (depth: number) =>
        CardStackUtils.getCardTransitionDurationMs(depth, {
            isSwiping: getIsSwiping(),
            motion: getMotion(),
            durationMs: getTransitionDurationMs(),
        });

    const onKeyDown = (e: KeyboardEvent) => {
        const direction: SwipeDirection | undefined = CardStackUtils.getKeyDirection(e.key);

        if (direction === undefined || !pile.send(direction)) return;

        e.preventDefault();
    };

    onMount(() => {
        props.onMount?.(controls);
    });

    return (
        <div
            ref={setPileRef}
            class={styles.cardStackRoot}
            role="group"
            aria-roledescription={access(props.roleDescription) ?? CARD_STACK_DEFAULTS.roleDescription}
            aria-label={access(props.ariaLabel)}
            aria-disabled={getIsDisabled() ? "true" : undefined}
            tabindex={0}
            onKeyDown={onKeyDown}
        >
            <For each={getMountedIndices()}>
                {(index, getDepth) => {
                    const getIsTop = createMemo(() => getDepth() === TOP_DEPTH);

                    const getState = createMemo((): CardStackCardState<T> => ({
                        card: getCards()[index],
                        index,
                        depth: getDepth(),
                        isTop: getIsTop(),
                        ...CardStackUtils.getCardMotion(getIsTop(), getMotion()),
                    }));

                    return (
                        <div
                            class={styles.cardStackCard}
                            style={{
                                "z-index": getMounted().length - getDepth(),
                                "width": CardStackUtils.getCardWidth(getDepth(), getFunnelRatio()),
                                "height": CardStackUtils.getCardHeight(getPileExtentPx()),
                                "transform": getCardTransform(getDepth()),
                                "transition-duration": `${getCardTransitionDurationMs(getDepth())}ms`,
                            }}
                            role="group"
                            aria-roledescription={
                                access(props.cardRoleDescription) ?? CARD_STACK_DEFAULTS.cardRoleDescription
                            }
                            aria-label={props.computeCardLabel(getCards()[index], index)}
                            aria-hidden={getIsTop() ? undefined : "true"}
                            inert={!getIsTop()}
                        >
                            {props.renderCard(getState)}
                        </div>
                    );
                }}
            </For>
        </div>
    );
};
