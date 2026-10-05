<script setup lang="ts">
import { computePatchCablePath } from "@thewaver/ss-playground/App/StyledComponents/PatchBoardContent/PatchBoardContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/PatchBoardContent/PatchBoardContent.css";

import PageBeam from "../Beam/Beam.vue";
import { useLayerClass } from "../Layer/Layer.context";
import type { PagePatchCableProps } from "./PatchBoardContent.types";

defineProps<PagePatchCableProps>();

const layerClass = useLayerClass();
</script>

<template>
    <path
        :class="[
            styles.patchCable,
            layerClass,
            defs.isPending && styles.isPending,
            !defs.isAllowed && styles.isRefused,
        ]"
        :d="computePatchCablePath(defs)"
    />

    <PageBeam
        v-if="!defs.isPending"
        :d="computePatchCablePath(defs)"
        :direction="defs.fromKind === 'out' ? 'forward' : 'backward'"
        :is-playing="isBeamPlaying"
    />
</template>
