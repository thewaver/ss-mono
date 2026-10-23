<script setup lang="ts">
import { computed, useModel } from "vue";

import { Button, CommandPalette } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.css";
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
import { NOTE_ACTIONS, formatPageResolvedShortcut } from "../CommandPalettePageVue.const";
import type { CommandPaletteExampleProps } from "../CommandPalettePageVue.types";
import CommandPalettePanel from "../CommandPalettePanel.vue";

type Props = CommandPaletteExampleProps;

const props = defineProps<Props>();

const visibility = useModel(props, "visibility");
const query = useModel(props, "query");

const actions = computed(() => CommandPalettePageUtils.filterItems(NOTE_ACTIONS, query.value));

const open = () => {
    visibility.value = true;
};
</script>

<template>
    <div :class="styles.root">
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
            @activate="onActivate"
        >
            <template #renderOverlay="{ visibilityTarget, transitionDurationMs }">
                <PageModalOverlay
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                />
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
    </div>
</template>
