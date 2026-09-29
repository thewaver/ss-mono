<script lang="ts">
    import { untrack } from "svelte";

    import {
        AnchorUtils,
        HoverIntentUtils,
        SIDEBAR_DEFAULTS,
        SIDEBAR_SIZE_PROPERTIES,
        SidebarUtils,
        SidebarStyles as styles,
    } from "@thewaver/ss-components";

    import { DismisserSvelteUtils } from "../../Abstracts/Dismisser/DismisserSvelte.utils.svelte.js";
    import { ElementFaderSvelteUtils } from "../../Abstracts/ElementFader/ElementFaderSvelte.utils.svelte.js";
    import { ElevationSvelteUtils } from "../../Abstracts/Elevation/ElevationSvelte.utils.svelte.js";
    import { HoverIntentSvelteUtils } from "../../Abstracts/HoverIntent/HoverIntentSvelte.utils.svelte.js";
    import { watchChange } from "../../Utils/effectUtils.svelte.js";
    import type { SidebarProps } from "./Sidebar.types.js";

    const NO_SKIP_WINDOW_MS = 0;

    let { expanded = $bindable(false), ...props }: SidebarProps = $props();

    let root = $state<HTMLDivElement>();
    let panel = $state<HTMLDivElement>();
    let isPeeking = $state(false);
    let isWaitingOnPopup = $state(false);

    const edge = $derived(props.edge ?? SIDEBAR_DEFAULTS.edge);
    const isOverlay = $derived((props.layout ?? SIDEBAR_DEFAULTS.layout) === "overlay");
    const transitionDurationMs = $derived(props.transitionDurationMs ?? SIDEBAR_DEFAULTS.transitionDurationMs);
    const isExpanded = $derived(expanded || isPeeking || isWaitingOnPopup);

    let isArriving = $state(untrack(() => isExpanded));

    const appliedDurationMs = $derived(isArriving ? 0 : transitionDurationMs);

    const fader = ElementFaderSvelteUtils.createFader(() => isExpanded, {
        getTransitionDurationMs: () => appliedDurationMs,
        getRef: () => panel ?? undefined,
    });

    watchChange(fader.getHasTransitionFinished, (hasFinished) => {
        if (hasFinished) isArriving = false;
    });

    const phase = $derived(SidebarUtils.computePhase(isExpanded, fader.getHasTransitionFinished()));

    const getIsHeld = () => SidebarUtils.getHasOpenPopupOutside(root ?? undefined);

    const collapseHover = () => {
        hoverIntent.cancel();
        isPeeking = false;
        isWaitingOnPopup = false;
    };

    const hoverIntent = HoverIntentSvelteUtils.create(
        () => (props.isExpandedOnHover ? (root ?? undefined) : undefined),
        [
            () => isPeeking,
            (value) => {
                isPeeking = value;
            },
        ],
        {
            delayGroup: HoverIntentUtils.createDelayGroup(),
            getPanelRef: () => undefined,
            getHoverShowDelayMs: () => props.hoverShowDelayMs ?? SIDEBAR_DEFAULTS.hoverShowDelayMs,
            getSkipDelayWindowMs: () => NO_SKIP_WINDOW_MS,
            getIsHeld,
            isTouchIgnored: true,
        },
    );

    DismisserSvelteUtils.createLayer(
        () => isPeeking,
        {
            getRoots: () => [root],
            onDismiss: collapseHover,
        },
    );

    $effect(() => {
        if (!isPeeking && !isWaitingOnPopup) return;

        return untrack(() => SidebarUtils.observePointerAway(root ?? undefined, collapseHover));
    });

    watchChange(
        () => expanded,
        (isOwnerExpanded) => {
            if (isOwnerExpanded) return;

            if (getIsHeld()) {
                isWaitingOnPopup = true;

                return;
            }

            collapseHover();
        },
    );

    const isRaised = $derived(isOverlay && phase !== "collapsed");

    const zIndex = $derived.by(() => {
        const element = root ?? undefined;

        if (!isRaised) return undefined;

        return Math.max(AnchorUtils.getStackingBase(element), ElevationSvelteUtils.getBase(element)) + 1;
    });

    const sizeProperty = $derived(SIDEBAR_SIZE_PROPERTIES[edge]);
    const panelSize = $derived(fader.getTransitionTarget() === 1 ? props.expandedSize : props.collapsedSize);
</script>

<div
    bind:this={root}
    id={props.id}
    class={[styles.sidebarRoot, styles.sidebarRootEdgeVariants[edge]]}
    style:width={sizeProperty === "width" && isOverlay ? `${props.collapsedSize}px` : undefined}
    style:height={sizeProperty === "height" && isOverlay ? `${props.collapsedSize}px` : undefined}
>
    <div
        bind:this={panel}
        class={[
            styles.sidebarPanel,
            styles.sidebarPanelEdgeVariants[edge],
            isOverlay && styles.sidebarPanelOverlayVariants[edge],
        ]}
        style:width={sizeProperty === "width" ? `${panelSize}px` : undefined}
        style:height={sizeProperty === "height" ? `${panelSize}px` : undefined}
        style:z-index={zIndex}
        style:transition-duration={`${appliedDurationMs}ms`}
    >
        {@render props.renderContent(phase, appliedDurationMs)}
    </div>
</div>
