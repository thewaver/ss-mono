<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ModalPanel/ModalPanel.css";

import type { ModalHintProps } from "./ModalPanel.types";

defineProps<ModalHintProps>();
</script>

<template>
    <div :id="id" :class="styles.modalHint">
        <slot />
    </div>
</template>
