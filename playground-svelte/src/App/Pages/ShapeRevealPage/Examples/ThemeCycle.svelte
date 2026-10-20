<script lang="ts">
    import { Button, MediaQueryMonitorSvelteUtils } from "@thewaver/ss-components-svelte";
    import {
        NO_MOTION_DURATION_MS,
        THEME_OPTIONS,
    } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";
    import type { PlaygroundTheme } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";

    import { getAppliedTheme, revealTheme } from "../../../PageComponents/Theme/ThemeSvelte.const.svelte";
    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { ShapeRevealExampleProps } from "../ShapeRevealExample.types";

    type Props = ShapeRevealExampleProps;

    const pickOtherTheme = (current: PlaygroundTheme) => {
        const others = THEME_OPTIONS.filter((option) => option.value !== current);

        return others[Math.floor(Math.random() * others.length)].value;
    };

    let props: Props = $props();

    let isCycling = $state(false);
    let buttonRef = $state<HTMLElement | undefined>();

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    let delayTimer: ReturnType<typeof setTimeout> | undefined;
    let runId = 0;

    const cycle = async (id: number) => {
        await revealTheme(pickOtherTheme(getAppliedTheme()), {
            origin: buttonRef,
            durationMs: getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : props.durationMs,
            computePoints: props.computePoints,
            softness: props.softness,
            startDegrees: props.startDegrees,
            endDegrees: props.endDegrees,
        });

        if (id !== runId) return;

        delayTimer = setTimeout(() => void cycle(id), props.delayMs);
    };

    const stop = () => {
        runId += 1;
        clearTimeout(delayTimer);
        isCycling = false;
    };

    const toggle = () => {
        if (isCycling) return stop();

        isCycling = true;
        void cycle(runId);
    };

    $effect(() => stop);
</script>

<Button bind:ref={buttonRef} onClick={toggle}>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>
            {isCycling ? "Stop cycling" : "Start cycling"}
        </PageButtonContent>
    {/snippet}
</Button>
