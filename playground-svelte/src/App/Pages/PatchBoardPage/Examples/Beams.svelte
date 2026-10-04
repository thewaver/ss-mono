<script lang="ts">
    import { Button, PatchBoard } from "@thewaver/ss-components-svelte";
    import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { BOARD_HEIGHT_RATIO } from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.css";
    import { computePatchCablePath } from "@thewaver/ss-playground/App/StyledComponents/PatchBoardContent/PatchBoardContent.const";

    import PageBeam from "../../../StyledComponents/Beam/PageBeam.svelte";
    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PagePatchCable from "../../../StyledComponents/PatchBoardContent/PagePatchCable.svelte";
    import PagePatchNode from "../../../StyledComponents/PatchBoardContent/PagePatchNode.svelte";
    import PagePatchSocket from "../../../StyledComponents/PatchBoardContent/PagePatchSocket.svelte";
    import type { PatchBoardExampleProps } from "../PatchBoardPage.types";

    type Props = PatchBoardExampleProps;

    let { nodes = $bindable(), links = $bindable(), ...props }: Props = $props();

    let isPlaying = $state(true);
</script>

<div class={styles.beamStage}>
    <PatchBoard
        bind:nodes
        bind:links
        groupId={"beams"}
        ariaLabel={"Signal chain with its signal running"}
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
            <PagePatchCable {defs} />

            {#if !defs.isPending}
                <PageBeam
                    d={computePatchCablePath(defs)}
                    direction={defs.fromKind === "out" ? "forward" : "backward"}
                    {isPlaying}
                />
            {/if}
        {/snippet}
    </PatchBoard>

    <Button
        id={"patchBeamsPlayback"}
        onClick={() => {
            isPlaying = !isPlaying;
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>{isPlaying ? "Pause" : "Play"}</PageButtonContent>
        {/snippet}
    </Button>
</div>
