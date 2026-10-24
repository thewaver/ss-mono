<script lang="ts">
    import { onDestroy } from "svelte";

    import { MediaQueryMonitorSvelteUtils, SlideButton, toStyle } from "@thewaver/ss-components-svelte";
    import {
        FINALE_CYCLE_MS,
        FINALE_PAUSE_MS,
        LOCK_COUNT,
        TURN_DEG,
    } from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.css";
    import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import PageControlColumn from "../../../PageComponents/ControlRow/PageControlColumn.svelte";
    import PageSlideButtonContent from "../../../StyledComponents/SlideButtonContent/SlideButtonContent.svelte";
    import type { SlideButtonArmingExampleProps } from "../SlideButtonPageSvelte.types";

    type Props = SlideButtonArmingExampleProps;

    const LOCKS = Array.from({ length: LOCK_COUNT }, (_, index) => index);

    const NONE_ARMED = LOCKS.map(() => false);

    let props: Props = $props();

    let progresses = $state(LOCKS.map(() => 0));
    let armed = $state.raw(NONE_ARMED);
    let isFinale = $state(false);
    let finaleRatio = $state(0);
    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    let resetTimer: ReturnType<typeof setTimeout> | undefined;
    let cycleFrame: number | undefined;

    onDestroy(() => {
        clearTimeout(resetTimer);
        cancelAnimationFrame(cycleFrame ?? 0);
    });

    const cycle = (startedAt: number) => {
        cycleFrame = requestAnimationFrame((now) => {
            const ratio = Math.min(1, (now - startedAt) / FINALE_CYCLE_MS);

            finaleRatio = ratio;

            if (ratio < 1) cycle(startedAt);
        });
    };

    const reset = () => {
        isFinale = false;
        finaleRatio = 0;
        armed = NONE_ARMED;
        props.onArmedCountChange(0);
    };

    const arm = (lock: number) => {
        if (armed[lock] || isFinale) return;

        const next = armed.map((isArmed, index) => isArmed || index === lock);

        armed = next;
        props.onArmedCountChange(next.filter(Boolean).length);

        if (!next.every(Boolean)) return;

        const isCycling = !getPrefersReducedMotion();

        isFinale = true;

        if (isCycling) cycle(performance.now());

        resetTimer = setTimeout(reset, (isCycling ? FINALE_CYCLE_MS : 0) + FINALE_PAUSE_MS);
    };

    const computeTurn = (lock: number) => (armed[lock] ? 1 : progresses[lock]) * TURN_DEG;
</script>

<PageControlColumn>
    {#each LOCKS as lock (lock)}
        <div
            class={[styles.lock, armed[lock] && styles.isArmed, isFinale && styles.isFinale]}
            style={toStyle(
                assignInlineVars({
                    [styles.turnVar]: String(computeTurn(lock)),
                    [styles.liftVar]: String(finaleRatio),
                }),
            )}
        >
            <SlideButton
                ariaLabel={`Lock ${lock + 1}`}
                ariaDescription={"Hold Enter or Space to arm."}
                isPressed={armed[lock]}
                bind:progress={progresses[lock]}
                thumbSize={SLIDE_BUTTON_THUMB_SIZE}
                onActivate={() => arm(lock)}
            >
                {#snippet renderContent(renderProps)}
                    <PageSlideButtonContent {renderProps}>Slide or hold to arm</PageSlideButtonContent>
                {/snippet}
            </SlideButton>
        </div>
    {/each}
</PageControlColumn>
