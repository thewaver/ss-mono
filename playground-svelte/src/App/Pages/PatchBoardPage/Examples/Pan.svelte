<script lang="ts">
    import { PATCH_BOARD_DEFAULTS, PatchBoard } from "@thewaver/ss-components-svelte";
    import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import {
        PAN_BOARD_HEIGHT_RATIO,
        PAN_SCALE,
    } from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.css";

    import PagePatchCable from "../../../StyledComponents/PatchBoardContent/PagePatchCable.svelte";
    import PagePatchNode from "../../../StyledComponents/PatchBoardContent/PagePatchNode.svelte";
    import PagePatchSocket from "../../../StyledComponents/PatchBoardContent/PagePatchSocket.svelte";
    import type { PatchBoardExampleProps } from "../PatchBoardPage.types";

    type Props = PatchBoardExampleProps;

    let { nodes = $bindable(), links = $bindable(), ...props }: Props = $props();
</script>

<div class={styles.panWindow}>
    <div class={styles.panBoard}>
        <PatchBoard
            bind:nodes
            bind:links
            groupId={"pan"}
            ariaLabel={"Recording chain"}
            announcements={PATCH_BOARD_ANNOUNCEMENTS}
            heightRatio={PAN_BOARD_HEIGHT_RATIO}
            socketSize={props.socketSize * PAN_SCALE}
            socketReach={PATCH_BOARD_DEFAULTS.socketReach * PAN_SCALE}
            stepSize={PATCH_BOARD_DEFAULTS.stepSize * PAN_SCALE}
            isLocked={props.isLocked}
            isDisabled={props.isDisabled}
            computeNodeKey={(device) => device.id}
            computeNodeLabel={(device) => device.name}
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
</div>
