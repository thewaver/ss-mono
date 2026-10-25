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
import { GROUPED_ACTIONS, NOTHING_RUN, formatPageResolvedShortcut } from "../CommandPalettePageVue.const";
import CommandPalettePanel from "../CommandPalettePanel.vue";

const visibility = shallowRef(false);
const query = shallowRef("");
const lastRun = shallowRef(NOTHING_RUN);

const actions = computed(() => CommandPalettePageUtils.filterItems(GROUPED_ACTIONS, query.value));

const open = () => {
    visibility.value = true;
};

const setLastRun = (value: string) => {
    lastRun.value = value;
};
</script>

<template>
    <div dir="rtl">
        <Button id="rightToLeftOpenPalette" @click="open">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Open the palette</PageButtonContent>
            </template>
        </Button>

        <CommandPalette
            v-model:visibility="visibility"
            v-model:query="query"
            :actions="actions"
            ariaLabel="Actions"
            fieldAriaLabel="Search the actions"
            listAriaLabel="Matching actions"
            :field-padding="FIELD_PADDING"
            :field-gap="FIELD_GAP"
            :compute-field-text-style="computePageTextFieldTextStyle"
            @activate="setLastRun"
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

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Last run: ${lastRun}` }}</div>
</template>
