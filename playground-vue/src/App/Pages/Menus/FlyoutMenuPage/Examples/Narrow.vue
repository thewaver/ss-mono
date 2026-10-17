<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/FlyoutMenuPage/FlyoutMenuPage.css";

import type { FlyoutMenuExampleProps } from "../FlyoutMenuPageVue.types";
import ShopExample from "./Shop.vue";

defineProps<FlyoutMenuExampleProps>();
</script>

<template>
    <div :class="styles.narrowFrame">
        <ShopExample
            :entries="entries"
            :hover-show-delay-ms="hoverShowDelayMs"
            :transition-duration-ms="transitionDurationMs"
        />
    </div>
</template>
