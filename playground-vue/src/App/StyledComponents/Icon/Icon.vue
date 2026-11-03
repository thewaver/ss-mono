<script setup lang="ts">
import { computed } from "vue";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/Icon/Icon.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import type { IconProps } from "./IconVue.types";

const props = defineProps<IconProps>();

const style = computed(() => assignInlineVars({ [styles.iconSource]: `url("${props.src}")` }));
</script>

<template>
    <span :class="styles.icon" :style="style" aria-hidden="true" />
</template>
