<script lang="ts">
import { HoverIntentUtils } from "@thewaver/ss-components-vue";

const NAV_DELAY_GROUP = HoverIntentUtils.createDelayGroup();
</script>

<script setup lang="ts">
import { type ComponentPublicInstance, computed, shallowRef, useId, useModel } from "vue";

import type { AnchorPlacement, DismisserReason } from "@thewaver/ss-components-vue";
import { HoverIntentVueUtils, InteractionWrapper, Popover, PopupTrigger, toElement } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/HoverCardPage/HoverCardPage.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import PageLayer from "../../../PageComponents/Layer/Layer.vue";
import PageNavMenuTrigger from "../../../StyledComponents/NavMenuContent/NavMenuContent.vue";
import PagePopoverSurface from "../../../StyledComponents/PopoverSurface/PopoverSurface.vue";
import type { NavFlyoutProps } from "../HoverCardPage.types";

const FLYOUT_PLACEMENT: AnchorPlacement = { x: "left-in", y: "bottom-out" };
const FLYOUT_OFFSET = { x: 0, y: 6 };

const props = defineProps<NavFlyoutProps>();

const popupId = useId();

const triggerRef = shallowRef<HTMLElement>();
const panelRef = shallowRef<HTMLDivElement>();

const isPressOpened = shallowRef(false);

const openKey = useModel(props, "openKey");

const isOpen = computed(() => openKey.value === props.entry.key);

const setIsOpen = (nextIsOpen: boolean) => {
    if (nextIsOpen === isOpen.value) return;

    openKey.value = nextIsOpen ? props.entry.key : undefined;
};

const getHasFocusInside = () => document.getElementById(popupId)?.contains(document.activeElement) ?? false;

const shown = computed({
    get: () => isOpen.value,
    set: (nextIsOpen) => {
        if (nextIsOpen && !isOpen.value) isPressOpened.value = false;

        setIsOpen(nextIsOpen);
    },
});

const hoverIntent = HoverIntentVueUtils.useHoverIntent(triggerRef, shown, {
    delayGroup: NAV_DELAY_GROUP,
    panelRef,
    hoverShowDelayMs: () => props.hoverShowDelayMs,
    skipDelayWindowMs: () => props.skipDelayWindowMs,
    isHeld: getHasFocusInside,
    isTouchIgnored: true,
});

const setTriggerRef = (target: Element | ComponentPublicInstance | null) => {
    triggerRef.value = toElement(target);
};

const toggle = () => {
    const nextIsOpen = !isOpen.value;

    hoverIntent.cancel();
    isPressOpened.value = nextIsOpen;
    setIsOpen(nextIsOpen);
};

const handleDismiss = (reason: DismisserReason) => {
    if (reason === "focus" && hoverIntent.getIsPointerInside()) return;

    hoverIntent.cancel();
    setIsOpen(false);
};

const computeBridgeStyle = (placement: AnchorPlacement) => {
    const bridge = HoverIntentUtils.computeBridgeInsets(placement, FLYOUT_OFFSET);

    return assignInlineVars({
        [styles.bridgeTopVar]: `${-bridge.top}px`,
        [styles.bridgeRightVar]: `${-bridge.right}px`,
        [styles.bridgeBottomVar]: `${-bridge.bottom}px`,
        [styles.bridgeLeftVar]: `${-bridge.left}px`,
    });
};
</script>

<template>
    <InteractionWrapper :ref="setTriggerRef" :extra-flags="{ isOpen }">
        <template #renderControl="{ setElementRef, flags }">
            <PopupTrigger :ref="setElementRef" :popup-id="popupId" :is-open="isOpen" :flags="flags" @toggle="toggle">
                <template #renderContent="triggerFlags">
                    <PageNavMenuTrigger :flags="triggerFlags">{{ entry.label }}</PageNavMenuTrigger>
                </template>
            </PopupTrigger>
        </template>
    </InteractionWrapper>

    <Popover
        :id="popupId"
        role="dialog"
        :aria-attributes="{ 'aria-label': entry.label }"
        :is-open="isOpen"
        :anchor-ref="triggerRef"
        :placement="FLYOUT_PLACEMENT"
        :offset="FLYOUT_OFFSET"
        :has-auto-focus="isPressOpened"
        @dismiss="handleDismiss"
    >
        <template #renderContent="{ visibilityTarget, transitionDurationMs, placement }">
            <div ref="panelRef" :class="styles.flyoutPanel" :style="computeBridgeStyle(placement)">
                <PageLayer :level="2">
                    <PagePopoverSurface
                        :visibility-target="visibilityTarget"
                        :transition-duration-ms="transitionDurationMs"
                        :placement="placement"
                    >
                        <ul :class="styles.flyoutList">
                            <li v-for="link in links" :key="link.key">
                                <a :href="`#${link.key}`" :class="styles.flyoutLink" @click="setIsOpen(false)">{{
                                    link.label
                                }}</a>
                            </li>
                        </ul>
                    </PagePopoverSurface>
                </PageLayer>
            </div>
        </template>
    </Popover>
</template>
