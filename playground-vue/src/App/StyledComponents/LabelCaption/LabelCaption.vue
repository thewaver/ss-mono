<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/LabelCaption/LabelCaption.css";

import type { PageLabelCaptionProps } from "./LabelCaption.types";

defineProps<PageLabelCaptionProps>();
</script>

<template>
    <div :class="styles.labelCaption" :id="id">
        <slot />
    </div>
</template>
