<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Button, CommandPalette } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { CommandPalettePageUtils } from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.utils";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageGlideFloater from "../../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageModalOverlay from "../../../../StyledComponents/ModalOverlay/ModalOverlay.vue";
import PageSelectGroupContent from "../../../../StyledComponents/SelectGroupContent/SelectGroupContent.vue";
import PageSelectOptionContent from "../../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import {
    ADD_NOTE,
    CLEAR_NOTES,
    NOTE_ACTIONS,
    NOTHING_RUN,
    REMOVE_NOTE,
    formatPageResolvedShortcut,
} from "../CommandPalettePageVue.const";
import CommandPalettePanel from "../CommandPalettePanel.vue";

const visibility = shallowRef(false);
const query = shallowRef("");
const lastRun = shallowRef(NOTHING_RUN);
const noteCount = shallowRef(0);

const actions = computed(() => CommandPalettePageUtils.filterItems(NOTE_ACTIONS, query.value));

const open = () => {
    visibility.value = true;
};

const runNoteAction = (value: string) => {
    lastRun.value = value;

    if (value === ADD_NOTE) noteCount.value += 1;
    if (value === REMOVE_NOTE) noteCount.value = Math.max(noteCount.value - 1, 0);
    if (value === CLEAR_NOTES) noteCount.value = 0;
};
</script>

<template>
    <Button id="actionShortcutsOpenPalette" @click="open">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">Open the palette</PageButtonContent>
        </template>
    </Button>

    <CommandPalette
        v-model:visibility="visibility"
        v-model:query="query"
        :actions="actions"
        ariaLabel="Note actions"
        fieldAriaLabel="Search the note actions"
        listAriaLabel="Matching note actions"
        :field-padding="FIELD_PADDING"
        :field-gap="FIELD_GAP"
        :compute-field-text-style="computePageTextFieldTextStyle"
        @activate="runNoteAction"
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

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Notes: ${noteCount} | Last run: ${lastRun}` }}</div>
</template>
