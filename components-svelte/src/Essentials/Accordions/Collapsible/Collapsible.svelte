<script lang="ts">
    import {
        COLLAPSIBLE_DEFAULTS,
        type CollapsibleFlags,
        CollapsibleUtils,
        CollapsibleStyles as styles,
    } from "@thewaver/ss-components";

    import { ElementFaderSvelteUtils } from "../../../Abstracts/ElementFader/ElementFaderSvelte.utils.svelte.js";
    import { ElementObserverSvelteUtils } from "../../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import InteractionWrapper from "../../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import type { CollapsibleProps } from "./Collapsible.types.js";
    import CollapsibleTrigger from "./CollapsibleTrigger.svelte";

    let { expanded = $bindable(false), ref = $bindable(), ...props }: CollapsibleProps = $props();

    const uid = $props.id();
    const triggerId = `${uid}-trigger`;
    const panelId = `${uid}-panel`;

    let root = $state<HTMLDivElement>();
    let content = $state<HTMLDivElement>();

    const transitionDurationMs = $derived(props.transitionDurationMs ?? COLLAPSIBLE_DEFAULTS.transitionDurationMs);
    const sizing = $derived(props.sizing ?? COLLAPSIBLE_DEFAULTS.sizing);
    const side = $derived(props.side ?? COLLAPSIBLE_DEFAULTS.side);
    const isSideways = $derived(CollapsibleUtils.getIsSideways(side));
    const panelAxis = $derived(CollapsibleUtils.getPanelAxis(side));
    const headingTag = $derived(CollapsibleUtils.getHeadingTag(props.headingLevel));

    let hasBuiltContent = false;

    const hasPanelContent = $derived.by(() => {
        hasBuiltContent = CollapsibleUtils.computeHasPanelContent(
            hasBuiltContent,
            props.isPanelBuiltOnExpand,
            expanded,
        );

        return hasBuiltContent;
    });

    const getContentSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(
        () => content ?? undefined,
        () => !hasPanelContent,
    );

    const fader = ElementFaderSvelteUtils.createFader(() => expanded, {
        getTransitionDurationMs: () => transitionDurationMs,
        getRef: () => root ?? undefined,
    });

    let isAwaitingScroll = false;

    watchChange(
        () => expanded,
        (isExpanded) => {
            isAwaitingScroll = isExpanded;
        },
    );

    $effect(() => {
        expanded;

        if (!isAwaitingScroll || !fader.getHasTransitionFinished()) return;

        isAwaitingScroll = false;

        const rootElement = root;
        const trigger = ref;

        if (props.isScrolledIntoViewOnExpand !== true || !rootElement || !trigger) return;

        return CollapsibleUtils.scrollIntoView(rootElement, trigger);
    });

    const extraFlags: CollapsibleFlags = $derived({ isExpanded: expanded });

    const panelExtent = $derived(
        CollapsibleUtils.computePanelExtent(fader.getTransitionTarget(), getContentSize(), side),
    );

    const panelStyle = $derived(
        toStyle({
            [panelAxis]: `${panelExtent}px`,
            transitionProperty: panelAxis,
            transitionDuration: `${transitionDurationMs}ms`,
        }),
    );
</script>

{#snippet wrapper()}
    <InteractionWrapper {...props} bind:ref sizing={isSideways ? "fit-content" : "fill"} {extraFlags}>
        {#snippet renderControl(attachElement, flags)}
            <CollapsibleTrigger
                {attachElement}
                id={props.id ?? triggerId}
                {panelId}
                {flags}
                isExpanded={expanded}
                renderTrigger={props.renderTrigger}
                onToggle={() => {
                    expanded = !expanded;
                }}
            />
        {/snippet}
    </InteractionWrapper>
{/snippet}

<div
    bind:this={root}
    class={[styles.collapsibleRoot, styles.collapsibleSizingVariants[sizing], styles.collapsibleSideVariants[side]]}
>
    {#if headingTag}
        <svelte:element this={headingTag} class={styles.collapsibleHeading}>
            {@render wrapper()}
        </svelte:element>
    {:else}
        {@render wrapper()}
    {/if}

    <div
        id={panelId}
        class={styles.collapsiblePanel}
        style={panelStyle}
        role={props.panelRole}
        {...props.panelAriaAttributes}
        inert={!expanded}
    >
        <div bind:this={content} class={isSideways ? styles.collapsibleSidewaysContent : undefined}>
            {#if hasPanelContent}
                {@render props.renderPanel(fader.getTransitionTarget(), transitionDurationMs)}
            {/if}
        </div>
    </div>
</div>
