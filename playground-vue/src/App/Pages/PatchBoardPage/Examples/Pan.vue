<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { PATCH_BOARD_DEFAULTS, PatchBoard } from "@thewaver/ss-components-vue";
import type { PanZoomController } from "@thewaver/ss-components-vue";
import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    PAN_BOARD_HEIGHT_RATIO,
    PAN_BOARD_WIDTH,
    PAN_SCALE,
} from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.css";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PagePanZoomControls from "../../../PageComponents/PanZoomControls/PagePanZoomControls.vue";
import PagePatchCable from "../../../StyledComponents/PatchBoardContent/PagePatchCable.vue";
import PagePatchNode from "../../../StyledComponents/PatchBoardContent/PagePatchNode.vue";
import PagePatchSocket from "../../../StyledComponents/PatchBoardContent/PagePatchSocket.vue";
import type { PatchBoardViewExampleProps } from "../PatchBoardPage.types";

type Props = PatchBoardViewExampleProps;

const props = defineProps<Props>();

const nodes = useModel(props, "nodes");
const links = useModel(props, "links");
const view = useModel(props, "view");

const controller = shallowRef<PanZoomController>();
</script>

<template>
    <div :class="styles.viewStage">
        <PageMeasureBox>
            <div :class="styles.viewWindow">
                <PatchBoard
                    v-model:nodes="nodes"
                    v-model:links="links"
                    v-model:view="view"
                    group-id="pan"
                    ariaLabel="Recording chain"
                    :announcements="PATCH_BOARD_ANNOUNCEMENTS"
                    :height-ratio="PAN_BOARD_HEIGHT_RATIO"
                    :socket-size="socketSize * PAN_SCALE"
                    :socket-reach="PATCH_BOARD_DEFAULTS.socketReach * PAN_SCALE"
                    :step-size="PATCH_BOARD_DEFAULTS.stepSize * PAN_SCALE"
                    :is-locked="isLocked"
                    :is-disabled="isDisabled"
                    :board-width="PAN_BOARD_WIDTH"
                    :compute-node-key="(device) => device.id"
                    :compute-node-label="(device) => device.name"
                    @link="props.onLink"
                    @unlink="props.onUnlink"
                    @move="props.onMove"
                    @mount="(next: PanZoomController) => (controller = next)"
                >
                    <template #renderNode="{ node, flags }">
                        <PagePatchNode :label="node.value.name" :kind="node.value.kind" :flags="flags" />
                    </template>

                    <template #renderSocket="{ flags }">
                        <PagePatchSocket :flags="flags" />
                    </template>

                    <template #renderCable="defs">
                        <PagePatchCable :defs="defs" :is-beam-playing="isBeamPlaying" />
                    </template>
                </PatchBoard>
            </div>
        </PageMeasureBox>

        <PagePanZoomControls id-prefix="patchBoard" :controller="controller" />
    </div>
</template>
