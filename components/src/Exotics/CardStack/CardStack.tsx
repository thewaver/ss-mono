import { For, batch, createMemo, createSignal, on, onCleanup, onMount } from "solid-js";

import { GestureUtils } from "@thewaver/ss-utils";
import type { Point2d, SwipeAxis, SwipeDirection } from "@thewaver/ss-utils";

import type { InteractionDragRatio } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import { InteractionTrackerUtils } from "../../Abstracts/InteractionTracker/InteractionTracker.utils";
import { SignalMirrorUtils } from "../../Abstracts/SignalMirror/SignalMirror.utils";
import { access } from "../../Utils/propUtils";
import { CARD_STACK_DEFAULTS } from "./CardStack.const";
import type { CardStackCardState, CardStackControls, CardStackProps } from "./CardStack.types";

import * as styles from "./CardStack.css";

const MIN_MOUNTED_COUNT = 1;
const FIRST_INDEX = 0;
const TOP_DEPTH = 0;
const BOTTOM_STEP = 1;
const SINGLE_AXIS = 1;
const FULL_WIDTH = 1;
const NO_WIDTH = 0;
const PERCENT = 100;
const NO_DURATION = 0;

const NO_TRAVEL: InteractionDragRatio = { x: 0, y: 0 };

const LEAVE_RATIO = 1.5;

const LEAVE_OFFSETS: Record<SwipeDirection, Point2d> = {
    left: { x: -LEAVE_RATIO, y: 0 },
    right: { x: LEAVE_RATIO, y: 0 },
    up: { x: 0, y: -LEAVE_RATIO },
    down: { x: 0, y: LEAVE_RATIO },
};

const KEY_DIRECTIONS: Record<string, SwipeDirection> = {
    ArrowLeft: "left",
    ArrowRight: "right",
    ArrowUp: "up",
    ArrowDown: "down",
};

export const CardStack = <T,>(props: CardStackProps<T>) => {
    const [getTopIndex, setTopIndex] = SignalMirrorUtils.createOptional(() => props.topIndexSignal, FIRST_INDEX);

    const [getPileRef, setPileRef] = createSignal<HTMLElement>();
    const [getTravel, setTravel] = createSignal(NO_TRAVEL);
    const [getLeavingTo, setLeavingTo] = createSignal<SwipeDirection>();
    const [getReturningFrom, setReturningFrom] = createSignal<SwipeDirection>();

    const departures = new Map<number, SwipeDirection>();

    let leaveTimeout: ReturnType<typeof setTimeout> | undefined;
    let returnFrame: ReturnType<typeof requestAnimationFrame> | undefined;

    const cancelReturn = () => {
        if (returnFrame !== undefined) cancelAnimationFrame(returnFrame);

        returnFrame = undefined;
    };

    onCleanup(() => {
        clearTimeout(leaveTimeout);
        cancelReturn();
    });

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

    const getPileExtentPx = createMemo(() => (getMountedCount() - BOTTOM_STEP) * getCardGap());

    const getAllowedDirections = createMemo(
        () => access(props.allowedDirections) ?? CARD_STACK_DEFAULTS.allowedDirections,
    );

    const getSwipeAxis = createMemo((): SwipeAxis | undefined => {
        const axes = new Set(getAllowedDirections().map(GestureUtils.computeSwipeAxis));

        return axes.size === SINGLE_AXIS ? [...axes][0] : undefined;
    });

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getIsMoving = () => getLeavingTo() !== undefined || getReturningFrom() !== undefined;

    const getIsEmpty = createMemo(() => getTopIndex() >= getCards().length);

    const getMounted = createMemo(() => {
        const from = Math.max(getTopIndex(), FIRST_INDEX);

        return getCards()
            .slice(from, from + getMountedCount())
            .map((card, offset) => ({ card, index: from + offset }));
    });

    const getCardLabel = (card: T, index: number) => props.computeCardLabel(card, index);

    const send = (direction: SwipeDirection) => {
        const cards = getCards();
        const index = getTopIndex();

        if (getIsDisabled() || getIsMoving() || index >= cards.length) return false;
        if (!getAllowedDirections().includes(direction)) return false;

        const card = cards[index]!;

        setTravel(NO_TRAVEL);
        setLeavingTo(direction);

        clearTimeout(leaveTimeout);

        leaveTimeout = setTimeout(() => {
            departures.set(index, direction);

            setLeavingTo(undefined);
            setTopIndex(index + 1);

            void props.onSend?.(direction, card, index);

            if (getIsEmpty()) void props.onEmpty?.();
        }, getTransitionDurationMs());

        return true;
    };

    const recall = () => {
        const previous = Math.min(getTopIndex(), getCards().length) - BOTTOM_STEP;

        if (getIsDisabled() || getIsMoving() || previous < FIRST_INDEX) return false;

        const direction = departures.get(previous);

        departures.delete(previous);

        const isFlying = direction !== undefined && getTransitionDurationMs() !== NO_DURATION;

        batch(() => {
            setTravel(NO_TRAVEL);
            setReturningFrom(isFlying ? direction : undefined);
            setTopIndex(previous);
        });

        if (!isFlying) return true;

        returnFrame = requestAnimationFrame(() => {
            returnFrame = requestAnimationFrame(() => {
                returnFrame = undefined;

                setReturningFrom(undefined);
            });
        });

        return true;
    };

    const deal = () => {
        if (getTopIndex() === FIRST_INDEX && !getIsMoving()) return false;

        clearTimeout(leaveTimeout);
        cancelReturn();
        departures.clear();

        batch(() => {
            setLeavingTo(undefined);
            setReturningFrom(undefined);
            setTravel(NO_TRAVEL);
            setTopIndex(FIRST_INDEX);
        });

        return true;
    };

    const controls: CardStackControls = { getTopIndex, getIsEmpty, send, recall, deal };

    const getIsSwipeDisabled = () => getIsDisabled() || getIsEmpty() || getAllowedDirections().length === 0;

    const onSwipeEnd = (direction: SwipeDirection | undefined) => {
        setTravel(NO_TRAVEL);

        if (direction === undefined) return;

        send(direction);
    };

    const getSwipeTracker = createMemo(
        on(getSwipeAxis, (axis) =>
            axis === undefined
                ? InteractionTrackerUtils.trackFreeSwipe(getPileRef, getIsSwipeDisabled, {
                      getCommitRatio,
                      onSwipe: setTravel,
                      onSwipeEnd,
                  })
                : InteractionTrackerUtils.trackAxialSwipe(getPileRef, getIsSwipeDisabled, {
                      getAxis: () => axis,
                      getCommitRatio,
                      onSwipe: (ratio) => setTravel(axis === "horizontal" ? { x: ratio, y: 0 } : { x: 0, y: ratio }),
                      onSwipeEnd,
                  }),
        ),
    );

    const getIsSwiping = () => getSwipeTracker().getIsSwiping();

    const getCardHeight = () => `calc(${PERCENT}% - ${getPileExtentPx()}px)`;

    const getCardWidth = (depth: number) => `${Math.max(FULL_WIDTH - depth * getFunnelRatio(), NO_WIDTH) * PERCENT}%`;

    const getStackOffsetPx = (depth: number) =>
        getPileExtentPx() - (getMounted().length - BOTTOM_STEP - depth) * getCardGap();

    const getCardTransform = (depth: number) => {
        const stacked = `translateY(${getStackOffsetPx(depth)}px)`;

        if (depth !== TOP_DEPTH) return stacked;

        const away = getLeavingTo() ?? getReturningFrom();
        const offset = away === undefined ? getTravel() : LEAVE_OFFSETS[away];

        return `translate(${offset.x * PERCENT}%, ${offset.y * PERCENT}%) ${stacked}`;
    };

    const getCardTransitionDurationMs = (depth: number) =>
        depth === TOP_DEPTH && (getIsSwiping() || getReturningFrom() !== undefined)
            ? NO_DURATION
            : getTransitionDurationMs();

    const onKeyDown = (e: KeyboardEvent) => {
        const direction = KEY_DIRECTIONS[e.key];

        if (direction === undefined || !send(direction)) return;

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
            <For each={getMounted()}>
                {(entry, getDepth) => {
                    const getIsTop = createMemo(() => getDepth() === TOP_DEPTH);

                    const getState = createMemo((): CardStackCardState<T> => ({
                        card: entry.card,
                        index: entry.index,
                        depth: getDepth(),
                        isTop: getIsTop(),
                        travel: getIsTop() ? getTravel() : NO_TRAVEL,
                        leavingTo: getIsTop() ? getLeavingTo() : undefined,
                        returningFrom: getIsTop() ? getReturningFrom() : undefined,
                    }));

                    return (
                        <div
                            class={styles.cardStackCard}
                            style={{
                                "z-index": getMounted().length - getDepth(),
                                "width": getCardWidth(getDepth()),
                                "height": getCardHeight(),
                                "transform": getCardTransform(getDepth()),
                                "transition-duration": `${getCardTransitionDurationMs(getDepth())}ms`,
                            }}
                            role="group"
                            aria-roledescription={
                                access(props.cardRoleDescription) ?? CARD_STACK_DEFAULTS.cardRoleDescription
                            }
                            aria-label={getCardLabel(entry.card, entry.index)}
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
