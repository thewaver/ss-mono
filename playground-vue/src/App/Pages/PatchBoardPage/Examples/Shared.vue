<script setup lang="ts">
import { useModel } from "vue";

import { PatchBoard } from "@thewaver/ss-components-vue";
import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { BOARD_HEIGHT_RATIO, BOARD_WIDTH } from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.const";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PagePatchCable from "../../../StyledComponents/PatchBoardContent/PagePatchCable.vue";
import PagePatchNode from "../../../StyledComponents/PatchBoardContent/PagePatchNode.vue";
import PagePatchSocket from "../../../StyledComponents/PatchBoardContent/PagePatchSocket.vue";
import type { PatchBoardSharedExampleProps } from "../PatchBoardPage.types";

type Props = PatchBoardSharedExampleProps;

const GROUP_ID = "studio";

const props = defineProps<Props>();

const firstNodes = useModel(props, "firstNodes");
const secondNodes = useModel(props, "secondNodes");
const firstLinks = useModel(props, "firstLinks");
const secondLinks = useModel(props, "secondLinks");
</script>

<template>
    <PageMeasureBox :width="BOARD_WIDTH">
        <PatchBoard
            v-model:nodes="firstNodes"
            v-model:links="firstLinks"
            :group-id="GROUP_ID"
            ariaLabel="Instruments"
            :announcements="PATCH_BOARD_ANNOUNCEMENTS"
            :height-ratio="BOARD_HEIGHT_RATIO"
            :socket-size="socketSize"
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
    </PageMeasureBox>

    <PageMeasureBox :width="BOARD_WIDTH">
        <PatchBoard
            v-model:nodes="secondNodes"
            v-model:links="secondLinks"
            :group-id="GROUP_ID"
            ariaLabel="Outputs"
            :announcements="PATCH_BOARD_ANNOUNCEMENTS"
            :height-ratio="BOARD_HEIGHT_RATIO"
            :socket-size="socketSize"
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
    </PageMeasureBox>
</template>
