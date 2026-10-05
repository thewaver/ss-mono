<script lang="ts">
    import { PatchBoard, PatchBoardSnaps, PatchBoardUtils } from "@thewaver/ss-components-svelte";
    import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import {
        BOARD_HEIGHT_RATIO,
        BOARD_WIDTH,
    } from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.css";

    import PagePatchCable from "../../../StyledComponents/PatchBoardContent/PagePatchCable.svelte";
    import PagePatchNode from "../../../StyledComponents/PatchBoardContent/PagePatchNode.svelte";
    import PagePatchSocket from "../../../StyledComponents/PatchBoardContent/PagePatchSocket.svelte";
    import type { PatchBoardExampleProps } from "../PatchBoardPage.types";

    const GRID_CELL = BOARD_WIDTH * PatchBoardSnaps.GRID_CELL_SIZE;

    type Props = PatchBoardExampleProps;

    let { nodes = $bindable(), links = $bindable(), ...props }: Props = $props();
</script>

<div
    class={styles.rackGrid}
    style:background-size={`${GRID_CELL}px ${GRID_CELL}px`}
    style:background-position={`-${GRID_CELL * 0.5}px -${GRID_CELL * 0.5}px`}
>
    <PatchBoard
        bind:nodes
        bind:links
        groupId={"rack"}
        ariaLabel={"Effects rack"}
        announcements={PATCH_BOARD_ANNOUNCEMENTS}
        heightRatio={BOARD_HEIGHT_RATIO}
        socketSize={props.socketSize}
        isLocked={props.isLocked}
        isDisabled={props.isDisabled}
        computeNodeKey={(device) => device.id}
        computeNodeLabel={(device) => device.name}
        computeSnapSpot={PatchBoardSnaps.grid}
        computeCanLink={(link) => !PatchBoardUtils.getClosesLoop(links, link)}
        onLink={props.onLink}
        onUnlink={props.onUnlink}
        onMove={props.onMove}
    >
        {#snippet renderNode(node, flags)}
            <PagePatchNode label={node.value.name} kind={node.value.kind} {flags} />
        {/snippet}

        {#snippet renderSocket(_socket, flags)}
            <PagePatchSocket {flags} />
        {/snippet}

        {#snippet renderCable(defs)}
            <PagePatchCable {defs} isBeamPlaying={props.isBeamPlaying} />
        {/snippet}
    </PatchBoard>
</div>
