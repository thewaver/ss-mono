<script lang="ts">
    import { PATCH_BOARD_DEFAULTS, PatchBoard } from "@thewaver/ss-components-svelte";
    import type { PanZoomController } from "@thewaver/ss-components-svelte";
    import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import {
        PAN_BOARD_HEIGHT_RATIO,
        PAN_BOARD_WIDTH,
        PAN_SCALE,
    } from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.css";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PagePanZoomControls from "../../../PageComponents/PanZoomControls/PanZoomControls.svelte";
    import PagePatchCable from "../../../StyledComponents/PatchBoardContent/PagePatchCable.svelte";
    import PagePatchNode from "../../../StyledComponents/PatchBoardContent/PagePatchNode.svelte";
    import PagePatchSocket from "../../../StyledComponents/PatchBoardContent/PagePatchSocket.svelte";
    import type { PatchBoardViewExampleProps } from "../PatchBoardPage.types";

    type Props = PatchBoardViewExampleProps;

    let { nodes = $bindable(), links = $bindable(), view = $bindable(), ...props }: Props = $props();

    let controller = $state.raw<PanZoomController>();
</script>

<div class={styles.viewStage}>
    <PageMeasureBox>
        <div class={styles.viewWindow}>
            <PatchBoard
                bind:nodes
                bind:links
                bind:view
                groupId={"pan"}
                ariaLabel={"Recording chain"}
                announcements={PATCH_BOARD_ANNOUNCEMENTS}
                heightRatio={PAN_BOARD_HEIGHT_RATIO}
                socketSize={props.socketSize * PAN_SCALE}
                socketReach={PATCH_BOARD_DEFAULTS.socketReach * PAN_SCALE}
                stepSize={PATCH_BOARD_DEFAULTS.stepSize * PAN_SCALE}
                isLocked={props.isLocked}
                isDisabled={props.isDisabled}
                boardWidth={PAN_BOARD_WIDTH}
                computeNodeKey={(device) => device.id}
                computeNodeLabel={(device) => device.name}
                onLink={props.onLink}
                onUnlink={props.onUnlink}
                onMove={props.onMove}
                onMount={(next) => {
                    controller = next;
                }}
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
    </PageMeasureBox>

    <PagePanZoomControls idPrefix={"patchBoard"} {controller} />
</div>
