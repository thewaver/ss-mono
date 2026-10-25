<script setup lang="ts">
import { type ComponentPublicInstance, computed, shallowRef, useId, watch } from "vue";

import { Button, ColorArea, type DismisserReason, Popover, Range, toElement } from "@thewaver/ss-components-vue";
import { COLOR_AREA_AXIS_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { STARTING_PICKER_HSV } from "@thewaver/ss-playground/App/Pages/ColorAreaPage/ColorAreaPage.const";
import { Color } from "@thewaver/ss-utils";

import PageColorChannels from "../../../PageComponents/ColorChannels/ColorChannels.vue";
import PageColorAreaContent from "../../../StyledComponents/ColorAreaContent/PageColorAreaContent.vue";
import PageColorFieldTrigger from "../../../StyledComponents/ColorAreaContent/PageColorFieldTrigger.vue";
import PageColorPickerPopup from "../../../StyledComponents/ColorAreaContent/PageColorPickerPopup.vue";
import PageColorPickerRow from "../../../StyledComponents/ColorAreaContent/PageColorPickerRow.vue";
import PageColorPreview from "../../../StyledComponents/ColorAreaContent/PageColorPreview.vue";
import PageColorSwatch from "../../../StyledComponents/ColorAreaContent/PageColorSwatch.vue";
import PageHueSlider from "../../../StyledComponents/ColorAreaContent/PageHueSlider.vue";

const AREA_SIZE = 160;
const HUE_THUMB_SIZE = 18;
const HUE_MAX = 360;

const popupId = useId();

const hsv = shallowRef<Color.HSVA>(STARTING_PICKER_HSV);
const hue = shallowRef(STARTING_PICKER_HSV.h);

const triggerRef = shallowRef<HTMLElement>();
const isOpen = shallowRef(false);

const css = computed(() => Color.RGBA.toCss(Color.HSVA.toRgba(hsv.value)));

const setTriggerRef = (target: Element | ComponentPublicInstance | null) => {
    triggerRef.value = toElement(target);
};

const toggle = () => {
    isOpen.value = !isOpen.value;
};

const dismiss = (reason: DismisserReason) => {
    isOpen.value = false;

    if (reason === "escape") triggerRef.value?.focus();
};

watch(
    () => hsv.value.h,
    (h) => {
        if (hue.value === h) return;

        hue.value = h;
    },
);

watch(hue, (next) => {
    if (hsv.value.h === next) return;

    hsv.value = { ...hsv.value, h: next };
});
</script>

<template>
    <Button :ref="setTriggerRef" ariaHasPopup="dialog" :ariaExpanded="isOpen" @click="toggle">
        <template #renderContent="flags">
            <PageColorFieldTrigger :flags="flags"
                ><PageColorSwatch :value="css" />{{ Color.HSVA.toHexa(hsv) }}</PageColorFieldTrigger
            >
        </template>
    </Button>

    <Popover
        :id="popupId"
        role="dialog"
        :aria-attributes="{ 'aria-label': 'Choose a color' }"
        :is-open="isOpen"
        :anchor-ref="triggerRef"
        has-auto-focus
        :offset="{ x: 0, y: 5 }"
        @dismiss="dismiss"
    >
        <template #renderContent>
            <PageColorPickerPopup>
                <PageColorPreview :value="css" />

                <ColorArea
                    v-model:hsv="hsv"
                    sizing="fill"
                    ariaLabel="Saturation and brightness"
                    :axis-labels="COLOR_AREA_AXIS_LABELS"
                >
                    <template #renderContent="renderProps">
                        <PageColorAreaContent :render-props="renderProps" :size="AREA_SIZE" />
                    </template>
                </ColorArea>

                <PageColorPickerRow>
                    <Range
                        id="hueSlider"
                        v-model:value="hue"
                        sizing="fill"
                        :max="HUE_MAX"
                        :step="1"
                        ariaLabel="Hue"
                        :thumb-size="HUE_THUMB_SIZE"
                    >
                        <template #renderContent="renderProps">
                            <PageHueSlider :render-props="renderProps" />
                        </template>
                    </Range>
                </PageColorPickerRow>

                <PageColorChannels v-model:hsv="hsv" />
            </PageColorPickerPopup>
        </template>
    </Popover>
</template>
