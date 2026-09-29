<script setup lang="ts">
import { type ComponentPublicInstance, computed, shallowRef, useModel, watch } from "vue";

import { Button, Popover, Range, toElement } from "@thewaver/ss-components-vue";
import { Color } from "@thewaver/ss-utils";

import PageColorChannels from "../../../PageComponents/ColorChannels/ColorChannels.vue";
import PageColorFieldTrigger from "../../../StyledComponents/ColorAreaContent/PageColorFieldTrigger.vue";
import PageColorPickerPopup from "../../../StyledComponents/ColorAreaContent/PageColorPickerPopup.vue";
import PageColorPickerRow from "../../../StyledComponents/ColorAreaContent/PageColorPickerRow.vue";
import PageColorPreview from "../../../StyledComponents/ColorAreaContent/PageColorPreview.vue";
import PageColorSwatch from "../../../StyledComponents/ColorAreaContent/PageColorSwatch.vue";
import PageHueSlider from "../../../StyledComponents/ColorAreaContent/PageHueSlider.vue";
import type { ColorAreaDropdownExampleProps } from "../ColorAreaPage.types";
import SurfaceExample from "./Surface.vue";

const HUE_THUMB_SIZE = 18;
const HUE_MAX = 360;

type Props = ColorAreaDropdownExampleProps;

const props = defineProps<Props>();

const isOpen = useModel(props, "isOpen");
const hsv = useModel(props, "hsv");
const hue = useModel(props, "hue");

const triggerRef = shallowRef<HTMLElement>();

const css = computed(() => Color.RGBA.toCss(Color.HSVA.toRgba(hsv.value)));

const hexa = computed(() => Color.HSVA.toHexa(hsv.value));

const setTriggerRef = (target: Element | ComponentPublicInstance | null) => {
    triggerRef.value = toElement(target);
};

const toggle = () => {
    isOpen.value = !isOpen.value;
};

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;

    isOpen.value = false;
    triggerRef.value?.focus();
};

watch(
    [isOpen, () => props.popupId, triggerRef],
    ([open, popupId, trigger], _previous, onCleanup) => {
        if (!open) return;

        const handlePointerDown = (e: PointerEvent) => {
            const target = e.target as Node | null;

            if (!target) return;
            if (document.getElementById(popupId)?.contains(target)) return;
            if (trigger?.contains(target)) return;

            isOpen.value = false;
        };

        document.addEventListener("pointerdown", handlePointerDown);

        onCleanup(() => {
            document.removeEventListener("pointerdown", handlePointerDown);
        });
    },
    { immediate: true },
);

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
    <Button :ref="setTriggerRef" @click="toggle">
        <template #renderContent="flags">
            <PageColorFieldTrigger :flags="flags">
                <PageColorSwatch :value="css" />{{ hexa }}
            </PageColorFieldTrigger>
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
        @key-down="handleKeyDown"
    >
        <template #renderContent>
            <PageColorPickerPopup>
                <PageColorPreview :value="css" />

                <SurfaceExample v-model:hsv="hsv" />

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
