<script lang="ts">
    import {
        Button,
        CellAnimation,
        CellAnimationOrigins,
        SliceAnimationKeyframeUtils,
        SliceAnimationWeights,
        MediaQueryMonitorSvelteUtils,
        attachPortal,
        getViewportContext,
    } from "@thewaver/ss-components-svelte";
    import type { SliceAnimationPlaybackOpts } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.css";
    import type { Index2d, Size2d } from "@thewaver/ss-utils";

    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import type { CellAnimationExampleProps } from "../CellAnimationPage.types";

    const WIPE_CELL_SIZE = 120;
    const WIPE_LEG_MS = 600;
    const WIPE_COLOR = "black";
    const LOZENGE_COVER_PERCENT = 150;
    const WIPE_PLAYBACK: SliceAnimationPlaybackOpts = { dir: "pipe", holdMs: 400 };
    const LOZENGE_GROW = SliceAnimationKeyframeUtils.fromStops([
        { at: 0, rotate: 45, scaleX: 0, scaleY: 0 },
        { at: 1, rotate: 45, scaleX: LOZENGE_COVER_PERCENT, scaleY: LOZENGE_COVER_PERCENT },
    ]);

    const computeSolidSource = (size: Size2d) =>
        `data:image/svg+xml,${encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}"><rect width="100%" height="100%" fill="${WIPE_COLOR}"/></svg>`,
        )}`;

    type Props = Pick<CellAnimationExampleProps, "originType" | "weightType" | "weightOpts" | "breakpointOpts">;

    let props: Props = $props();

    const viewportContext = getViewportContext();

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    let wipeSize = $state.raw<Size2d>();

    const cellCount: Index2d = $derived({
        col: Math.ceil((wipeSize?.width ?? 0) / WIPE_CELL_SIZE),
        row: Math.ceil((wipeSize?.height ?? 0) / WIPE_CELL_SIZE),
    });

    const origin = $derived(CellAnimationOrigins.computeOrigin(props.originType, cellCount));

    const legMs = $derived(getPrefersReducedMotion() ? 0 : WIPE_LEG_MS);
</script>

<Button
    id={"cellAnimationWipe"}
    onClick={() => {
        if (wipeSize) return;

        wipeSize = { ...viewportContext.getSize() };
    }}
>
    {#snippet renderContent(flags)}
        <PageControlButtonContent {flags}>Wipe the screen</PageControlButtonContent>
    {/snippet}
</Button>

{#if wipeSize}
    <div class={styles.wipeOverlay} {@attach attachPortal(viewportContext.getPortalRef() ?? document.body)}>
        <CellAnimation
            src={computeSolidSource(wipeSize)}
            {cellCount}
            {origin}
            breakpointOpts={props.breakpointOpts}
            playbackOpts={WIPE_PLAYBACK}
            animationDurationMs={legMs}
            animationIterationCount={1}
            finalFrame={"nothing"}
            computeSliceWeights={(count) =>
                SliceAnimationWeights.computeSliceWeights(props.weightType, count, origin, props.weightOpts)}
            computeSliceAnimation={LOZENGE_GROW}
            onAnimationEnd={() => {
                wipeSize = undefined;
            }}
        />
    </div>
{/if}
