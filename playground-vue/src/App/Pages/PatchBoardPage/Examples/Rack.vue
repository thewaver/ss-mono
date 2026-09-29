<script setup lang="ts">
import { useModel } from "vue";

import { PatchBoard, PatchBoardSnaps, PatchBoardUtils } from "@thewaver/ss-components-vue";
import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { BOARD_HEIGHT_RATIO, BOARD_WIDTH } from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.css";

import PagePatchCable from "../../../StyledComponents/PatchBoardContent/PagePatchCable.vue";
import PagePatchNode from "../../../StyledComponents/PatchBoardContent/PagePatchNode.vue";
import PagePatchSocket from "../../../StyledComponents/PatchBoardContent/PagePatchSocket.vue";
import type { PatchBoardExampleProps } from "../PatchBoardPage.types";

const GRID_CELL = BOARD_WIDTH * PatchBoardSnaps.GRID_CELL_SIZE;

type Props = PatchBoardExampleProps;

const props = defineProps<Props>();

const nodes = useModel(props, "nodes");
const links = useModel(props, "links");
</script>

<template>
    <div
        :class="styles.rackGrid"
        :style="{
            backgroundSize: `${GRID_CELL}px ${GRID_CELL}px`,
            backgroundPosition: `-${GRID_CELL * 0.5}px -${GRID_CELL * 0.5}px`,
        }"
    >
        <PatchBoard
            v-model:nodes="nodes"
            v-model:links="links"
            group-id="rack"
            ariaLabel="Effects rack"
            :announcements="PATCH_BOARD_ANNOUNCEMENTS"
            :height-ratio="BOARD_HEIGHT_RATIO"
            :socket-size="socketSize"
            :is-locked="isLocked"
            :is-disabled="isDisabled"
            :compute-node-key="(device) => device.id"
            :compute-node-label="(device) => device.name"
            :compute-snap-spot="PatchBoardSnaps.grid"
            :compute-can-link="(link) => !PatchBoardUtils.getClosesLoop(links, link)"
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
                <PagePatchCable :defs="defs" />
            </template>
        </PatchBoard>
    </div>
</template>
