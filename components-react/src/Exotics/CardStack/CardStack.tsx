import { type KeyboardEvent, useEffect, useLayoutEffect, useRef, useState } from "react";

import { CARD_STACK_DEFAULTS, CardStackStyles, CardStackUtils } from "@thewaver/ss-components";
import { StoreUtils } from "@thewaver/ss-utils";

import { InteractionTrackerReactUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { SignalMirrorReactUtils } from "../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { useLatest } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";
import type { CardStackControls, CardStackProps } from "./CardStack.types";

const MIN_MOUNTED_COUNT = 1;
const FIRST_INDEX = 0;
const TOP_DEPTH = 0;
const FALLBACK_AXIS = "horizontal";

type ControlsSnapshot = { topIndex: number; isEmpty: boolean };

const getIsSameSnapshot = (first: ControlsSnapshot, second: ControlsSnapshot) =>
    first.topIndex === second.topIndex && first.isEmpty === second.isEmpty;

export const CardStack = <T,>(props: CardStackProps<T>) => {
    const [topIndex, setTopIndex] = SignalMirrorReactUtils.useOptionalState(props.topIndexState, FIRST_INDEX);

    const pileRef = useRef<HTMLDivElement | null>(null);
    const detachedRef = useRef<HTMLDivElement | null>(null);
    const topIndexRef = useRef(topIndex);

    useLayoutEffect(() => {
        topIndexRef.current = topIndex;
    }, [topIndex]);

    const cards = props.cards;
    const commitRatio = props.commitRatio ?? CARD_STACK_DEFAULTS.commitRatio;
    const transitionDurationMs = props.transitionDurationMs ?? CARD_STACK_DEFAULTS.transitionDurationMs;
    const mountedCount = Math.max(props.mountedCount ?? CARD_STACK_DEFAULTS.mountedCount, MIN_MOUNTED_COUNT);
    const cardGap = props.cardGap ?? CARD_STACK_DEFAULTS.cardGap;
    const funnelRatio = props.funnelRatio ?? CARD_STACK_DEFAULTS.funnelRatio;
    const allowedDirections = props.allowedDirections ?? CARD_STACK_DEFAULTS.allowedDirections;
    const isDisabled = props.isDisabled ?? false;
    const isEmpty = topIndex >= cards.length;

    const pileExtentPx = CardStackUtils.getPileExtentPx(mountedCount, cardGap);
    const mounted = CardStackUtils.getMounted(cards, topIndex, mountedCount);
    const swipeAxis = CardStackUtils.getSwipeAxis(allowedDirections);

    const latest = useLatest({ props, setTopIndex, transitionDurationMs, allowedDirections, isDisabled });

    const [pile] = useState(() =>
        CardStackUtils.createPile<T>({
            getCards: () => latest.current.props.cards,
            getTopIndex: () => topIndexRef.current,
            setTopIndex: (index) => {
                topIndexRef.current = index;
                latest.current.setTopIndex(index);
            },
            getIsDisabled: () => latest.current.isDisabled,
            getAllowedDirections: () => latest.current.allowedDirections,
            getTransitionDurationMs: () => latest.current.transitionDurationMs,
            onSend: (direction, card, index) => latest.current.props.onSend?.(direction, card, index),
            onEmpty: () => latest.current.props.onEmpty?.(),
        }),
    );

    useEffect(() => () => pile.stop(), [pile]);

    const motion = useStore(pile.motion);

    const isSwipeDisabled = isDisabled || isEmpty || allowedDirections.length === 0;

    const axial = InteractionTrackerReactUtils.useAxialSwipe(swipeAxis ? pileRef : detachedRef, isSwipeDisabled, {
        axis: swipeAxis ?? FALLBACK_AXIS,
        commitRatio,
        onSwipe: (ratio) => pile.push(swipeAxis === "vertical" ? { x: 0, y: ratio } : { x: ratio, y: 0 }),
        onSwipeEnd: pile.release,
    });

    const free = InteractionTrackerReactUtils.useFreeSwipe(swipeAxis ? detachedRef : pileRef, isSwipeDisabled, {
        commitRatio,
        onSwipe: pile.push,
        onSwipeEnd: pile.release,
    });

    const isSwiping = swipeAxis ? axial.isSwiping : free.isSwiping;

    const snapshot: ControlsSnapshot = { topIndex, isEmpty };

    const [controlsStore] = useState(() => StoreUtils.create(snapshot, { isEqual: getIsSameSnapshot }));

    useLayoutEffect(() => {
        controlsStore.set(snapshot);
    });

    const [controls] = useState<CardStackControls>(() => ({
        getTopIndex: () => controlsStore.get().topIndex,
        getIsEmpty: () => controlsStore.get().isEmpty,
        send: pile.send,
        recall: pile.recall,
        deal: pile.deal,
        subscribe: controlsStore.subscribe,
    }));

    useEffect(() => {
        props.onMount?.(controls);
    }, [controls]);

    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const direction = CardStackUtils.getKeyDirection(e.key);

        if (direction === undefined || !pile.send(direction)) return;

        e.preventDefault();
    };

    return (
        <div
            ref={pileRef}
            className={CardStackStyles.cardStackRoot}
            role="group"
            aria-roledescription={props.roleDescription ?? CARD_STACK_DEFAULTS.roleDescription}
            aria-label={props.ariaLabel}
            aria-disabled={isDisabled ? "true" : undefined}
            tabIndex={0}
            onKeyDown={onKeyDown}
        >
            {mounted.map((entry, depth) => {
                const isTop = depth === TOP_DEPTH;

                return (
                    <div
                        key={entry.index}
                        className={CardStackStyles.cardStackCard}
                        style={{
                            zIndex: mounted.length - depth,
                            width: CardStackUtils.getCardWidth(depth, funnelRatio),
                            height: CardStackUtils.getCardHeight(pileExtentPx),
                            transform: CardStackUtils.getCardTransform(depth, {
                                mountedLength: mounted.length,
                                pileExtentPx,
                                cardGap,
                                motion,
                            }),
                            transitionDuration: `${CardStackUtils.getCardTransitionDurationMs(depth, {
                                isSwiping,
                                motion,
                                durationMs: transitionDurationMs,
                            })}ms`,
                        }}
                        role="group"
                        aria-roledescription={props.cardRoleDescription ?? CARD_STACK_DEFAULTS.cardRoleDescription}
                        aria-label={props.computeCardLabel(entry.card, entry.index)}
                        aria-hidden={isTop ? undefined : "true"}
                        inert={!isTop}
                    >
                        {props.renderCard({
                            card: entry.card,
                            index: entry.index,
                            depth,
                            isTop,
                            ...CardStackUtils.getCardMotion(isTop, motion),
                        })}
                    </div>
                );
            })}
        </div>
    );
};
