<script setup lang="ts">
import { useModel } from "vue";

import { PatchBoard } from "@thewaver/ss-components-vue";
import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    AMP_NODE_KEY,
    MIXER_NODE_KEY,
    STANDING_BOARD_HEIGHT_RATIO,
} from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.const";

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
    <PatchBoard
        v-model:nodes="nodes"
        v-model:links="links"
        group-id="mixer"
        ariaLabel="Mixing desk"
        :announcements="PATCH_BOARD_ANNOUNCEMENTS"
        :height-ratio="STANDING_BOARD_HEIGHT_RATIO"
        orientation="vertical"
        :socket-size="socketSize"
        :is-locked="isLocked"
        :is-disabled="isDisabled"
        :compute-node-key="(device) => device.id"
        :compute-node-label="(device) => device.name"
        :compute-can-link="(link) => link.to.nodeKey !== AMP_NODE_KEY || link.from.nodeKey === MIXER_NODE_KEY"
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
</template>
