<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { Button, PatchBoard } from "@thewaver/ss-components-vue";
import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { BOARD_HEIGHT_RATIO } from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.css";
import { computePatchCablePath } from "@thewaver/ss-playground/App/StyledComponents/PatchBoardContent/PatchBoardContent.const";

import PageBeam from "../../../StyledComponents/Beam/Beam.vue";
import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PagePatchCable from "../../../StyledComponents/PatchBoardContent/PagePatchCable.vue";
import PagePatchNode from "../../../StyledComponents/PatchBoardContent/PagePatchNode.vue";
import PagePatchSocket from "../../../StyledComponents/PatchBoardContent/PagePatchSocket.vue";
import type { PatchBoardExampleProps } from "../PatchBoardPage.types";

type Props = PatchBoardExampleProps;

const props = defineProps<Props>();

const nodes = useModel(props, "nodes");
const links = useModel(props, "links");

const isPlaying = shallowRef(true);

const togglePlaying = () => {
    isPlaying.value = !isPlaying.value;
};
</script>

<template>
    <div :class="styles.beamStage">
        <PatchBoard
            v-model:nodes="nodes"
            v-model:links="links"
            group-id="beams"
            ariaLabel="Signal chain with its signal running"
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

                <PageBeam
                    v-if="!defs.isPending"
                    :d="computePatchCablePath(defs)"
                    :direction="defs.fromKind === 'out' ? 'forward' : 'backward'"
                    :is-playing="isPlaying"
                />
            </template>
        </PatchBoard>

        <Button id="patchBeamsPlayback" @click="togglePlaying">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">{{ isPlaying ? "Pause" : "Play" }}</PageButtonContent>
            </template>
        </Button>
    </div>
</template>
