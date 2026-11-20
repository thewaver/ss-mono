<script lang="ts">
    import { PatchBoard } from "@thewaver/ss-components-svelte";
    import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { BOARD_HEIGHT_RATIO, BOARD_WIDTH } from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.const";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PagePatchCable from "../../../StyledComponents/PatchBoardContent/PagePatchCable.svelte";
    import PagePatchNode from "../../../StyledComponents/PatchBoardContent/PagePatchNode.svelte";
    import PagePatchSocket from "../../../StyledComponents/PatchBoardContent/PagePatchSocket.svelte";
    import type { PatchBoardSharedExampleProps } from "../PatchBoardPage.types";

    type Props = PatchBoardSharedExampleProps;

    const GROUP_ID = "studio";

    let {
        firstNodes = $bindable(),
        secondNodes = $bindable(),
        firstLinks = $bindable(),
        secondLinks = $bindable(),
        ...props
    }: Props = $props();
</script>

<PageMeasureBox width={BOARD_WIDTH}>
    <PatchBoard
        bind:nodes={firstNodes}
        bind:links={firstLinks}
        groupId={GROUP_ID}
        ariaLabel={"Instruments"}
        announcements={PATCH_BOARD_ANNOUNCEMENTS}
        heightRatio={BOARD_HEIGHT_RATIO}
        socketSize={props.socketSize}
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
</PageMeasureBox>

<PageMeasureBox width={BOARD_WIDTH}>
    <PatchBoard
        bind:nodes={secondNodes}
        bind:links={secondLinks}
        groupId={GROUP_ID}
        ariaLabel={"Outputs"}
        announcements={PATCH_BOARD_ANNOUNCEMENTS}
        heightRatio={BOARD_HEIGHT_RATIO}
        socketSize={props.socketSize}
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
</PageMeasureBox>
