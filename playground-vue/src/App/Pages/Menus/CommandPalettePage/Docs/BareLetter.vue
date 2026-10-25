<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Button, CommandPalette, TextInput } from "@thewaver/ss-components-vue";
import type { CommandPaletteItem } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { CommandPalettePageUtils } from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.utils";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageControlButtonContent from "../../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import PageGlideFloater from "../../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageModalOverlay from "../../../../StyledComponents/ModalOverlay/ModalOverlay.vue";
import PageSelectOptionContent from "../../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import { BARE_LETTER_SHORTCUT, GREET, formatPageResolvedShortcut } from "../CommandPalettePageVue.const";
import CommandPalettePanel from "../CommandPalettePanel.vue";

const visibility = shallowRef(false);
const query = shallowRef("");
const text = shallowRef("");
const isShortcutOn = shallowRef(true);
const greetingCount = shallowRef(0);

const allActions = computed((): CommandPaletteItem<string>[] => [
    isShortcutOn.value ? { value: GREET, shortcut: BARE_LETTER_SHORTCUT } : { value: GREET },
]);

const actions = computed(() => CommandPalettePageUtils.filterItems(allActions.value, query.value));

const open = () => {
    visibility.value = true;
};

const greet = () => {
    greetingCount.value += 1;
};

const toggleShortcut = () => {
    isShortcutOn.value = !isShortcutOn.value;
};
</script>

<template>
    <Button id="bareLetterOpenPalette" @click="open">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">Open the palette</PageButtonContent>
        </template>
    </Button>

    <TextInput
        v-model:value="text"
        :padding="FIELD_PADDING"
        :gap="FIELD_GAP"
        ariaLabel="Somewhere to type"
        :compute-text-style="computePageTextFieldTextStyle"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" />
        </template>

        <template #renderPlaceholder="{ flags }">
            <PageTextFieldPlaceholder :flags="flags">A g typed here stays a g</PageTextFieldPlaceholder>
        </template>
    </TextInput>

    <CommandPalette
        v-model:visibility="visibility"
        v-model:query="query"
        :actions="actions"
        ariaLabel="Greetings"
        fieldAriaLabel="Search the greetings"
        listAriaLabel="Matching greetings"
        :field-padding="FIELD_PADDING"
        :field-gap="FIELD_GAP"
        :compute-field-text-style="computePageTextFieldTextStyle"
        @activate="greet"
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

        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>
    </CommandPalette>

    <Button id="bareLetterToggleShortcut" @click="toggleShortcut">
        <template #renderContent="flags">
            <PageControlButtonContent :flags="flags">{{
                isShortcutOn ? "Turn G off" : "Turn G on"
            }}</PageControlButtonContent>
        </template>
    </Button>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Greetings: ${greetingCount}` }}</div>
</template>
