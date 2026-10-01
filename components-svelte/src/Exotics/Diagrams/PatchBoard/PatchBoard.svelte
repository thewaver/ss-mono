<script lang="ts" generics="T">
    import { untrack } from "svelte";
    import { on } from "svelte/events";

    import {
        CarrierUtils,
        LiveAnnouncerUtils,
        PATCH_BOARD_DEFAULTS,
        type PatchBoardCarry,
        type PatchBoardHandle,
        type PatchBoardNode,
        type PatchBoardPlace,
        type PatchBoardPlacedSocket,
        PatchBoardUtils,
        PlacementUtils,
        PatchBoardStyles as styles,
    } from "@thewaver/ss-components";

    import { CarrierSvelteUtils } from "../../../Abstracts/Carrier/CarrierSvelte.utils.svelte.js";
    import { LabelSvelteUtils } from "../../../Essentials/Input/Label/LabelSvelte.utils.svelte.js";
    import InteractionWrapper from "../../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import type { PatchBoardProps } from "./PatchBoard.types.js";

    const NOTHING = 0;
    const FULL_WIDTH = 1;

    let { nodes = $bindable(), links = $bindable(), ...props }: PatchBoardProps<T> = $props();

    const boardId = $props.id();
    const nodeHintId = `${boardId}-node-hint`;
    const socketHintId = `${boardId}-socket-hint`;

    const stopRefs = new Map<string, HTMLElement>();

    let root = $state<HTMLDivElement>();
    let focusedStop = $state<string>();

    const getAriaLabel = LabelSvelteUtils.resolveAriaLabel(() => props.ariaLabel);

    const isDisabled = $derived(props.isDisabled ?? false);
    const isLocked = $derived(props.isLocked ?? false);
    const orientation = $derived(props.orientation ?? PATCH_BOARD_DEFAULTS.orientation);
    const socketSize = $derived(props.socketSize ?? PATCH_BOARD_DEFAULTS.socketSize);

    const focusStop = (stopKey: string | undefined) => {
        if (stopKey === undefined) return;

        focusedStop = stopKey;
        stopRefs.get(stopKey)?.focus();
    };

    const board: PatchBoardHandle<T> = PatchBoardUtils.createBoard<T>({
        getZone: () => board.zone,
        getGroupId: () => props.groupId,
        getLabel: () => props.ariaLabel,
        getRootRef: () => root ?? undefined,
        getIsDisabled: () => isDisabled,
        getIsLocked: () => isLocked,
        getAnnouncements: () => props.announcements,
        getHeightRatio: () => props.heightRatio,
        getSocketReach: () => props.socketReach ?? PATCH_BOARD_DEFAULTS.socketReach,
        getStepSize: () => props.stepSize ?? PATCH_BOARD_DEFAULTS.stepSize,
        getSnapSpot: () => props.computeSnapSpot,
        getCanLink: () => props.computeCanLink,
        getNodes: () => nodes,
        getLinks: () => links,
        getPlacements: () => placements,
        getPlacedSocketByEndKey: () => placedByEndKey,
        computeNodeKey: (value) => props.computeNodeKey(value),
        computeNodeLabel: (value) => props.computeNodeLabel(value),
        updateNodes: (update) => {
            nodes = update(nodes);
        },
        updateLinks: (update) => {
            links = update(links);
        },
        focusStop,
        onLink: (link) => props.onLink?.(link),
        onUnlink: (link) => props.onUnlink?.(link),
        onMove: (nodeKey, spot) => props.onMove?.(nodeKey, spot),
    });

    const zone = board.zone;

    CarrierSvelteUtils.registerZone(zone);

    const isSource = $derived(
        CarrierSvelteUtils.getCarry() !== undefined && CarrierSvelteUtils.getSourceZone() === zone,
    );
    const carriedValue = $derived(isSource ? (CarrierSvelteUtils.getCarry()?.value as PatchBoardCarry<T>) : undefined);
    const carriedNodeKey = $derived(carriedValue?.kind === "node" ? CarrierSvelteUtils.getCarry()?.key : undefined);
    const plugSource = $derived(carriedValue?.kind === "plug" ? carriedValue.from : undefined);
    const aimedPlace = $derived(isSource ? (CarrierSvelteUtils.getTargetPlace() as PatchBoardPlace) : undefined);

    const placements = $derived(PatchBoardUtils.getPlacements(nodes, props.computeNodeKey, carriedNodeKey, aimedPlace));
    const placementByKey = $derived(new Map(placements.map((placement) => [placement.key, placement])));
    const placedByEndKey = $derived(
        PatchBoardUtils.getPlacedSocketByEndKey(PatchBoardUtils.getPlacedSockets(placements, orientation)),
    );

    const stopKeys = $derived(PatchBoardUtils.getStopKeys(placements));
    const rovingStop = $derived(
        focusedStop !== undefined && stopKeys.includes(focusedStop) ? focusedStop : stopKeys[NOTHING],
    );

    const cableDefs = $derived(
        PatchBoardUtils.getCableDefs(
            links,
            placedByEndKey,
            orientation,
            plugSource && aimedPlace
                ? {
                      key: `${boardId}-pending`,
                      from: plugSource,
                      place: aimedPlace,
                      isAllowed: CarrierSvelteUtils.getIsTargetAllowed(),
                  }
                : undefined,
        ),
    );

    $effect(() => {
        LiveAnnouncerUtils.reserve("polite");
    });

    $effect(() => {
        if (!isSource) return;

        return untrack(() => board.observeTapAim());
    });

    $effect(() => {
        const element = root;

        if (!element) return;

        return untrack(() => board.observeClicks(element));
    });

    const scrollKey = $derived(
        !aimedPlace || aimedPlace.kind === "free" || CarrierSvelteUtils.getCarryMode() !== "key"
            ? undefined
            : aimedPlace.kind === "spot"
              ? carriedNodeKey
              : PatchBoardUtils.getEndKey(aimedPlace),
    );

    $effect(() => {
        const key = scrollKey;

        aimedPlace;

        if (key === undefined) return;

        untrack(() => stopRefs.get(key)?.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });

    $effect(() => {
        if (!isDisabled || !isSource) return;

        untrack(() => CarrierUtils.end("cancel"));
    });

    $effect(() => () => board.cancel());

    const attachStop = (stopKey: string) => (element: HTMLElement) => {
        stopRefs.set(stopKey, element);

        return () => {
            if (stopRefs.get(stopKey) === element) stopRefs.delete(stopKey);
        };
    };
</script>

{#snippet socketAt(node: PatchBoardNode<T>, nodeKey: string, socket: PatchBoardNode<T>["sockets"][number])}
    {@const end = { nodeKey, socketId: socket.id }}
    {@const stopKey = PatchBoardUtils.getEndKey(end)}
    {@const placed: PatchBoardPlacedSocket | undefined = placedByEndKey.get(stopKey)}
    {@const placement = placementByKey.get(nodeKey)}
    {@const socketFlags = PatchBoardUtils.getSocketFlags(end, socket.kind, {
        placed,
        links,
        aimedPlace,
        plugSource,
        getIsEndAllowed: board.getIsEndAllowed,
    })}
    <div
        class={styles.patchBoardSocketHolder}
        style:left={PlacementUtils.toContainerWidth((placed?.point.x ?? NOTHING) - (placement?.spot.x ?? NOTHING))}
        style:top={PlacementUtils.toContainerWidth((placed?.point.y ?? NOTHING) - (placement?.spot.y ?? NOTHING))}
        style:width={PlacementUtils.toContainerWidth(socketSize)}
        style:height={PlacementUtils.toContainerWidth(socketSize)}
    >
        <InteractionWrapper
            sizing="fill"
            isDisabled={(node.isDisabled ?? false) || (socket.isDisabled ?? false)}
            isFocusableWhenDisabled={!isDisabled}
            isTabbable={rovingStop === stopKey}
            extraFlags={socketFlags}
        >
            {#snippet renderControl(attachElement, flags)}
                <div
                    {@attach attachStop(stopKey)}
                    {@attach attachElement}
                    {@attach (element) => on(element, "pointerdown", (e) => board.handleSocketPointerDown(placed, e))}
                    {@attach (element) => on(element, "click", (e) => board.handleSocketClick(placed, e))}
                    {@attach (element) =>
                        on(element, "keydown", (e) => board.handleStopKeyDown(stopKey, node, placed, e))}
                    class={styles.patchBoardSocket}
                    role="button"
                    aria-label={props.announcements.computeSocketLabel(
                        board.getEndLabel(end),
                        socket.kind,
                        socketFlags.isTaken,
                    )}
                    aria-disabled={placed?.isDisabled || isLocked || undefined}
                    aria-describedby={socketHintId}
                    onfocusin={() => {
                        focusedStop = stopKey;
                    }}
                >
                    {@render props.renderSocket?.(socket, flags)}
                </div>
            {/snippet}
        </InteractionWrapper>
    </div>
{/snippet}

<div
    bind:this={root}
    {@attach (element) => on(element, "click", (e) => board.handleRootClick(e))}
    id={boardId}
    class={styles.patchBoardRoot}
    role="group"
    aria-label={getAriaLabel()}
    aria-disabled={isDisabled || undefined}
>
    <div
        class={styles.patchBoardSpacer}
        style:height={PlacementUtils.toContainerWidth(props.heightRatio)}
        aria-hidden="true"
    ></div>
    <div id={nodeHintId} class={styles.patchBoardHint}>
        {props.announcements.nodeRestingKeyHint}
    </div>
    <div id={socketHintId} class={styles.patchBoardHint}>
        {props.announcements.socketRestingKeyHint}
    </div>
    <svg class={styles.patchBoardCables} viewBox={`0 0 ${FULL_WIDTH} ${props.heightRatio}`} aria-hidden="true">
        {#each cableDefs as defs (defs.key)}
            {@render props.renderCable(defs)}
        {/each}
    </svg>

    {#each nodes as node (props.computeNodeKey(node.value))}
        {@const nodeKey = props.computeNodeKey(node.value)}
        {@const placement = placementByKey.get(nodeKey)}
        <div
            class={styles.patchBoardSlot}
            role="group"
            style:left={PlacementUtils.toContainerWidth(placement?.spot.x ?? node.spot.x)}
            style:top={PlacementUtils.toContainerWidth(placement?.spot.y ?? node.spot.y)}
            style:width={PlacementUtils.toContainerWidth(node.sizeShare.width)}
            style:height={PlacementUtils.toContainerWidth(node.sizeShare.height)}
        >
            <div class={styles.patchBoardNodeHolder}>
                <InteractionWrapper
                    sizing="fill"
                    isDisabled={node.isDisabled ?? false}
                    isFocusableWhenDisabled={!isDisabled}
                    isTabbable={rovingStop === nodeKey}
                    extraFlags={{ isCarried: carriedNodeKey === nodeKey }}
                >
                    {#snippet renderControl(attachElement, flags)}
                        <div
                            {@attach attachStop(nodeKey)}
                            {@attach attachElement}
                            {@attach (element) =>
                                on(element, "pointerdown", (e) =>
                                    board.handleNodePointerDown(node, e, e.currentTarget),
                                )}
                            {@attach (element) =>
                                on(element, "click", (e) => board.handleNodeClick(node, e, e.currentTarget))}
                            {@attach (element) =>
                                on(element, "keydown", (e) => board.handleStopKeyDown(nodeKey, node, undefined, e))}
                            class={styles.patchBoardNode}
                            role="button"
                            aria-label={props.computeNodeLabel(node.value)}
                            aria-disabled={(node.isDisabled ?? false) || undefined}
                            aria-describedby={nodeHintId}
                            onfocusin={() => {
                                focusedStop = nodeKey;
                            }}
                        >
                            {@render props.renderNode(node, flags)}
                        </div>
                    {/snippet}
                </InteractionWrapper>
            </div>

            {#each node.sockets as socket (socket.id)}
                {@render socketAt(node, nodeKey, socket)}
            {/each}
        </div>
    {/each}
</div>
