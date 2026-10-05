<script lang="ts" generics="T">
    import { flushSync, untrack } from "svelte";
    import { on } from "svelte/events";

    import {
        BRACKET_DEFAULTS,
        BRACKET_MISSING_PLACEMENT,
        type BracketArrangement,
        type BracketNode,
        BracketUtils,
        NavigatorUtils,
        TreemapUtils,
        BracketStyles as styles,
    } from "@thewaver/ss-components";

    import { createHeldValue } from "../../../Utils/bindableUtils.svelte.js";
    import { readStore } from "../../../Utils/storeUtils.js";
    import type { BracketProps } from "./Bracket.types.js";

    const NOTHING = 0;

    let { family = $bindable(), ...props }: BracketProps<T> = $props();

    const boardId = $props.id();
    const nodeRefs = new Map<string, HTMLElement>();

    let lastFocusedId = $state<string>();
    let hasFocus = $state(false);
    let glideFrom = $state.raw<BracketArrangement>();
    let glidedAnchorId: string | undefined;
    let glidedIsFamilyView: boolean | undefined;
    let lastShown: BracketArrangement | undefined;
    let isStepping = false;

    const glideClock = TreemapUtils.createZoomClock();

    const getProgress = readStore(glideClock);

    const orientation = $derived(props.orientation ?? BRACKET_DEFAULTS.orientation);
    const rootSide = $derived(props.rootSide ?? BRACKET_DEFAULTS.rootSide);
    const isFamilyView = $derived((props.view ?? BRACKET_DEFAULTS.view) === "family");

    const layout = $derived(BracketUtils.computeLayout(props.root));
    const extent = $derived(isFamilyView ? BracketUtils.computeFamilyExtent(layout) : layout);

    const geometry = $derived(
        BracketUtils.computeGeometry(extent, {
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

    const focusedId = $derived(hasFocus ? lastFocusedId : undefined);

    const [getFamily, setFamily] = createHeldValue<BracketNode<T> | undefined>([
        () => family,
        (next) => {
            family = next;
        },
    ]);

    const anchorId = $derived(BracketUtils.findNodeId(props.root, layout, getFamily()));

    const currentLayer = $derived(BracketUtils.getFamilyLayer(layout, anchorId));

    const showFamilyOf = (id: string) => {
        const familyAnchorId = BracketUtils.getFamilyAnchorId(id);

        setFamily(familyAnchorId === undefined ? undefined : BracketUtils.findNode(props.root, familyAnchorId));
    };

    const target = $derived(
        isFamilyView
            ? BracketUtils.computeFamilyArrangement(layout, geometry, extent, anchorId)
            : BracketUtils.computeTreeArrangement(layout, geometry),
    );
    const shown = $derived(BracketUtils.computeShownArrangement(glideFrom, target, getProgress()));

    const boardSize = $derived(shown.boardSize);
    const connectors = $derived(BracketUtils.computeConnectors(layout, geometry, boardId, focusedId, shown.nodes));

    const placementById = $derived(new Map(layout.placements.map((placement) => [placement.id, placement])));

    const stops = $derived(layout.placements.filter((placement) => !placement.isDisabled));
    const unfoldedStops = $derived(stops.filter((placement) => !target.nodes[placement.id]?.isFolded));
    const rovingId = $derived(BracketUtils.resolveRovingId(unfoldedStops, lastFocusedId));

    const getIsNode = (eventTarget: EventTarget | null) =>
        [...nodeRefs.values()].some((element) => element === eventTarget);

    $effect(() => glideClock.stop);

    $effect(() => {
        lastShown = shown;
    });

    $effect.pre(() => {
        const next = anchorId;
        const isFamily = isFamilyView;

        untrack(() => {
            if (next === glidedAnchorId && isFamily === glidedIsFamilyView) return;

            const isViewChange = glidedIsFamilyView !== undefined && glidedIsFamilyView !== isFamily;
            const isFirst = glidedIsFamilyView === undefined;

            glidedAnchorId = next;
            glidedIsFamilyView = isFamily;

            if (isFirst || (!isFamily && !isViewChange)) return;

            glideFrom = lastShown;
            glideClock.start(props.transitionDurationMs ?? BRACKET_DEFAULTS.transitionDurationMs);
        });
    });

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
        isStepping = true;
        showFamilyOf(next);
        lastFocusedId = next;
        flushSync();
        nodeRefs.get(next)?.focus();
        isStepping = false;
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
    {@const frame = shown.nodes[id]}
    {@const inset = frame ?? BracketUtils.computeInset(geometry, placement)}
    {@const isFolded = target.nodes[id]?.isFolded ?? false}
    <li
        class={styles.bracketItem}
        style:left={`${inset.left}px`}
        style:top={`${inset.top}px`}
        style:width={`${props.nodeSize.width}px`}
        style:height={`${props.nodeSize.height}px`}
        style:opacity={frame?.opacity}
        style:visibility={BracketUtils.getIsFrameHidden(frame) ? "hidden" : undefined}
        aria-hidden={isFolded ? "true" : undefined}
        inert={isFolded || undefined}
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
            }}
            onblur={(e) => {
                if (isStepping || getIsNode(e.relatedTarget)) return;

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

<div
    class={styles.bracketRoot}
    style:width={`${boardSize.width}px`}
    style:height={`${boardSize.height}px`}
    role={props.renderLayerHeader ? "group" : undefined}
    aria-label={props.renderLayerHeader ? props.ariaLabel : undefined}
    onkeydown={handleKeyDown}
>
    <svg class={styles.bracketConnectors} viewBox={`0 0 ${boardSize.width} ${boardSize.height}`} aria-hidden="true">
        {#each connectors as defs}
            <g style:opacity={BracketUtils.computeConnectorOpacity(shown.nodes, defs)}>
                {@render props.renderConnector?.(defs)}
            </g>
        {/each}
    </svg>

    {#if props.renderLayerHeader}
        {#each { length: layout.layerCount }, layer}
            {@const headerId = `${boardId}-layer-${layer}`}
            {@const headerBox = BracketUtils.computeHeaderBox(geometry, layer)}
            {@const headerFrame = shown.headers[layer]}
            {@const isHeaderFolded = target.headers[layer]?.isFolded ?? false}
            <div
                id={headerId}
                class={styles.bracketLayerHeader}
                style:left={`${headerFrame?.left ?? headerBox.left}px`}
                style:top={`${headerFrame?.top ?? headerBox.top}px`}
                style:width={`${headerBox.width}px`}
                style:height={`${headerBox.height}px`}
                style:opacity={headerFrame?.opacity}
                style:visibility={BracketUtils.getIsFrameHidden(headerFrame) ? "hidden" : undefined}
                aria-hidden={isHeaderFolded ? "true" : undefined}
            >
                {@render props.renderLayerHeader(layer, { isCurrent: currentLayer === layer })}
            </div>

            <ul
                class={styles.bracketList}
                aria-labelledby={headerId}
                aria-hidden={isHeaderFolded ? "true" : undefined}
            >
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
