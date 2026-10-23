<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { CommandPalette, MediaQueryMonitorVueUtils, SHAPE_REVEAL_DEFAULTS } from "@thewaver/ss-components-vue";
import {
    APP_COMMANDS,
    APP_PALETTE_SHORTCUT,
} from "@thewaver/ss-playground/App/PageComponents/AppCommands/AppCommands.const";
import {
    computeAppCommandItems,
    toGoToPageCommand,
} from "@thewaver/ss-playground/App/PageComponents/AppCommands/AppCommands.utils";
import {
    NO_MOTION_DURATION_MS,
    THEME_OPTIONS,
} from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";
import { CommandPalettePageUtils } from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.utils";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { formatPageResolvedShortcut } from "../../Pages/Menus/CommandPalettePage/CommandPalettePageVue.const";
import CommandPalettePanel from "../../Pages/Menus/CommandPalettePage/CommandPalettePanel.vue";
import PageGlideFloater from "../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageModalOverlay from "../../StyledComponents/ModalOverlay/ModalOverlay.vue";
import PageSelectGroupContent from "../../StyledComponents/SelectGroupContent/SelectGroupContent.vue";
import PageSelectOptionContent from "../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import { appliedTheme, revealTheme } from "../Theme/ThemeVue.const";
import type { AppCommandsProps } from "./AppCommandsVue.types";

const props = defineProps<AppCommandsProps>();

const visibility = shallowRef(false);
const query = shallowRef("");

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const items = computed(() => computeAppCommandItems(props.pageNames));

const actions = computed(() => CommandPalettePageUtils.filterItems(items.value, query.value));

const cycleTheme = () => {
    const index = THEME_OPTIONS.findIndex((option) => option.value === appliedTheme.value);
    const next = THEME_OPTIONS[(index + 1) % THEME_OPTIONS.length].value;

    void revealTheme(next, {
        origin: SHAPE_REVEAL_DEFAULTS.origin,
        durationMs: prefersReducedMotion.value ? NO_MOTION_DURATION_MS : SHAPE_REVEAL_DEFAULTS.durationMs,
    });
};

const runs = computed((): Record<string, () => void> => ({
    [APP_COMMANDS.goToAbout]: props.onGoToAbout,
    [APP_COMMANDS.cycleTheme]: cycleTheme,
    [APP_COMMANDS.expandAll]: props.onExpandAll,
    [APP_COMMANDS.collapseAll]: props.onCollapseAll,
    ...Object.fromEntries(
        props.pageNames.map((pageName) => [toGoToPageCommand(pageName), () => props.onGoToPage(pageName)]),
    ),
}));

const activate = (command: string) => {
    if (Object.hasOwn(runs.value, command)) runs.value[command]();
};
</script>

<template>
    <CommandPalette
        v-model:visibility="visibility"
        v-model:query="query"
        :actions="actions"
        :shortcut="APP_PALETTE_SHORTCUT"
        ariaLabel="Commands"
        fieldAriaLabel="Search the commands"
        listAriaLabel="Matching commands"
        :field-padding="FIELD_PADDING"
        :field-gap="FIELD_GAP"
        :compute-field-text-style="computePageTextFieldTextStyle"
        @activate="activate"
    >
        <template #renderOverlay="{ visibilityTarget, transitionDurationMs }">
            <PageModalOverlay :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs" />
        </template>

        <template #renderPanel="panel">
            <CommandPalettePanel v-bind="panel" :is-empty="actions.length === 0" />
        </template>

        <template #renderFieldContent="flags">
            <PageTextFieldContent :flags="flags" />
        </template>

        <template #renderFieldPlaceholder="{ flags }">
            <PageTextFieldPlaceholder :flags="flags">Search the actions</PageTextFieldPlaceholder>
        </template>

        <template #renderOption="{ action, renderProps }">
            <PageSelectOptionContent
                is-gliding
                :has-mark="false"
                :flags="renderProps"
                :shortcut="formatPageResolvedShortcut(renderProps.shortcut)"
            >
                {{ action.value }}
            </PageSelectOptionContent>
        </template>

        <template #renderGroupHeader="{ group }">
            <PageSelectGroupContent>{{ group.label }}</PageSelectGroupContent>
        </template>

        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>
    </CommandPalette>
</template>
