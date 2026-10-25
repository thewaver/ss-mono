<script setup lang="ts">
import { LabelVueUtils } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/LabelCaption/LabelCaption.css";

import type { PageLabelCaptionProps } from "./LabelCaptionVue.types";

const props = defineProps<PageLabelCaptionProps>();

const captionId = LabelVueUtils.useCaptionId(() => props.id);
</script>

<template>
    <div :class="styles.labelCaption" :id="captionId">
        <slot />
    </div>
</template>
