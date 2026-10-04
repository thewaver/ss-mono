<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/Beam/Beam.css";

import type { PageBeamProps } from "./Beam.types";

defineProps<PageBeamProps>();
</script>

<template>
    <path
        :class="[styles.beam, styles.beamDirectionVariants[direction], !isPlaying && styles.beamPaused]"
        :d="d"
        pathLength="1"
        data-beam
    />
</template>
