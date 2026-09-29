<script lang="ts">
    import {
        SPLIT_PANE_DEFAULTS,
        type SplitPaneCollapsedBoundaries,
        SplitPaneUtils,
        SplitPaneStyles as styles,
    } from "@thewaver/ss-components";

    import { ElementObserverSvelteUtils } from "../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { NavigatorSvelteUtils } from "../../Abstracts/Navigator/NavigatorSvelte.utils.svelte.js";
    import { watchChange } from "../../Utils/effectUtils.svelte.js";
    import type { SplitPaneProps } from "./SplitPane.types.js";

    type GutterPointerEvent = PointerEvent & { currentTarget: HTMLButtonElement };

    const NO_GUTTER_DRAGGING = -1;
    const PERCENT = 100;

    let { ratios: storedRatios = $bindable(), ...props }: SplitPaneProps = $props();

    const paneIdPrefix = $props.id();

    let root = $state<HTMLDivElement>();
    let draggingIndex = $state(NO_GUTTER_DRAGGING);
    let collapsedBoundaries = $state.raw<SplitPaneCollapsedBoundaries>({});

    let hasDragged = false;

    const orientation = $derived(props.orientation ?? SPLIT_PANE_DEFAULTS.orientation);
    const isHorizontal = $derived(orientation === "horizontal");
    const gutterSize = $derived(props.gutterSize ?? SPLIT_PANE_DEFAULTS.gutterSize);
    const keyStep = $derived(props.keyStep ?? SPLIT_PANE_DEFAULTS.keyStep);
    const isDisabled = $derived(props.isDisabled ?? false);
    const paneCount = $derived(props.panes.length);

    const ratios = $derived(SplitPaneUtils.computeRatios(paneCount, storedRatios));

    const getRootSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => root);
    const getDirection = NavigatorSvelteUtils.createDirection(() => root);

    const totalGutterSize = $derived(SplitPaneUtils.computeTotalGutterSize(gutterSize, paneCount));
    const availablePx = $derived((isHorizontal ? getRootSize().width : getRootSize().height) - totalGutterSize);

    watchChange(
        () => ratios,
        (next) => {
            collapsedBoundaries = SplitPaneUtils.pruneCollapsed(collapsedBoundaries, next);
        },
        { isBeforeRender: true },
    );

    const getPaneId = (index: number) => props.panes[index]?.id ?? `${paneIdPrefix}-pane-${index}`;

    const getBoundary = (index: number) => SplitPaneUtils.computeBoundary(ratios, index);

    const computeBoundaryLimits = (index: number) =>
        SplitPaneUtils.computeBoundaryLimits({ ratios, index, panes: props.panes, availablePx });

    const moveBoundary = (index: number, boundary: number) => {
        collapsedBoundaries = SplitPaneUtils.forgetCollapsed(collapsedBoundaries, index);

        const next = SplitPaneUtils.computeMovedRatios({ ratios, index, boundary, panes: props.panes, availablePx });

        storedRatios = next;

        return next;
    };

    const toggleCollapsed = (index: number) => {
        const collapsed = collapsedBoundaries[index];

        if (collapsed !== undefined) {
            moveBoundary(index, collapsed.restore);

            return;
        }

        const restore = getBoundary(index);
        const next = moveBoundary(index, SplitPaneUtils.SMALLEST_BOUNDARY);
        const collapsedAt = SplitPaneUtils.computeBoundary(next, index);

        collapsedBoundaries = { ...collapsedBoundaries, [index]: { restore, collapsedAt } };
    };

    const handleGutterPointerDown = (e: GutterPointerEvent, index: number) => {
        if (e.button !== 0 || isDisabled) return;

        e.preventDefault();

        hasDragged = false;

        e.currentTarget.setPointerCapture(e.pointerId);
        draggingIndex = index;
    };

    const handleGutterPointerMove = (e: GutterPointerEvent, index: number) => {
        if (draggingIndex !== index || !root) return;

        const boundary = SplitPaneUtils.computePointerBoundary({
            point: e,
            rootRect: root.getBoundingClientRect(),
            index,
            orientation,
            direction: getDirection(),
            gutterSize,
            paneCount,
        });

        if (boundary === undefined) return;

        hasDragged = true;

        moveBoundary(index, boundary);
    };

    const handleGutterPointerUp = (e: GutterPointerEvent, index: number) => {
        if (draggingIndex !== index) return;

        e.currentTarget.releasePointerCapture(e.pointerId);
        draggingIndex = NO_GUTTER_DRAGGING;

        if (hasDragged) return;

        moveBoundary(
            index,
            SplitPaneUtils.computePressBoundary({
                point: e,
                gutterRect: e.currentTarget.getBoundingClientRect(),
                orientation,
                direction: getDirection(),
                boundary: getBoundary(index),
                step: keyStep,
            }),
        );
    };

    const handleGutterPointerCancel = (index: number) => {
        if (draggingIndex !== index) return;

        draggingIndex = NO_GUTTER_DRAGGING;
    };

    const handleGutterKeyDown = (e: KeyboardEvent, index: number) => {
        if (isDisabled) return;

        const action = SplitPaneUtils.computeKeyAction(e.key, orientation, getDirection());

        if (!action) return;

        e.preventDefault();

        if (action === "toggle") {
            toggleCollapsed(index);

            return;
        }

        if (action === "home" || action === "end") {
            moveBoundary(index, action === "home" ? SplitPaneUtils.SMALLEST_BOUNDARY : SplitPaneUtils.LARGEST_BOUNDARY);

            return;
        }

        moveBoundary(index, getBoundary(index) + (action === "decrease" ? -keyStep : keyStep));
    };

    const template = $derived(SplitPaneUtils.computeTemplate(props.panes, ratios, gutterSize));
</script>

<div
    bind:this={root}
    class={styles.splitPaneRoot}
    style:grid-template-columns={isHorizontal ? template : undefined}
    style:grid-template-rows={isHorizontal ? undefined : template}
    role="group"
    aria-label={props.ariaLabel}
>
    {#each props.panes as pane, index}
        {#if index > 0}
            {@const limits = computeBoundaryLimits(index - 1)}
            <button
                type="button"
                class={styles.splitPaneGutter}
                role="separator"
                tabindex={isDisabled ? -1 : 0}
                aria-orientation={isHorizontal ? "vertical" : "horizontal"}
                aria-controls={getPaneId(index - 1)}
                aria-label={props.panes[index - 1].gutterAriaLabel}
                aria-disabled={isDisabled || undefined}
                aria-valuenow={Math.round(getBoundary(index - 1) * PERCENT)}
                aria-valuemin={Math.round(limits.floor * PERCENT)}
                aria-valuemax={Math.round(limits.ceiling * PERCENT)}
                onpointerdown={(e) => handleGutterPointerDown(e, index - 1)}
                onpointermove={(e) => handleGutterPointerMove(e, index - 1)}
                onpointerup={(e) => handleGutterPointerUp(e, index - 1)}
                onpointercancel={() => handleGutterPointerCancel(index - 1)}
                onkeydown={(e) => handleGutterKeyDown(e, index - 1)}
            >
                {@render props.renderGutter({ isDragging: draggingIndex === index - 1, isDisabled })}
            </button>
        {/if}

        <div id={getPaneId(index)} class={styles.splitPanePane}>
            {@render props.renderPane(pane, index)}
        </div>
    {/each}
</div>
