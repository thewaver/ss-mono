<script lang="ts">
    import {
        CollapsibleUtils,
        PREVIEW_DEFAULTS,
        type PreviewFlags,
        PreviewUtils,
        PreviewStyles as styles,
    } from "@thewaver/ss-components";

    import { ElementFaderSvelteUtils } from "../../Abstracts/ElementFader/ElementFaderSvelte.utils.svelte.js";
    import { ElementObserverSvelteUtils } from "../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import InteractionWrapper from "../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import { watchChange } from "../../Utils/effectUtils.svelte.js";
    import type { PreviewProps } from "./Preview.types.js";
    import PreviewTrigger from "./PreviewTrigger.svelte";

    let { expanded = $bindable(false), ref = $bindable(), ...props }: PreviewProps = $props();

    const contentId = $props.id();

    let root = $state<HTMLDivElement>();
    let content = $state<HTMLDivElement>();

    const transitionDurationMs = $derived(props.transitionDurationMs ?? PREVIEW_DEFAULTS.transitionDurationMs);
    const sizing = $derived(props.sizing ?? PREVIEW_DEFAULTS.sizing);

    const getContentHeight = ElementObserverSvelteUtils.createBorderBoxHeightObserver(() => content ?? undefined);

    const isOverflowing = $derived(PreviewUtils.computeIsOverflowing(getContentHeight(), props.collapsedHeight));

    const fader = ElementFaderSvelteUtils.createFader(() => expanded, {
        getTransitionDurationMs: () => transitionDurationMs,
        getRef: () => root ?? undefined,
    });

    let isAwaitingScroll = false;

    watchChange(
        () => expanded,
        (isExpanded) => {
            isAwaitingScroll = !isExpanded;
        },
    );

    $effect(() => {
        expanded;

        if (!isAwaitingScroll || !fader.getHasTransitionFinished()) return;

        isAwaitingScroll = false;

        const rootElement = root;
        const trigger = ref;

        if (props.isScrolledIntoViewOnCollapse !== true || !rootElement || !trigger) return;

        return CollapsibleUtils.scrollIntoView(rootElement, trigger);
    });

    const height = $derived(
        PreviewUtils.computeHeight(getContentHeight(), props.collapsedHeight, fader.getTransitionTarget()),
    );

    const extraFlags: PreviewFlags = $derived({ isExpanded: expanded });
</script>

<div bind:this={root} class={[styles.previewRoot, styles.previewSizingVariants[sizing]]}>
    <div class={styles.previewFrame}>
        <div
            id={contentId}
            class={styles.previewContent}
            style:height={`${height}px`}
            style:transition-property="height"
            style:transition-duration={`${transitionDurationMs}ms`}
        >
            <div bind:this={content}>{@render props.renderContent()}</div>
        </div>

        {#if props.renderOverlay && isOverflowing}
            <div class={styles.previewOverlay}>
                {@render props.renderOverlay(
                    PreviewUtils.computeOverlayTarget(fader.getTransitionTarget()),
                    transitionDurationMs,
                )}
            </div>
        {/if}
    </div>

    {#if isOverflowing}
        <InteractionWrapper {...props} bind:ref sizing="fit-content" {extraFlags}>
            {#snippet renderControl(attachElement, flags)}
                <PreviewTrigger
                    {attachElement}
                    id={props.id}
                    {contentId}
                    {flags}
                    isExpanded={expanded}
                    renderTrigger={props.renderTrigger}
                    onToggle={() => {
                        expanded = !expanded;
                    }}
                />
            {/snippet}
        </InteractionWrapper>
    {/if}
</div>
