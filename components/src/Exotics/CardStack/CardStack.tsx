import { For, createMemo, createSignal, onCleanup, onMount } from "solid-js";

import type { Point2d, SwipeDirection } from "@thewaver/ss-utils";

import type { InteractionDragRatio } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import { InteractionTrackerUtils } from "../../Abstracts/InteractionTracker/InteractionTracker.utils";
import { SignalMirrorUtils } from "../../Abstracts/SignalMirror/SignalMirror.utils";
import { access } from "../../Utils/propUtils";
import type { CardStackCardState, CardStackControls, CardStackProps } from "./CardStack.types";

import * as styles from "./CardStack.css";

const DEFAULT_CARD_STACK_COMMIT_RATIO = 0.25;
const DEFAULT_CARD_STACK_TRANSITION_DURATION_MS = 250;
const DEFAULT_CARD_STACK_MOUNTED_COUNT = 3;
const DEFAULT_CARD_STACK_CARD_GAP = 12;
const DEFAULT_CARD_STACK_FUNNEL_RATIO = 0.08;

const MIN_MOUNTED_COUNT = 1;
const FIRST_INDEX = 0;
const TOP_DEPTH = 0;
const BOTTOM_STEP = 1;
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

const CARD_STACK_ROLE_DESCRIPTION = "card stack";
const CARD_ROLE_DESCRIPTION = "card";

export const CardStack = <T,>(props: CardStackProps<T>) => {
    const [getTopIndex, setTopIndex] = SignalMirrorUtils.createOptional(() => props.topIndexSignal, FIRST_INDEX);

    const [getPileRef, setPileRef] = createSignal<HTMLElement>();
    const [getTravel, setTravel] = createSignal(NO_TRAVEL);
    const [getLeavingTo, setLeavingTo] = createSignal<SwipeDirection>();

    let leaveTimeout: ReturnType<typeof setTimeout> | undefined;

    onCleanup(() => {
        clearTimeout(leaveTimeout);
    });

    const getCards = createMemo(() => access(props.cards));

    const getCommitRatio = createMemo(() => access(props.commitRatio) ?? DEFAULT_CARD_STACK_COMMIT_RATIO);

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? DEFAULT_CARD_STACK_TRANSITION_DURATION_MS,
    );

    const getMountedCount = createMemo(() =>
        Math.max(access(props.mountedCount) ?? DEFAULT_CARD_STACK_MOUNTED_COUNT, MIN_MOUNTED_COUNT),
    );

    const getCardGap = createMemo(() => access(props.cardGap) ?? DEFAULT_CARD_STACK_CARD_GAP);

    const getFunnelRatio = createMemo(() => access(props.funnelRatio) ?? DEFAULT_CARD_STACK_FUNNEL_RATIO);

    const getPileExtentPx = createMemo(() => (getMountedCount() - BOTTOM_STEP) * getCardGap());

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getIsEmpty = createMemo(() => getTopIndex() >= getCards().length);

    const getMounted = createMemo(() => {
        const from = Math.max(getTopIndex(), FIRST_INDEX);

        return getCards()
            .slice(from, from + getMountedCount())
            .map((card, offset) => ({ card, index: from + offset }));
    });

    const getCardLabel = (card: T, index: number) =>
        props.computeCardLabel?.(card, index) ?? `${CARD_ROLE_DESCRIPTION} ${index + 1}`;

    const send = (direction: SwipeDirection) => {
        const cards = getCards();
        const index = getTopIndex();

        if (getIsDisabled() || getLeavingTo() !== undefined || index >= cards.length) return false;

        const card = cards[index]!;

        setTravel(NO_TRAVEL);
        setLeavingTo(direction);

        clearTimeout(leaveTimeout);

        leaveTimeout = setTimeout(() => {
            setLeavingTo(undefined);
            setTopIndex(index + 1);

            void props.onSend?.(direction, card, index);

            if (getIsEmpty()) void props.onEmpty?.();
        }, getTransitionDurationMs());

        return true;
    };

    const deal = () => {
        if (getTopIndex() === FIRST_INDEX && getLeavingTo() === undefined) return false;

        clearTimeout(leaveTimeout);

        setLeavingTo(undefined);
        setTravel(NO_TRAVEL);
        setTopIndex(FIRST_INDEX);

        return true;
    };

    const controls: CardStackControls = { getTopIndex, getIsEmpty, send, deal };

    const { getIsSwiping } = InteractionTrackerUtils.trackFreeSwipe(
        getPileRef,
        () => getIsDisabled() || getIsEmpty(),
        {
            getCommitRatio,
            onSwipe: setTravel,
            onSwipeEnd: (direction) => {
                setTravel(NO_TRAVEL);

                if (direction === undefined) return;

                send(direction);
            },
        },
    );

    const getCardHeight = () => `calc(${PERCENT}% - ${getPileExtentPx()}px)`;

    const getCardWidth = (depth: number) =>
        `${Math.max(FULL_WIDTH - depth * getFunnelRatio(), NO_WIDTH) * PERCENT}%`;

    const getStackOffsetPx = (depth: number) =>
        getPileExtentPx() - (getMounted().length - BOTTOM_STEP - depth) * getCardGap();

    const getCardTransform = (depth: number) => {
        const stacked = `translateY(${getStackOffsetPx(depth)}px)`;

        if (depth !== TOP_DEPTH) return stacked;

        const leavingTo = getLeavingTo();
        const offset = leavingTo === undefined ? getTravel() : LEAVE_OFFSETS[leavingTo];

        return `translate(${offset.x * PERCENT}%, ${offset.y * PERCENT}%) ${stacked}`;
    };

    const getCardTransitionDurationMs = (depth: number) =>
        depth === TOP_DEPTH && getIsSwiping() ? NO_DURATION : getTransitionDurationMs();

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
            aria-roledescription={CARD_STACK_ROLE_DESCRIPTION}
            aria-label={access(props.ariaLabel)}
            aria-disabled={getIsDisabled() ? "true" : undefined}
            tabindex={0}
            onKeyDown={onKeyDown}
        >
            <For each={getMounted()}>
                {(entry, getDepth) => {
                    const getIsTop = createMemo(() => getDepth() === TOP_DEPTH);

                    const getState = createMemo(
                        (): CardStackCardState<T> => ({
                            card: entry.card,
                            index: entry.index,
                            depth: getDepth(),
                            isTop: getIsTop(),
                            travel: getIsTop() ? getTravel() : NO_TRAVEL,
                            leavingTo: getIsTop() ? getLeavingTo() : undefined,
                        }),
                    );

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
                            aria-roledescription={CARD_ROLE_DESCRIPTION}
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
