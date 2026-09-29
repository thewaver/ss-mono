<script setup lang="ts">
import type { Ref, VNodeChild } from "vue";

import { Color } from "@thewaver/ss-utils";

import PageColorPickerPopup from "../../StyledComponents/ColorAreaContent/PageColorPickerPopup.vue";
import PageColorPreview from "../../StyledComponents/ColorAreaContent/PageColorPreview.vue";
import PageColorChannels from "../ColorChannels/ColorChannels.vue";

defineProps<{ renderSurface: () => VNodeChild; hsv: Ref<Color.HSVA> }>();
</script>

<template>
    <PageColorPickerPopup>
        <PageColorPreview :value="Color.RGBA.toCss(Color.HSVA.toRgba(hsv.value))" />

        <component :is="renderSurface" />

        <PageColorChannels v-model:hsv="hsv.value" />
    </PageColorPickerPopup>
</template>
