<script lang="ts" generics="T">
    import { untrack } from "svelte";
    import { on } from "svelte/events";

    import { CARD_STACK_DEFAULTS, CardStackUtils, CardStackStyles as styles } from "@thewaver/ss-components";

    import { InteractionTrackerSvelteUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import { readStore } from "../../Utils/storeUtils.js";
    import type { CardStackControls, CardStackProps } from "./CardStack.types.js";

    const MIN_MOUNTED_COUNT = 1;
    const FIRST_INDEX = 0;
    const TOP_DEPTH = 0;
    const FALLBACK_AXIS = "horizontal";

    let { topIndex = $bindable(FIRST_INDEX), ...props }: CardStackProps<T> = $props();

    let pileElement = $state<HTMLDivElement>();

    const commitRatio = $derived(props.commitRatio ?? CARD_STACK_DEFAULTS.commitRatio);
    const transitionDurationMs = $derived(props.transitionDurationMs ?? CARD_STACK_DEFAULTS.transitionDurationMs);
    const mountedCount = $derived(Math.max(props.mountedCount ?? CARD_STACK_DEFAULTS.mountedCount, MIN_MOUNTED_COUNT));
    const cardGap = $derived(props.cardGap ?? CARD_STACK_DEFAULTS.cardGap);
    const funnelRatio = $derived(props.funnelRatio ?? CARD_STACK_DEFAULTS.funnelRatio);
    const allowedDirections = $derived(props.allowedDirections ?? CARD_STACK_DEFAULTS.allowedDirections);
    const isDisabled = $derived(props.isDisabled ?? false);
    const isEmpty = $derived(topIndex >= props.cards.length);

    const pileExtentPx = $derived(CardStackUtils.getPileExtentPx(mountedCount, cardGap));
    const mounted = $derived(CardStackUtils.getMounted(props.cards, topIndex, mountedCount));
    const swipeAxis = $derived(CardStackUtils.getSwipeAxis(allowedDirections));

    const pile = CardStackUtils.createPile<T>({
        getCards: () => props.cards,
        getTopIndex: () => topIndex,
        setTopIndex: (index) => {
            topIndex = index;
        },
        getIsDisabled: () => isDisabled,
        getAllowedDirections: () => allowedDirections,
        getTransitionDurationMs: () => transitionDurationMs,
        onSend: (direction, card, index) => props.onSend?.(direction, card, index),
        onEmpty: () => props.onEmpty?.(),
    });

    $effect(() => () => pile.stop());

    const getMotion = readStore(pile.motion);

    const isSwipeDisabled = $derived(isDisabled || isEmpty || allowedDirections.length === 0);

    const axial = InteractionTrackerSvelteUtils.trackAxialSwipe(
        () => (swipeAxis ? pileElement : undefined),
        () => isSwipeDisabled,
        {
            getAxis: () => swipeAxis ?? FALLBACK_AXIS,
            getCommitRatio: () => commitRatio,
            onSwipe: (ratio) => pile.push(swipeAxis === "vertical" ? { x: 0, y: ratio } : { x: ratio, y: 0 }),
            onSwipeEnd: pile.release,
        },
    );

    const free = InteractionTrackerSvelteUtils.trackFreeSwipe(
        () => (swipeAxis ? undefined : pileElement),
        () => isSwipeDisabled,
        {
            getCommitRatio: () => commitRatio,
            onSwipe: pile.push,
            onSwipeEnd: pile.release,
        },
    );

    const isSwiping = $derived(swipeAxis ? axial.getIsSwiping() : free.getIsSwiping());

    const controls: CardStackControls = {
        getTopIndex: () => topIndex,
        getIsEmpty: () => isEmpty,
        send: pile.send,
        recall: pile.recall,
        deal: pile.deal,
    };

    $effect(() => untrack(() => props.onMount?.(controls)));

    const handleKeyDown = (e: KeyboardEvent) => {
        const direction = CardStackUtils.getKeyDirection(e.key);

        if (direction === undefined || !pile.send(direction)) return;

        e.preventDefault();
    };
</script>

<div
    bind:this={pileElement}
    {@attach (element) => on(element, "keydown", handleKeyDown)}
    class={styles.cardStackRoot}
    role="group"
    aria-roledescription={props.roleDescription ?? CARD_STACK_DEFAULTS.roleDescription}
    aria-label={props.ariaLabel}
    aria-disabled={isDisabled ? "true" : undefined}
    tabindex="0"
>
    {#each mounted as entry, depth (entry.index)}
        {@const isTop = depth === TOP_DEPTH}
        <div
            class={styles.cardStackCard}
            style:z-index={mounted.length - depth}
            style:width={CardStackUtils.getCardWidth(depth, funnelRatio)}
            style:height={CardStackUtils.getCardHeight(pileExtentPx)}
            style:transform={CardStackUtils.getCardTransform(depth, {
                mountedLength: mounted.length,
                pileExtentPx,
                cardGap,
                getMotion,
            })}
            style:transition-duration={`${CardStackUtils.getCardTransitionDurationMs(depth, {
                getIsSwiping: () => isSwiping,
                getMotion,
                durationMs: transitionDurationMs,
            })}ms`}
            role="group"
            aria-roledescription={props.cardRoleDescription ?? CARD_STACK_DEFAULTS.cardRoleDescription}
            aria-label={props.computeCardLabel(entry.card, entry.index)}
            aria-hidden={isTop ? undefined : "true"}
            inert={!isTop}
        >
            {@render props.renderCard({
                card: entry.card,
                index: entry.index,
                depth,
                isTop,
                ...CardStackUtils.getCardMotion(isTop, getMotion),
            })}
        </div>
    {/each}
</div>
