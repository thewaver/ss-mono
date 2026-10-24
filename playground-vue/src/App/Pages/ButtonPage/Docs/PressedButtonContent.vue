<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { ButtonContentProps } from "../../../StyledComponents/ButtonContent/ButtonContentVue.types";

defineProps<ButtonContentProps>();
</script>

<template>
    <div :class="[styles.pressedContent, flags.isPressed && styles.isPressed]">
        <PageButtonContent :flags="flags"><slot /></PageButtonContent>
    </div>
</template>
