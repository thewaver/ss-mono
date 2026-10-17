<script setup lang="ts">
import { FlyoutMenu } from "@thewaver/ss-components-vue";
import { OVERFLOW_CAPTION } from "@thewaver/ss-playground/App/Pages/Menus/FlyoutMenuPage/FlyoutMenuPage.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FlyoutMenuContent/FlyoutMenuContent.css";

import PageLayer from "../../../../PageComponents/Layer/Layer.vue";
import PageFlyoutMenuLink from "../../../../StyledComponents/FlyoutMenuContent/PageFlyoutMenuLink.vue";
import PageFlyoutMenuOverflowToggle from "../../../../StyledComponents/FlyoutMenuContent/PageFlyoutMenuOverflowToggle.vue";
import PageFlyoutMenuToggle from "../../../../StyledComponents/FlyoutMenuContent/PageFlyoutMenuToggle.vue";
import PageGlideFloater from "../../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PagePopoverSurface from "../../../../StyledComponents/PopoverSurface/PopoverSurface.vue";
import type { FlyoutMenuExampleProps } from "../FlyoutMenuPageVue.types";

const OFFSET = { x: 0, y: 6 };

defineProps<FlyoutMenuExampleProps>();
</script>

<template>
    <FlyoutMenu
        :entries="entries"
        ariaLabel="Shop"
        :offset="OFFSET"
        :hover-show-delay-ms="hoverShowDelayMs"
        :transition-duration-ms="transitionDurationMs"
        :compute-toggle-label="(value: string) => `${value} submenu`"
    >
        <template #renderLink="{ link, flags }">
            <PageFlyoutMenuLink :flags="flags">{{ link.value }}</PageFlyoutMenuLink>
        </template>

        <template #renderToggle="{ flags }">
            <PageFlyoutMenuToggle :flags="flags" />
        </template>

        <template #renderOverflowToggle="flags">
            <PageFlyoutMenuOverflowToggle :flags="flags">{{ OVERFLOW_CAPTION }}</PageFlyoutMenuOverflowToggle>
        </template>

        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>

        <template #renderPanel="{ renderLinks, visibilityTarget, transitionDurationMs, placement, size }">
            <PageLayer :level="2">
                <PagePopoverSurface
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                    :placement="placement"
                >
                    <div
                        :class="styles.flyoutMenuPanelBody"
                        :style="{
                            width: size ? `${size.width}px` : undefined,
                            height: size ? `${size.height}px` : undefined,
                            transition: `width ${transitionDurationMs}ms ease, height ${transitionDurationMs}ms ease`,
                        }"
                    >
                        <component :is="renderLinks" />
                    </div>
                </PagePopoverSurface>
            </PageLayer>
        </template>
    </FlyoutMenu>
</template>
