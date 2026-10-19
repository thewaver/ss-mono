<script lang="ts" generics="T">
    import { untrack } from "svelte";
    import { on } from "svelte/events";

    import {
        BRACKET_DEFAULTS,
        BRACKET_MISSING_PLACEMENT,
        type BracketNode,
        type BracketPlacement,
        BracketUtils,
        NavigatorUtils,
        PanZoomUtils,
        BracketStyles as styles,
    } from "@thewaver/ss-components";

    import { ElementObserverSvelteUtils } from "../../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { PanZoomSvelteUtils } from "../../../Abstracts/PanZoom/PanZoomSvelte.utils.svelte.js";
    import { createHeldValue } from "../../../Utils/bindableUtils.svelte.js";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import type { BracketProps } from "./Bracket.types.js";

    const NOTHING = 0;

    let { family = $bindable(), view = $bindable(), ...props }: BracketProps<T> = $props();

    const boardId = $props.id();
    const nodeRefs = new Map<string, HTMLElement>();

    let lastFocusedId = $state<string>();
    let hasFocus = $state(false);
    let windowRef = $state<HTMLElement>();

    const getWindowSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => windowRef);

    const orientation = $derived(props.orientation ?? BRACKET_DEFAULTS.orientation);
    const rootSide = $derived(props.rootSide ?? BRACKET_DEFAULTS.rootSide);

    const layout = $derived(BracketUtils.computeLayout(props.root));

    const geometry = $derived(
        BracketUtils.computeGeometry(layout, {
            nodeSize: props.nodeSize,
            layerGap: props.layerGap ?? BRACKET_DEFAULTS.layerGap,
            crossGap: props.crossGap ?? BRACKET_DEFAULTS.crossGap,
            orientation,
            rootSide,
            headerExtent: props.renderLayerHeader
                ? (props.layerHeaderSize ?? BRACKET_DEFAULTS.layerHeaderSize)
                : NOTHING,
        }),
    );

    const boardSize = $derived(geometry.boardSize);

    const isPannable = $derived(props.isPannable ?? BRACKET_DEFAULTS.isPannable);
    const isZoomable = $derived(props.isZoomable ?? BRACKET_DEFAULTS.isZoomable);
    const familyMargin = $derived(props.familyMargin ?? BRACKET_DEFAULTS.familyMargin);

    const panZoom = PanZoomSvelteUtils.create({
        getSource: () =>
            view === undefined
                ? undefined
                : [
                      () => view!,
                      (next) => {
                          view = next;
                      },
                  ],
        getWindowRef: () => windowRef,
        getSize: getWindowSize,
        getRange: () => BracketUtils.computeWholeView(geometry),
        getMinWidth: () => getWindowSize().width / (props.maxScale ?? BRACKET_DEFAULTS.maxScale),
        getDurationMs: () => props.transitionDurationMs ?? BRACKET_DEFAULTS.transitionDurationMs,
        getIsPannable: () => isPannable,
        getIsZoomable: () => isZoomable,
        getCanCenterEdges: (requested) =>
            (props.isFollowingFamily ?? BRACKET_DEFAULTS.isFollowingFamily) &&
            getWindowSize().width > NOTHING &&
            BracketUtils.computeFamilyInView(
                layout,
                geometry,
                requested,
                getWindowSize().height / getWindowSize().width,
                familyMargin,
            ) !== undefined,
        onGestureMove: () => followView(),
        onSettle: () => snapToFamily(),
    });

    $effect(() => untrack(() => props.onMount?.(panZoom.controller)));

    const boardTransform = $derived.by(() => {
        if (!panZoom.getIsActive()) return undefined;

        const shownView = panZoom.getShownView();
        const scale = PanZoomUtils.computeScale(shownView, getWindowSize().width);

        return `scale(${scale}) translate(${-shownView.x.start}px, ${-shownView.y.start}px)`;
    });

    const focusedId = $derived(hasFocus ? lastFocusedId : undefined);

    const [getFamily, setFamily] = createHeldValue<BracketNode<T> | undefined>([
        () => family,
        (next) => {
            family = next;
        },
    ]);

    const anchorId = $derived(BracketUtils.findNodeId(props.root, layout, getFamily()));

    const currentLayer = $derived(BracketUtils.getFamilyLayer(layout, anchorId));

    const isFollowingFamily = $derived(
        panZoom.getIsActive() && (props.isFollowingFamily ?? BRACKET_DEFAULTS.isFollowingFamily),
    );

    const computeFamilyInView = () =>
        BracketUtils.computeFamilyInView(
            layout,
            geometry,
            panZoom.getView(),
            panZoom.getAspect(),
            familyMargin,
        );

    const isFamilyFramed = $derived(!isFollowingFamily || computeFamilyInView() !== undefined);

    let followedFamily: { anchorId: string | undefined } | undefined;

    const setFamilyByAnchor = (familyAnchorId: string | undefined) => {
        setFamily(familyAnchorId === undefined ? undefined : BracketUtils.findNode(props.root, familyAnchorId));
    };

    const frameFamily = (familyAnchorId: string | undefined) => {
        panZoom.setView(BracketUtils.computeFamilyView(layout, geometry, familyAnchorId, familyMargin), false);
    };

    const followView = () => {
        if (!untrack(() => isFollowingFamily)) return;

        const inView = untrack(computeFamilyInView);

        if (inView === undefined || inView.anchorId === untrack(() => anchorId)) return;

        followedFamily = inView;
        setFamilyByAnchor(inView.anchorId);
    };

    const snapToFamily = () => {
        if (
            !untrack(() => isFollowingFamily) ||
            !(props.isSnappingToFamily ?? BRACKET_DEFAULTS.isSnappingToFamily)
        )
            return;

        const inView = untrack(computeFamilyInView);

        if (inView === undefined) {
            panZoom.setView(BracketUtils.computeWholeView(untrack(() => geometry)), false);

            return;
        }

        followView();
        frameFamily(inView.anchorId);
    };

    watchChange(
        () => ({ geometry, size: getWindowSize() }),
        (_current, previous) => {
            if (!isFollowingFamily) return;

            if (previous.size.width <= NOTHING) return;

            const wasFramed =
                BracketUtils.computeFamilyInView(
                    layout,
                    previous.geometry,
                    panZoom.getRequestedView(),
                    previous.size.height / previous.size.width,
                    familyMargin,
                ) !== undefined;

            if (wasFramed) frameFamily(anchorId);
        },
    );

    watchChange(
        () => anchorId,
        (nextAnchorId) => {
            const followed = followedFamily;

            followedFamily = undefined;

            if (!isFollowingFamily || (followed !== undefined && followed.anchorId === nextAnchorId)) return;

            frameFamily(nextAnchorId);
        },
    );

    const placementById = $derived(new Map(layout.placements.map((placement) => [placement.id, placement])));

    const stops = $derived(layout.placements.filter((placement) => !placement.isDisabled));
    const rovingId = $derived(BracketUtils.resolveRovingId(stops, lastFocusedId));

    const getIsNode = (eventTarget: EventTarget | null) =>
        [...nodeRefs.values()].some((element) => element === eventTarget);

    const showFamilyOf = (id: string) => {
        const familyAnchorId = BracketUtils.getFamilyAnchorId(id);

        setFamilyByAnchor(familyAnchorId);
    };

    const getInset = (placement: BracketPlacement) => BracketUtils.computeInset(geometry, placement);

    const getHeaderBox = (layer: number) => {
        const box = BracketUtils.computeHeaderBox(geometry, layer);

        if (!panZoom.getIsActive()) return box;

        const shownView = panZoom.getShownView();

        return geometry.isHorizontal ? { ...box, top: shownView.y.start } : { ...box, left: shownView.x.start };
    };

    const connectors = $derived(BracketUtils.computeConnectors(layout, geometry, boardId, focusedId));

    const revealNode = (id: string) => {
        const placement = placementById.get(id);

        if (!panZoom.getIsActive() || placement === undefined) return;

        const inset = getInset(placement);

        panZoom.controller.showArea({
            x: { start: inset.left, end: inset.left + props.nodeSize.width },
            y: { start: inset.top, end: inset.top + props.nodeSize.height },
        });
    };

    const activate = (id: string) => {
        props.onActivate?.(
            BracketUtils.findNode(props.root, id).value,
            placementById.get(id) ?? BRACKET_MISSING_PLACEMENT,
        );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (rovingId === undefined) return;

        if (NavigatorUtils.getIsActivationKey(e.key)) {
            e.preventDefault();
            activate(rovingId);

            return;
        }

        const step = BracketUtils.getKeyStep(e.key, orientation, rootSide);

        if (step === undefined) return;

        const next = BracketUtils.computeStepId(step, rovingId, stops);

        if (next === undefined) return;

        e.preventDefault();
        lastFocusedId = next;
        nodeRefs.get(next)?.focus({ preventScroll: panZoom.getIsActive() });
    };

    const attachNode = (id: string) => (element: HTMLElement) => {
        nodeRefs.set(id, element);

        return () => {
            if (nodeRefs.get(id) === element) nodeRefs.delete(id);
        };
    };
</script>

{#snippet item(id: string)}
    {@const placement = placementById.get(id) ?? BRACKET_MISSING_PLACEMENT}
    {@const isNodeDisabled = placement.isDisabled}
    {@const inset = getInset(placement)}
    <li
        class={styles.bracketItem}
        style:left={`${inset.left}px`}
        style:top={`${inset.top}px`}
        style:width={`${props.nodeSize.width}px`}
        style:height={`${props.nodeSize.height}px`}
    >
        <div
            {@attach attachNode(id)}
            {@attach (element) =>
                on(element, "click", () => {
                    if (isNodeDisabled) return;

                    lastFocusedId = id;
                    activate(id);
                })}
            class={styles.bracketNode}
            role="button"
            tabindex={isNodeDisabled ? undefined : id === rovingId ? 0 : -1}
            aria-disabled={isNodeDisabled || undefined}
            onfocus={() => {
                showFamilyOf(id);
                lastFocusedId = id;
                hasFocus = true;
                revealNode(id);
            }}
            onblur={(e) => {
                if (getIsNode(e.relatedTarget)) return;

                hasFocus = false;
            }}
        >
            {@render props.renderNode(BracketUtils.findNode(props.root, id), {
                placement,
                isFocused: focusedId === id,
                isOnFocusedRoute: BracketUtils.getIsOnRoute(id, focusedId),
            })}
        </div>
    </li>
{/snippet}

{#snippet board()}
    <div
        class={styles.bracketRoot}
        style:width={`${boardSize.width}px`}
        style:height={`${boardSize.height}px`}
        style:transform={boardTransform}
        role={props.renderLayerHeader ? "group" : undefined}
        aria-label={props.renderLayerHeader ? props.ariaLabel : undefined}
        onkeydown={handleKeyDown}
    >
        <svg
            class={styles.bracketConnectors}
            viewBox={`0 0 ${boardSize.width} ${boardSize.height}`}
            aria-hidden="true"
        >
            {#each connectors as defs}
                {@render props.renderConnector?.(defs)}
            {/each}
        </svg>

        {#if props.renderLayerHeader}
            {#each { length: layout.layerCount }, layer}
                {@const headerId = `${boardId}-layer-${layer}`}
                {@const headerBox = getHeaderBox(layer)}
                <div
                    id={headerId}
                    class={styles.bracketLayerHeader}
                    style:left={`${headerBox.left}px`}
                    style:top={`${headerBox.top}px`}
                    style:width={`${headerBox.width}px`}
                    style:height={`${headerBox.height}px`}
                    style:pointer-events={panZoom.getIsActive() ? "none" : undefined}
                >
                    {@render props.renderLayerHeader(layer, { isCurrent: isFamilyFramed && currentLayer === layer })}
                </div>

                <ul class={styles.bracketList} aria-labelledby={headerId}>
                    {#each layout.placements.filter((placement) => placement.layer === layer) as placement (placement.id)}
                        {@render item(placement.id)}
                    {/each}
                </ul>
            {/each}
        {:else}
            <ul class={styles.bracketList} aria-label={props.ariaLabel}>
                {#each layout.placements as placement (placement.id)}
                    {@render item(placement.id)}
                {/each}
            </ul>
        {/if}
    </div>
{/snippet}

{#if panZoom.getIsActive()}
    <div
        bind:this={windowRef}
        {@attach (element) => on(element, "pointerdown", (e) => panZoom.gestures.press(e))}
        {@attach (element) => on(element, "pointermove", (e) => panZoom.gestures.move(e, e.currentTarget))}
        {@attach (element) => on(element, "pointerup", (e) => panZoom.gestures.release(e, e.currentTarget))}
        {@attach (element) => on(element, "pointercancel", (e) => panZoom.gestures.release(e, e.currentTarget))}
        {@attach (element) => on(element, "wheel", (e) => panZoom.gestures.wheel(e), { passive: false })}
        class={styles.bracketWindow}
        style:touch-action={isPannable || isZoomable ? "none" : undefined}
        style:user-select={isPannable ? "none" : undefined}
        onscroll={(e) => {
            e.currentTarget.scrollLeft = NOTHING;
            e.currentTarget.scrollTop = NOTHING;
        }}
    >
        {@render board()}
    </div>
{:else}
    {@render board()}
{/if}
