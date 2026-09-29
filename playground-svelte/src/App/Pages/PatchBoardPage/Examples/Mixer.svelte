<script lang="ts">
    import { PatchBoard } from "@thewaver/ss-components-svelte";
    import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import {
        AMP_NODE_KEY,
        MIXER_NODE_KEY,
        STANDING_BOARD_HEIGHT_RATIO,
    } from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.const";

    import PagePatchCable from "../../../StyledComponents/PatchBoardContent/PagePatchCable.svelte";
    import PagePatchNode from "../../../StyledComponents/PatchBoardContent/PagePatchNode.svelte";
    import PagePatchSocket from "../../../StyledComponents/PatchBoardContent/PagePatchSocket.svelte";
    import type { PatchBoardExampleProps } from "../PatchBoardPage.types";

    type Props = PatchBoardExampleProps;

    let { nodes = $bindable(), links = $bindable(), ...props }: Props = $props();
</script>

<PatchBoard
    bind:nodes
    bind:links
    groupId={"mixer"}
    ariaLabel={"Mixing desk"}
    announcements={PATCH_BOARD_ANNOUNCEMENTS}
    heightRatio={STANDING_BOARD_HEIGHT_RATIO}
    orientation={"vertical"}
    socketSize={props.socketSize}
    isLocked={props.isLocked}
    isDisabled={props.isDisabled}
    computeNodeKey={(device) => device.id}
    computeNodeLabel={(device) => device.name}
    computeCanLink={(link) => link.to.nodeKey !== AMP_NODE_KEY || link.from.nodeKey === MIXER_NODE_KEY}
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
        <PagePatchCable {defs} />
    {/snippet}
</PatchBoard>
