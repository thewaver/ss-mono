<script setup lang="ts">
import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import PageListboxSurface from "../../../StyledComponents/ListboxSurface/ListboxSurface.vue";
import PageModalPanel from "../../../StyledComponents/ModalPanel/PageModalPanel.vue";
import type { CommandPalettePanelProps } from "./CommandPalettePageVue.types";

defineProps<CommandPalettePanelProps>();
</script>

<template>
    <PageModalPanel :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs">
        <component :is="renderField" />

        <PageListboxSurface>
            <div v-if="isEmpty" :class="popupStyles.popoverSurfaceEmpty">No action matches that</div>
            <component :is="renderOptions" v-else />
        </PageListboxSurface>
    </PageModalPanel>
</template>
