<script setup lang="ts">
import { useModel } from "vue";

import { PATCH_BOARD_DEFAULTS, PatchBoard } from "@thewaver/ss-components-vue";
import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    PAN_BOARD_HEIGHT_RATIO,
    PAN_SCALE,
} from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.css";

import PagePatchCable from "../../../StyledComponents/PatchBoardContent/PagePatchCable.vue";
import PagePatchNode from "../../../StyledComponents/PatchBoardContent/PagePatchNode.vue";
import PagePatchSocket from "../../../StyledComponents/PatchBoardContent/PagePatchSocket.vue";
import type { PatchBoardExampleProps } from "../PatchBoardPage.types";

type Props = PatchBoardExampleProps;

const props = defineProps<Props>();

const nodes = useModel(props, "nodes");
const links = useModel(props, "links");
</script>

<template>
    <div :class="styles.panWindow">
        <div :class="styles.panBoard">
            <PatchBoard
                v-model:nodes="nodes"
                v-model:links="links"
                group-id="pan"
                ariaLabel="Recording chain"
                :announcements="PATCH_BOARD_ANNOUNCEMENTS"
                :height-ratio="PAN_BOARD_HEIGHT_RATIO"
                :socket-size="socketSize * PAN_SCALE"
                :socket-reach="PATCH_BOARD_DEFAULTS.socketReach * PAN_SCALE"
                :step-size="PATCH_BOARD_DEFAULTS.stepSize * PAN_SCALE"
                :is-locked="isLocked"
                :is-disabled="isDisabled"
                :compute-node-key="(device) => device.id"
                :compute-node-label="(device) => device.name"
                @link="props.onLink"
                @unlink="props.onUnlink"
                @move="props.onMove"
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
    </div>
</template>
