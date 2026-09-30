<script lang="ts">
    import { on } from "svelte/events";

    import {
        Button,
        Corners,
        ElementObserverSvelteUtils,
        MediaQueryMonitorSvelteUtils,
    } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/CornersPage/CornersPage.css";
    import { Rect } from "@thewaver/ss-utils";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { CornersExampleProps } from "../CornersPage.types";

    type Props = CornersExampleProps;

    const TRANSPARENT = "transparent";
    const BOX_PADDING_PX = 10;
    const CONTROLS = ["Open", "Save", "Share", "Delete"];

    let props: Props = $props();

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    let stageRef = $state<HTMLDivElement>();
    let hovered = $state<HTMLElement>();
    let focused = $state<HTMLElement>();
    let stageRect = $state.raw<Rect>();
    let targetRect = $state.raw<Rect>();

    const target = $derived(hovered ?? focused);

    ElementObserverSvelteUtils.createViewportRectObserver(
        () => stageRef ?? undefined,
        () => true,
        {
            setElementRect: (rect) => {
                if (!stageRect || !Rect.isSame(stageRect, rect)) stageRect = rect;
            },
        },
    );
    ElementObserverSvelteUtils.createViewportRectObserver(
        () => target,
        () => target !== undefined,
        {
            setElementRect: (rect) => {
                if (!targetRect || !Rect.isSame(targetRect, rect)) targetRect = rect;
            },
            getPadding: () => BOX_PADDING_PX,
        },
    );

    let lastBoxRect: Rect | undefined;

    const boxRect = $derived.by(() => {
        if (!stageRect || !targetRect || !target) return lastBoxRect;

        lastBoxRect = {
            x: targetRect.x - stageRect.x,
            y: targetRect.y - stageRect.y,
            width: targetRect.width,
            height: targetRect.height,
        };

        return lastBoxRect;
    });

    const glideMs = $derived(getPrefersReducedMotion() ? 0 : props.transitionDurationMs);
</script>

<div bind:this={stageRef} class={styles.followStage}>
    {#each CONTROLS as label (label)}
        <div
            class={styles.followSlot}
            {@attach (element) =>
                on(element, "pointerenter", () => {
                    hovered = element;
                })}
            {@attach (element) =>
                on(element, "pointerleave", () => {
                    hovered = undefined;
                })}
            onfocusin={(e) => {
                if ((e.target as HTMLElement).matches(":focus-visible")) focused = e.currentTarget;
            }}
            onfocusout={() => {
                focused = undefined;
            }}
        >
            <Button>
                {#snippet renderContent(flags)}
                    <PageButtonContent {flags}>{label}</PageButtonContent>
                {/snippet}
            </Button>
        </div>
    {/each}

    {#if boxRect}
        <div
            class={styles.followBox}
            style:left={`${boxRect.x}px`}
            style:top={`${boxRect.y}px`}
            style:width={`${boxRect.width}px`}
            style:height={`${boxRect.height}px`}
            style:transition-duration={`${glideMs}ms`}
        >
            <Corners
                color={target ? props.color : TRANSPARENT}
                cornerLength={props.cornerLength}
                strokeThickness={props.strokeThickness}
                transitionDurationMs={props.transitionDurationMs}
                visibleCorners={props.visibleCorners}
            />
        </div>
    {/if}
</div>
