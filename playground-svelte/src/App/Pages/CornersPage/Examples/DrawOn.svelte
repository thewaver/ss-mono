<script lang="ts">
    import { Button, Corners, MediaQueryMonitorSvelteUtils } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/CornersPage/CornersPage.css";
    import { EasingUtils, MathUtils } from "@thewaver/ss-utils";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { CornersExampleProps } from "../CornersPage.types";

    type Props = CornersExampleProps;

    const TRANSPARENT = "transparent";
    const NOT_GROWN = 0;
    const FULLY_GROWN = 1;

    let props: Props = $props();

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    let isShown = $state(false);
    let growth = $state(NOT_GROWN);

    let frame: number | undefined;

    const stopTween = () => {
        if (frame !== undefined) cancelAnimationFrame(frame);

        frame = undefined;
    };

    $effect(() => stopTween);

    const drawOn = () => {
        stopTween();

        const durationMs = props.transitionDurationMs;

        if (getPrefersReducedMotion() || durationMs <= 0) {
            growth = FULLY_GROWN;

            return;
        }

        const startedAt = performance.now();

        growth = NOT_GROWN;

        const step = (now: number) => {
            const ratio = MathUtils.clamp01((now - startedAt) / durationMs);

            growth = EasingUtils.easeOut(ratio);

            frame = ratio < 1 ? requestAnimationFrame(step) : undefined;
        };

        frame = requestAnimationFrame(step);
    };

    const cornerLength = $derived({
        width: Math.max(props.strokeThickness, props.cornerLength.width * growth),
        height: Math.max(props.strokeThickness, props.cornerLength.height * growth),
    });
</script>

<div class={styles.stage}>
    <div class={styles.frame}>
        <Corners
            color={isShown ? props.color : TRANSPARENT}
            {cornerLength}
            strokeThickness={props.strokeThickness}
            transitionDurationMs={props.transitionDurationMs}
            visibleCorners={props.visibleCorners}
        >
            <div class={styles.frameBody}>The arms grow out of each corner</div>
        </Corners>
    </div>

    <div class={styles.controlRow}>
        <Button
            id={"cornersDrawOn"}
            isPressed={isShown}
            onClick={() => {
                if (!isShown) drawOn();

                isShown = !isShown;
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>{isShown ? "Hide" : "Draw"}</PageButtonContent>
            {/snippet}
        </Button>
    </div>
</div>
