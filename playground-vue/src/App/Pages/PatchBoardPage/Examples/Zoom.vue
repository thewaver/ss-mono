<script setup lang="ts">
import { useModel } from "vue";

import { Button, PatchBoard } from "@thewaver/ss-components-vue";
import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    BOARD_HEIGHT_RATIO,
    MAX_ZOOM,
    MIN_ZOOM,
    ZOOM_STEP,
} from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.css";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PagePatchCable from "../../../StyledComponents/PatchBoardContent/PagePatchCable.vue";
import PagePatchNode from "../../../StyledComponents/PatchBoardContent/PagePatchNode.vue";
import PagePatchSocket from "../../../StyledComponents/PatchBoardContent/PagePatchSocket.vue";
import type { PatchBoardZoomExampleProps } from "../PatchBoardPage.types";

type Props = PatchBoardZoomExampleProps;

const props = defineProps<Props>();

const nodes = useModel(props, "nodes");
const links = useModel(props, "links");
</script>

<template>
    <div :class="styles.zoomStage">
        <div :class="styles.zoomControls">
            <Button
                id="patchBoardZoomOut"
                :is-disabled="zoom <= MIN_ZOOM"
                @click="props.onZoomChange(zoom - ZOOM_STEP)"
            >
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Zoom out</PageButtonContent>
                </template>
            </Button>

            <Button
                id="patchBoardZoomIn"
                :is-disabled="zoom >= MAX_ZOOM"
                @click="props.onZoomChange(zoom + ZOOM_STEP)"
            >
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Zoom in</PageButtonContent>
                </template>
            </Button>
        </div>

        <PageMeasureBox>
            <div :class="styles.zoomWindow">
                <div :class="styles.zoomScaler" :style="{ transform: `scale(${zoom})` }">
                    <PatchBoard
                        v-model:nodes="nodes"
                        v-model:links="links"
                        group-id="zoom"
                        ariaLabel="Zoomed chain"
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
                            <PagePatchCable :defs="defs" />
                        </template>
                    </PatchBoard>
                </div>
            </div>
        </PageMeasureBox>
    </div>
</template>
