<script setup lang="ts">
import { useRoute } from "vue-router";

import { Menu } from "@thewaver/ss-components-vue";
import type { MenuItem } from "@thewaver/ss-components-vue";
import {
    PLAYGROUND_FRAMEWORKS,
    PLAYGROUND_FRAMEWORK_LABELS,
    toFrameworkHref,
} from "@thewaver/ss-playground/App/PageComponents/FrameworkSwitch/FrameworkSwitch.const";
import type { PlaygroundFramework } from "@thewaver/ss-playground/App/PageComponents/FrameworkSwitch/PlaygroundFramework.types";

import PageFrameworkMenuTrigger from "../../StyledComponents/FrameworkMenuContent/FrameworkMenuContent.vue";
import PageFrameworkMenuItem from "../../StyledComponents/FrameworkMenuContent/FrameworkMenuItem.vue";
import PagePopoverSurface from "../../StyledComponents/PopoverSurface/PopoverSurface.vue";
import PageLayer from "../Layer/Layer.vue";
import { OWN_FRAMEWORK } from "./FrameworkMenu.const";

const FRAMEWORK_ITEMS: MenuItem<PlaygroundFramework>[] = PLAYGROUND_FRAMEWORKS.map((framework) => ({
    value: framework,
    kind: "radio",
}));

const CHECKED_FRAMEWORKS = [OWN_FRAMEWORK];

const computeLabel = (framework: PlaygroundFramework) => PLAYGROUND_FRAMEWORK_LABELS[framework];

const route = useRoute();

const switchFramework = (framework: PlaygroundFramework) => {
    if (framework === OWN_FRAMEWORK) return;

    window.location.assign(toFrameworkHref(framework, route.path));
};
</script>

<template>
    <Menu :items="FRAMEWORK_ITEMS" ariaLabel="Framework" :checked="CHECKED_FRAMEWORKS" @activate="switchFramework">
        <template #renderContent="flags">
            <PageFrameworkMenuTrigger :flags="flags">
                {{ computeLabel(OWN_FRAMEWORK) }}
            </PageFrameworkMenuTrigger>
        </template>

        <template #renderItem="{ item, flags }">
            <PageFrameworkMenuItem :flags="flags">
                {{ computeLabel(item.value) }}
            </PageFrameworkMenuItem>
        </template>

        <template #renderPopup="{ renderItems, visibilityTarget, transitionDurationMs, placement }">
            <PageLayer :level="2">
                <PagePopoverSurface
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                    :placement="placement"
                >
                    <component :is="renderItems" />
                </PagePopoverSurface>
            </PageLayer>
        </template>
    </Menu>
</template>
