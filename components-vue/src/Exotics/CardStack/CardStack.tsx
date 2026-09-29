import { type SlotsType, computed, defineComponent, onScopeDispose, shallowRef } from "vue";

import { CARD_STACK_DEFAULTS, CardStackStyles, CardStackUtils } from "@thewaver/ss-components";

import { InteractionTrackerVueUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../Utils/propUtils";
import { useStore } from "../../Utils/storeUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { CardStackControls, CardStackProps, CardStackSlots } from "./CardStack.types";

const MIN_MOUNTED_COUNT = 1;
const FIRST_INDEX = 0;
const TOP_DEPTH = 0;
const FALLBACK_AXIS = "horizontal";

export const CardStack = defineComponent(
    <T,>(props: CardStackProps<T>, { slots }: SlotsContext<CardStackSlots<T>>) => {
        const topIndex = useTwoWay(props, "topIndex", FIRST_INDEX);

        const pileRef = shallowRef<HTMLDivElement>();

        const getTransitionDurationMs = () => props.transitionDurationMs ?? CARD_STACK_DEFAULTS.transitionDurationMs;
        const getAllowedDirections = () => props.allowedDirections ?? CARD_STACK_DEFAULTS.allowedDirections;
        const getIsDisabled = () => props.isDisabled ?? false;
        const getCommitRatio = () => props.commitRatio ?? CARD_STACK_DEFAULTS.commitRatio;

        const isEmpty = computed(() => topIndex.value >= props.cards.length);
        const swipeAxis = computed(() => CardStackUtils.getSwipeAxis(getAllowedDirections()));

        const pile = CardStackUtils.createPile<T>({
            getCards: () => props.cards,
            getTopIndex: () => topIndex.value,
            setTopIndex: (index) => {
                topIndex.value = index;
            },
            getIsDisabled,
            getAllowedDirections,
            getTransitionDurationMs,
            onSend: (direction, card, index) => props.onSend?.(direction, card, index),
            onEmpty: () => props.onEmpty?.(),
        });

        onScopeDispose(pile.stop);

        const motion = useStore(pile.motion);

        const getIsSwipeDisabled = () => getIsDisabled() || isEmpty.value || getAllowedDirections().length === 0;

        const axial = InteractionTrackerVueUtils.useAxialSwipe(
            () => (swipeAxis.value ? pileRef.value : undefined),
            getIsSwipeDisabled,
            {
                axis: () => swipeAxis.value ?? FALLBACK_AXIS,
                commitRatio: getCommitRatio,
                onSwipe: (ratio) => pile.push(swipeAxis.value === "vertical" ? { x: 0, y: ratio } : { x: ratio, y: 0 }),
                onSwipeEnd: pile.release,
            },
        );

        const free = InteractionTrackerVueUtils.useFreeSwipe(
            () => (swipeAxis.value ? undefined : pileRef.value),
            getIsSwipeDisabled,
            {
                commitRatio: getCommitRatio,
                onSwipe: pile.push,
                onSwipeEnd: pile.release,
            },
        );

        const controls: CardStackControls = {
            getTopIndex: () => topIndex.value,
            getIsEmpty: () => isEmpty.value,
            send: pile.send,
            recall: pile.recall,
            deal: pile.deal,
        };

        watchAfterRender([], () => {
            props.onMount?.(controls);
        });

        const onKeyDown = (e: KeyboardEvent) => {
            const direction = CardStackUtils.getKeyDirection(e.key);

            if (direction === undefined || !pile.send(direction)) return;

            e.preventDefault();
        };

        return () => {
            const transitionDurationMs = getTransitionDurationMs();
            const mountedCount = Math.max(props.mountedCount ?? CARD_STACK_DEFAULTS.mountedCount, MIN_MOUNTED_COUNT);
            const cardGap = props.cardGap ?? CARD_STACK_DEFAULTS.cardGap;
            const funnelRatio = props.funnelRatio ?? CARD_STACK_DEFAULTS.funnelRatio;
            const isDisabled = getIsDisabled();
            const pileExtentPx = CardStackUtils.getPileExtentPx(mountedCount, cardGap);
            const mounted = CardStackUtils.getMounted(props.cards, topIndex.value, mountedCount);
            const isSwiping = swipeAxis.value ? axial.isSwiping.value : free.isSwiping.value;

            return (
                <div
                    ref={pileRef}
                    class={CardStackStyles.cardStackRoot}
                    role="group"
                    aria-roledescription={props.roleDescription ?? CARD_STACK_DEFAULTS.roleDescription}
                    aria-label={props.ariaLabel}
                    aria-disabled={isDisabled ? "true" : undefined}
                    tabindex={0}
                    onKeydown={onKeyDown}
                >
                    {mounted.map((entry, depth) => {
                        const isTop = depth === TOP_DEPTH;

                        return (
                            <div
                                key={entry.index}
                                class={CardStackStyles.cardStackCard}
                                style={{
                                    zIndex: mounted.length - depth,
                                    width: CardStackUtils.getCardWidth(depth, funnelRatio),
                                    height: CardStackUtils.getCardHeight(pileExtentPx),
                                    transform: CardStackUtils.getCardTransform(depth, {
                                        mountedLength: mounted.length,
                                        pileExtentPx,
                                        cardGap,
                                        getMotion: () => motion.value,
                                    }),
                                    transitionDuration: `${CardStackUtils.getCardTransitionDurationMs(depth, {
                                        getIsSwiping: () => isSwiping,
                                        getMotion: () => motion.value,
                                        durationMs: transitionDurationMs,
                                    })}ms`,
                                }}
                                role="group"
                                aria-roledescription={
                                    props.cardRoleDescription ?? CARD_STACK_DEFAULTS.cardRoleDescription
                                }
                                aria-label={props.computeCardLabel(entry.card, entry.index)}
                                aria-hidden={isTop ? undefined : "true"}
                                inert={!isTop}
                            >
                                {callSlot(slots.renderCard, {
                                    card: entry.card,
                                    index: entry.index,
                                    depth,
                                    isTop,
                                    ...CardStackUtils.getCardMotion(isTop, () => motion.value),
                                })}
                            </div>
                        );
                    })}
                </div>
            );
        };
    },
    {
        name: "CardStack",
        slots: Object as SlotsType<CardStackSlots<any>>,
        props: declareProps<CardStackProps<unknown>>({
            "commitRatio": null,
            "transitionDurationMs": null,
            "mountedCount": null,
            "cardGap": null,
            "funnelRatio": null,
            "allowedDirections": null,
            "isDisabled": Boolean,
            "ariaLabel": null,
            "computeCardLabel": null,
            "roleDescription": null,
            "cardRoleDescription": null,
            "cards": null,
            "topIndex": null,
            "onUpdate:topIndex": null,
            "onSend": null,
            "onEmpty": null,
            "onMount": null,
        }),
    },
);
