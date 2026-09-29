<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/StaircaseContent/StaircaseContent.css";

import type { PageStaircaseStepProps } from "./StaircaseContent.types";

defineProps<PageStaircaseStepProps>();
</script>

<template>
    <div :class="styles.staircaseStep">
        <div><slot /></div>

        <div :class="styles.staircaseStepIndent">{{ `${Math.round(state.stepIndent)}px` }}</div>
    </div>
</template>
