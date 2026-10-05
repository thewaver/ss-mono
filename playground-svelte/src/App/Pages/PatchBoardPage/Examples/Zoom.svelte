<script lang="ts">
    import { Button, PatchBoard } from "@thewaver/ss-components-svelte";
    import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import {
        BOARD_HEIGHT_RATIO,
        MAX_ZOOM,
        MIN_ZOOM,
        ZOOM_STEP,
    } from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.css";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PagePatchCable from "../../../StyledComponents/PatchBoardContent/PagePatchCable.svelte";
    import PagePatchNode from "../../../StyledComponents/PatchBoardContent/PagePatchNode.svelte";
    import PagePatchSocket from "../../../StyledComponents/PatchBoardContent/PagePatchSocket.svelte";
    import type { PatchBoardZoomExampleProps } from "../PatchBoardPage.types";

    type Props = PatchBoardZoomExampleProps;

    let { nodes = $bindable(), links = $bindable(), ...props }: Props = $props();
</script>

<div class={styles.zoomStage}>
    <div class={styles.zoomControls}>
        <Button
            id={"patchBoardZoomOut"}
            isDisabled={props.zoom <= MIN_ZOOM}
            onClick={() => props.onZoomChange(props.zoom - ZOOM_STEP)}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Zoom out</PageButtonContent>
            {/snippet}
        </Button>
        <Button
            id={"patchBoardZoomIn"}
            isDisabled={props.zoom >= MAX_ZOOM}
            onClick={() => props.onZoomChange(props.zoom + ZOOM_STEP)}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Zoom in</PageButtonContent>
            {/snippet}
        </Button>
    </div>

    <PageMeasureBox>
        <div class={styles.zoomWindow}>
            <div class={styles.zoomScaler} style:transform={`scale(${props.zoom})`}>
                <PatchBoard
                    bind:nodes
                    bind:links
                    groupId={"zoom"}
                    ariaLabel={"Zoomed chain"}
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
            </div>
        </div>
    </PageMeasureBox>
</div>
