<script setup lang="ts">
import { ref, useModel } from "vue";

import {
    MediaQueryMonitorVueUtils,
    SHAPE_REVEAL_DEFAULTS,
    ShapeRevealUtils,
    Toggle,
} from "@thewaver/ss-components-vue";
import { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";

import PageToggleContent from "../../StyledComponents/ToggleContent/ToggleContent.vue";
import PageExampleKnobsButton from "../ExampleKnobs/PageExampleKnobsButton.vue";
import PageSelectField from "../Field/PageSelectField.vue";
import { OWN_FRAMEWORK } from "../FrameworkMenu/FrameworkMenu.const";
import PageProp from "../Prop/Prop.vue";
import { PAGE_VIEW_OPTIONS, THEME_FIELD_ID, THEME_OPTIONS, VIEWPORT_ANCHOR_OPTIONS } from "./NavSettings.const";
import type { PageNavSettingsProps, PlaygroundTheme, ViewportAnchor } from "./NavSettings.types";
import PageNavSettingsChoice from "./PageNavSettingsChoice.vue";

const NO_MOTION_DURATION_MS = 0;

const computeViewportAnchorLabel = (anchor: ViewportAnchor) =>
    VIEWPORT_ANCHOR_OPTIONS.find((option) => option.value === anchor)?.label ?? String(anchor);

const computeThemeLabel = (theme: PlaygroundTheme) =>
    THEME_OPTIONS.find((option) => option.value === theme)?.label ?? theme;

const findAppliedTheme = () =>
    THEME_OPTIONS.find((option) => document.documentElement.classList.contains(PLAYGROUND_THEMES[option.value]))
        ?.value ?? OWN_FRAMEWORK;

const applyTheme = (theme: PlaygroundTheme) => {
    document.documentElement.classList.remove(...Object.values(PLAYGROUND_THEMES));
    document.documentElement.classList.add(PLAYGROUND_THEMES[theme]);
};

const props = defineProps<PageNavSettingsProps>();

const showsDescriptionOnly = useModel(props, "showsDescriptionOnly");
const pageView = useModel(props, "pageView");
const viewportAnchor = useModel(props, "viewportAnchor");

const theme = ref<PlaygroundTheme>(findAppliedTheme());

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const pickTheme = (nextTheme: PlaygroundTheme) => {
    theme.value = nextTheme;

    void ShapeRevealUtils.reveal(() => applyTheme(nextTheme), {
        origin: document.getElementById(THEME_FIELD_ID) ?? SHAPE_REVEAL_DEFAULTS.origin,
        durationMs: prefersReducedMotion.value ? NO_MOTION_DURATION_MS : SHAPE_REVEAL_DEFAULTS.durationMs,
    });
};

const setViewportAnchor = (anchor: ViewportAnchor) => {
    viewportAnchor.value = anchor;
};
</script>

<template>
    <PageExampleKnobsButton example-key="library" example-name="Library">
        <template #renderKnobs>
            <PageProp
                item-key="showsDescriptionOnly"
                label="Show pages without examples"
                hint="Lists the pages that have docs but no examples yet, which are hidden otherwise."
                :default-value="false"
            >
                <Toggle v-model:checked="showsDescriptionOnly" ariaLabel="Show pages without examples">
                    <template #renderContent="flags">
                        <PageToggleContent :flags="flags" />
                    </template>
                </Toggle>
            </PageProp>

            <PageProp
                item-key="pageView"
                label="Open pages on"
                hint="Which tab a page opens on when it is picked from the list. A page with no examples always opens on its docs."
                default-value="Examples"
            >
                <PageNavSettingsChoice
                    v-model:value="pageView"
                    ariaLabel="Open pages on"
                    :options="PAGE_VIEW_OPTIONS"
                />
            </PageProp>

            <PageProp
                item-key="viewportAnchor"
                label="Viewport anchor"
                hint="The height the whole playground is laid out at before it is scaled to fit the window. None lays it out at the window's own size and Auto at the screen's height, both at the window's shape; 1080p and 1440p lay out a fixed 16:9 page of that height, with empty bars around it."
                default-value="Auto"
            >
                <PageSelectField
                    :value="viewportAnchor"
                    :values="VIEWPORT_ANCHOR_OPTIONS.map((option) => option.value)"
                    :compute-label="computeViewportAnchorLabel"
                    ariaLabel="Viewport anchor"
                    @change="setViewportAnchor"
                />
            </PageProp>

            <PageProp
                item-key="theme"
                label="Theme"
                hint="Which color theme the playground is drawn in, independent of the framework it runs in. The new theme is uncovered by a circle growing from this field."
                :default-value="computeThemeLabel(OWN_FRAMEWORK)"
            >
                <PageSelectField
                    :id="THEME_FIELD_ID"
                    :value="theme"
                    :values="THEME_OPTIONS.map((option) => option.value)"
                    :compute-label="computeThemeLabel"
                    ariaLabel="Theme"
                    @change="pickTheme"
                />
            </PageProp>
        </template>
    </PageExampleKnobsButton>
</template>
