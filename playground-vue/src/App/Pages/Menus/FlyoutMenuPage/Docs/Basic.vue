<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import { FlyoutMenu } from "@thewaver/ss-components-vue";
import type { FlyoutMenuEntryRecord } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    NOTHING_FOLLOWED,
    OVERFLOW_CAPTION,
    SHOP_ENTRIES,
} from "@thewaver/ss-playground/App/Pages/Menus/FlyoutMenuPage/FlyoutMenuPage.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FlyoutMenuContent/FlyoutMenuContent.css";

import PageLayer from "../../../../PageComponents/Layer/Layer.vue";
import PageFlyoutMenuLink from "../../../../StyledComponents/FlyoutMenuContent/PageFlyoutMenuLink.vue";
import PageFlyoutMenuOverflowToggle from "../../../../StyledComponents/FlyoutMenuContent/PageFlyoutMenuOverflowToggle.vue";
import PageFlyoutMenuToggle from "../../../../StyledComponents/FlyoutMenuContent/PageFlyoutMenuToggle.vue";
import PageGlideFloater from "../../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PagePopoverSurface from "../../../../StyledComponents/PopoverSurface/PopoverSurface.vue";
import type { FlyoutMenuBasicDocsExampleProps } from "../FlyoutMenuPageVue.types";

const OFFSET = { x: 0, y: 6 };

type Props = FlyoutMenuBasicDocsExampleProps;

defineProps<Props>();

const route = useRoute();

const entries = computed((): FlyoutMenuEntryRecord<string>[] =>
    SHOP_ENTRIES.map((entry) => ({
        ...entry,
        isCurrent: entry.href === route.hash,
        links: entry.links?.map((link) => ({ ...link, isCurrent: link.href === route.hash })),
    })),
);
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

        <template
            #renderPanel="{ renderLinks, visibilityTarget, transitionDurationMs: panelDurationMs, placement, size }"
        >
            <PageLayer :level="2">
                <PagePopoverSurface
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="panelDurationMs"
                    :placement="placement"
                >
                    <div
                        :class="styles.flyoutMenuPanelBody"
                        :style="{
                            width: size ? `${size.width}px` : undefined,
                            height: size ? `${size.height}px` : undefined,
                            transition: `width ${panelDurationMs}ms ease, height ${panelDurationMs}ms ease`,
                        }"
                    >
                        <component :is="renderLinks" />
                    </div>
                </PagePopoverSurface>
            </PageLayer>
        </template>
    </FlyoutMenu>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Followed: ${route.hash || NOTHING_FOLLOWED}` }}</div>
</template>
