<script lang="ts" generics="T">
    import { on } from "svelte/events";

    import {
        BRACKET_DEFAULTS,
        BRACKET_MISSING_PLACEMENT,
        BracketUtils,
        NavigatorUtils,
        BracketStyles as styles,
    } from "@thewaver/ss-components";

    import type { BracketProps } from "./Bracket.types.js";

    const NOTHING = 0;

    let props: BracketProps<T> = $props();

    const boardId = $props.id();
    const nodeRefs = new Map<string, HTMLElement>();

    let lastFocusedId = $state<string>();
    let hasFocus = $state(false);

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

    const focusedId = $derived(hasFocus ? lastFocusedId : undefined);
    const boardSize = $derived(geometry.boardSize);
    const connectors = $derived(BracketUtils.computeConnectors(layout, geometry, boardId, focusedId));

    const placementById = $derived(new Map(layout.placements.map((placement) => [placement.id, placement])));

    const stops = $derived(layout.placements.filter((placement) => !placement.isDisabled));
    const rovingId = $derived(BracketUtils.resolveRovingId(stops, lastFocusedId));

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
        nodeRefs.get(next)?.focus();
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
    {@const inset = BracketUtils.computeInset(geometry, placement)}
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
                lastFocusedId = id;
                hasFocus = true;
            }}
            onblur={() => {
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
            {@render props.renderConnector?.(defs)}
        {/each}
    </svg>

    {#if props.renderLayerHeader}
        {#each { length: layout.layerCount }, layer}
            {@const headerId = `${boardId}-layer-${layer}`}
            {@const headerBox = BracketUtils.computeHeaderBox(geometry, layer)}
            <div
                id={headerId}
                class={styles.bracketLayerHeader}
                style:left={`${headerBox.left}px`}
                style:top={`${headerBox.top}px`}
                style:width={`${headerBox.width}px`}
                style:height={`${headerBox.height}px`}
            >
                {@render props.renderLayerHeader(layer)}
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
