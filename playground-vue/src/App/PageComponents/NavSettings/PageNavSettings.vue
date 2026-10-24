<script setup lang="ts">
import { useModel } from "vue";

import { MediaQueryMonitorVueUtils, SHAPE_REVEAL_DEFAULTS, Toggle } from "@thewaver/ss-components-vue";
import {
    PAGE_VIEW_OPTIONS,
    THEME_FIELD_ID,
    THEME_OPTIONS,
    VIEWPORT_ANCHOR_OPTIONS,
} from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";
import { NO_MOTION_DURATION_MS } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";
import { EXAMPLES_ONLY_PROP } from "@thewaver/ss-playground/App/PageComponents/Prop/Prop.const";
import {
    DEFAULT_PAGE_VIEW,
    PAGE_VIEW_LABELS,
} from "@thewaver/ss-playground/App/PageComponents/ViewTabs/ViewTabs.const";

import PageToggleContent from "../../StyledComponents/ToggleContent/ToggleContent.vue";
import PageExampleKnobsButton from "../ExampleKnobs/PageExampleKnobsButton.vue";
import PageSelectField from "../Field/PageSelectField.vue";
import { OWN_FRAMEWORK } from "../FrameworkMenu/FrameworkMenu.const";
import PageProp from "../Prop/Prop.vue";
import { appliedTheme, revealTheme } from "../Theme/ThemeVue.const";
import type { PageViewKey } from "../ViewTabs/ViewTabsVue.types";
import type { PageNavSettingsProps, PlaygroundTheme, ViewportAnchor } from "./NavSettingsVue.types";

const computeViewportAnchorLabel = (anchor: ViewportAnchor) =>
    VIEWPORT_ANCHOR_OPTIONS.find((option) => option.value === anchor)?.label ?? String(anchor);

const computePageViewLabel = (view: PageViewKey) => PAGE_VIEW_LABELS[view];

const computeThemeLabel = (theme: PlaygroundTheme) =>
    THEME_OPTIONS.find((option) => option.value === theme)?.label ?? theme;

const props = defineProps<PageNavSettingsProps>();

const showsDescriptionOnly = useModel(props, "showsDescriptionOnly");
const pageView = useModel(props, "pageView");
const viewportAnchor = useModel(props, "viewportAnchor");

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const pickTheme = (nextTheme: PlaygroundTheme) => {
    void revealTheme(nextTheme, {
        origin: document.getElementById(THEME_FIELD_ID) ?? SHAPE_REVEAL_DEFAULTS.origin,
        durationMs: prefersReducedMotion.value ? NO_MOTION_DURATION_MS : SHAPE_REVEAL_DEFAULTS.durationMs,
    });
};

const setPageView = (view: PageViewKey) => {
    pageView.value = view;
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
                :controls="EXAMPLES_ONLY_PROP"
                label="Show pages without examples"
                hint="Lists the pages with no live examples anywhere, only a description and the API, which are hidden otherwise."
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
                :controls="EXAMPLES_ONLY_PROP"
                label="Open pages on"
                hint="Which tab a page opens on when it is picked from the list. A page with no examples always opens on its docs."
                :default-value="computePageViewLabel(DEFAULT_PAGE_VIEW)"
            >
                <PageSelectField
                    :value="pageView"
                    :values="PAGE_VIEW_OPTIONS.map((option) => option.value)"
                    :compute-label="computePageViewLabel"
                    ariaLabel="Open pages on"
                    @change="setPageView"
                />
            </PageProp>

            <PageProp
                item-key="viewportAnchor"
                :controls="EXAMPLES_ONLY_PROP"
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
                :controls="EXAMPLES_ONLY_PROP"
                label="Theme"
                hint="Which color theme the playground is drawn in, independent of the framework it runs in. The new theme is uncovered by a circle growing from this field."
                :default-value="computeThemeLabel(OWN_FRAMEWORK)"
            >
                <PageSelectField
                    :id="THEME_FIELD_ID"
                    :value="appliedTheme"
                    :values="THEME_OPTIONS.map((option) => option.value)"
                    :compute-label="computeThemeLabel"
                    ariaLabel="Theme"
                    @change="pickTheme"
                />
            </PageProp>
        </template>
    </PageExampleKnobsButton>
</template>
