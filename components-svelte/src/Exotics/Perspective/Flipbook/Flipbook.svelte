<script lang="ts" generics="T">
    import { untrack } from "svelte";
    import { on } from "svelte/events";

    import {
        FLIPBOOK_DEFAULTS,
        FlipbookUtils,
        LiveAnnouncerUtils,
        type SpineSide,
        SpineUtils,
        FlipbookStyles as styles,
    } from "@thewaver/ss-components";

    import { InteractionTrackerSvelteUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import Spine from "../../../Primitives/Spine/Spine.svelte";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import { readStore } from "../../../Utils/storeUtils.js";
    import type { FlipbookControls, FlipbookProps } from "./Flipbook.types.js";

    const FIRST_SPREAD = 0;

    let { index = $bindable(FIRST_SPREAD), ...props }: FlipbookProps<T> = $props();

    $effect(() => {
        LiveAnnouncerUtils.reserve("polite");
    });

    let bookElement = $state<HTMLDivElement>();

    const pageCount = $derived(props.pages.length);
    const currentIndex = $derived(FlipbookUtils.clampSpread(index, pageCount));
    const isDisabled = $derived(props.isDisabled ?? false);
    const commitRatio = $derived(props.commitRatio ?? FLIPBOOK_DEFAULTS.commitRatio);
    const transitionDurationMs = $derived(props.transitionDurationMs ?? FLIPBOOK_DEFAULTS.transitionDurationMs);
    const leaves = $derived(Array.from({ length: FlipbookUtils.getLeafCount(pageCount) }, (_, leaf) => leaf));

    const book = FlipbookUtils.createBook({
        getPageCount: () => pageCount,
        getIndex: () => index,
        setIndex: (next) => {
            index = next;
        },
        getIsDisabled: () => isDisabled,
        getTransitionDurationMs: () => transitionDurationMs,
    });

    $effect(() => () => book.stop());

    const getPosition = readStore(book.position);

    InteractionTrackerSvelteUtils.trackAxialSwipe(
        () => bookElement,
        () => FlipbookUtils.getIsDragDisabled(isDisabled, pageCount),
        {
            getAxis: () => "horizontal",
            getCommitRatio: () => commitRatio,
            onSwipe: book.push,
            onSwipeEnd: book.release,
        },
    );

    watchChange(
        () => currentIndex,
        (next) => book.glideTo(next),
    );

    let announcedIndex: number | undefined;

    $effect(() => {
        const shownIndex = currentIndex;

        untrack(() => {
            if (FlipbookUtils.getIsAnnounced(announcedIndex, shownIndex)) {
                LiveAnnouncerUtils.announce(
                    props.computeSpreadAnnouncement(FlipbookUtils.getShowingPages(shownIndex, pageCount), pageCount),
                );
            }
        });

        announcedIndex = shownIndex;
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.target !== e.currentTarget) return;

        const step = FlipbookUtils.getKeyStep(e.key);

        if (step === undefined || !book.turn(step)) return;

        e.preventDefault();
    };

    const controls: FlipbookControls = {
        getIndex: () => currentIndex,
        getSpreadCount: () => FlipbookUtils.getSpreadCount(pageCount),
        getCanTurn: (step) => !FlipbookUtils.getIsStepDisabled(step, currentIndex, pageCount, isDisabled),
        turn: (step) => book.turn(step),
    };

    $effect(() => untrack(() => props.onMount?.(controls)));
</script>

<div
    {@attach (element) => on(element, "keydown", handleKeyDown)}
    class={styles.flipbookRoot}
    role="region"
    aria-roledescription={props.roleDescription ?? FLIPBOOK_DEFAULTS.roleDescription}
    aria-label={props.ariaLabel}
    tabindex="0"
>
    <div bind:this={bookElement} class={styles.flipbookBook}>
        <Spine
            position={getPosition()}
            hasBacks={true}
            faceRoleDescription={props.pageRoleDescription ?? FLIPBOOK_DEFAULTS.pageRoleDescription}
            computeFaceAngle={SpineUtils.leaves}
            computeFaceDefs={(leaf: number, side: SpineSide) =>
                FlipbookUtils.getLeafFaceDefs(leaf, side, pageCount, currentIndex, props.computePageLabel)}
            faces={leaves}
        >
            {#snippet renderFace(_leaf, leaf, side)}
                {@const page = FlipbookUtils.getLeafPage(leaf, side, pageCount)}
                {#if page !== undefined}
                    <div
                        class={[
                            styles.flipbookPage,
                            side === "front" ? styles.flipbookPageFront : styles.flipbookPageBack,
                        ]}
                    >
                        {@render props.renderPage(
                            props.pages[page],
                            FlipbookUtils.getPageState(page, pageCount, currentIndex),
                        )}
                    </div>
                {/if}
            {/snippet}
        </Spine>
    </div>
</div>
