<script setup lang="ts">
import {
    SKIN_SAMPLE_HOVERED_FLAGS,
    SKIN_SAMPLE_HOVERED_OPTION,
} from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.css";

import PageGlideFloater from "../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageSelectOptionContent from "../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import type { SkinListboxSampleProps } from "./AppearancePage.types";

defineProps<SkinListboxSampleProps>();
</script>

<template>
    <div :class="styles.skinHoveredOption">
        <div v-if="isGliding" :class="styles.skinHoveredFloater">
            <PageGlideFloater kind="highlight" :visibility-target="1" :transition-duration-ms="0" />
        </div>

        <PageSelectOptionContent
            :has-hover-floater="isGliding"
            :has-selection-floater="isGliding"
            :flags="SKIN_SAMPLE_HOVERED_FLAGS"
            >{{ SKIN_SAMPLE_HOVERED_OPTION }}</PageSelectOptionContent
        >
    </div>
</template>
