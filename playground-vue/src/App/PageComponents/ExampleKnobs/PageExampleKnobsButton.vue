<script setup lang="ts">
import { type ComponentPublicInstance, computed, h, shallowRef, useId } from "vue";

import type { AnchorPlacement, DismisserReason, InteractionTooltipDefs } from "@thewaver/ss-components-vue";
import { InteractionWrapper, Popover, PopupTrigger, toElement } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/PageComponents/ExampleKnobs/ExampleKnobs.css";

import PageTooltipContent from "../../StyledComponents/TooltipContent/TooltipContent.vue";
import PageLayer from "../Layer/Layer.vue";
import PagePropsPanel from "../PropsPanel/PagePropsPanel.vue";
import type { PageExampleKnobsButtonProps, PageExampleKnobsButtonSlots } from "./ExampleKnobs.types";

const KNOBS_PLACEMENT: AnchorPlacement = { x: "right-out", y: "top-in" };
const KNOBS_OFFSET = { x: 10, y: 0 };
const KNOBS_MARK = "⚙";
const TOOLTIP_PLACEMENT: AnchorPlacement = { x: "center", y: "top-out" };
const TOOLTIP_OFFSET = { x: 0, y: 10 };

const props = defineProps<PageExampleKnobsButtonProps>();

defineSlots<PageExampleKnobsButtonSlots>();

const popupId = useId();

const triggerRef = shallowRef<HTMLElement>();
const isOpen = shallowRef(false);

const label = computed(() => `${props.exampleName} settings`);

const setTriggerRef = (target: Element | ComponentPublicInstance | null) => {
    triggerRef.value = toElement(target);
};

const handleDismiss = (reason: DismisserReason) => {
    isOpen.value = false;

    if (reason === "escape") triggerRef.value?.querySelector("button")?.focus({ preventScroll: true });
};

const tooltipDefs: InteractionTooltipDefs = {
    placement: TOOLTIP_PLACEMENT,
    offset: TOOLTIP_OFFSET,
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(PageTooltipContent, { visibilityTarget, transitionDurationMs }, () => "Settings"),
};
</script>

<template>
    <InteractionWrapper :ref="setTriggerRef" :extra-flags="{ isOpen }" :tooltip-defs="tooltipDefs">
        <template #renderControl="{ setElementRef, flags }">
            <PopupTrigger
                :id="`${exampleKey}Knobs`"
                :ref="setElementRef"
                :ariaLabel="label"
                :popup-id="popupId"
                :is-open="isOpen"
                :flags="flags"
                @toggle="isOpen = !isOpen"
            >
                <template #renderContent>
                    <span aria-hidden="true">{{ KNOBS_MARK }}</span>
                </template>
            </PopupTrigger>
        </template>
    </InteractionWrapper>

    <Popover
        :id="popupId"
        role="dialog"
        :aria-attributes="{ 'aria-label': label }"
        :is-open="isOpen"
        :anchor-ref="triggerRef"
        :placement="KNOBS_PLACEMENT"
        :offset="KNOBS_OFFSET"
        has-auto-focus
        @dismiss="handleDismiss"
    >
        <template #renderContent="{ visibilityTarget, transitionDurationMs }">
            <div
                :class="[styles.exampleKnobsSurface, visibilityTarget === 1 && styles.isVisible]"
                :style="{ transition: `opacity ${transitionDurationMs}ms` }"
            >
                <PageLayer :level="2">
                    <PagePropsPanel scope="local"><slot name="renderKnobs" /></PagePropsPanel>
                </PageLayer>
            </div>
        </template>
    </Popover>
</template>
