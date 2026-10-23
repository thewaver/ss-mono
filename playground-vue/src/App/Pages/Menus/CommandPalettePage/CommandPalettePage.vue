<script setup lang="ts">
import { shallowRef } from "vue";

import { APP_PALETTE_SHORTCUT } from "@thewaver/ss-playground/App/PageComponents/AppCommands/AppCommands.const";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import {
    ADD_NOTE,
    BARE_LETTER_SHORTCUT,
    CLEAR_NOTES,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    NOTE_ACTIONS,
    NOTHING_RUN,
    REMOVE_NOTE,
    formatPageShortcut,
} from "./CommandPalettePageVue.const";
import ActionShortcutsExample from "./Examples/ActionShortcuts.vue";
import BareLetterExample from "./Examples/BareLetter.vue";
import DefaultExample from "./Examples/Default.vue";

const NOTE_SHORTCUTS = NOTE_ACTIONS.flatMap((item) => ("options" in item ? item.options : [item]))
    .map((action) => formatPageShortcut(action.shortcut))
    .filter((shortcut) => shortcut !== undefined)
    .join(", ");

const defaultVisibility = shallowRef(false);
const defaultQuery = shallowRef("");
const defaultRun = shallowRef(NOTHING_RUN);

const notesVisibility = shallowRef(false);
const notesQuery = shallowRef("");
const notesRun = shallowRef(NOTHING_RUN);
const noteCount = shallowRef(0);

const bareLetterVisibility = shallowRef(false);
const bareLetterQuery = shallowRef("");
const bareLetterShortcutOn = shallowRef(true);
const bareLetterText = shallowRef("");
const greetingCount = shallowRef(0);

const runNoteAction = (value: string) => {
    notesRun.value = value;

    if (value === ADD_NOTE) noteCount.value += 1;
    if (value === REMOVE_NOTE) noteCount.value = Math.max(noteCount.value - 1, 0);
    if (value === CLEAR_NOTES) noteCount.value = 0;
};

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: EXAMPLE_NAMES.default,
        readout: () =>
            `open: ${defaultVisibility.value} | last run: ${defaultRun.value} — opened by its button; ${formatPageShortcut(APP_PALETTE_SHORTCUT)} opens the Playground's own palette from any page`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "actionShortcuts",
        name: EXAMPLE_NAMES.actionShortcuts,
        readout: () =>
            `open: ${notesVisibility.value} | notes: ${noteCount.value} | last run: ${notesRun.value} — ${NOTE_SHORTCUTS} run their actions with the palette closed`,
        path: `${EXAMPLES_ROOT}/ActionShortcuts.vue`,
    },
    {
        key: "bareLetter",
        name: EXAMPLE_NAMES.bareLetter,
        readout: () =>
            `greetings: ${greetingCount.value} | ${formatPageShortcut(BARE_LETTER_SHORTCUT)}: ${bareLetterShortcutOn.value ? "on" : "off"} — it runs anywhere but in a text field, and registering it warns in the console, since WCAG 2.1.4 asks that it can be turned off`,
        path: `${EXAMPLES_ROOT}/BareLetter.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #default>
            <DefaultExample
                v-model:visibility="defaultVisibility"
                v-model:query="defaultQuery"
                @activate="(value: string) => (defaultRun = value)"
            />
        </template>

        <template #actionShortcuts>
            <ActionShortcutsExample
                v-model:visibility="notesVisibility"
                v-model:query="notesQuery"
                @activate="runNoteAction"
            />
        </template>

        <template #bareLetter>
            <BareLetterExample
                v-model:visibility="bareLetterVisibility"
                v-model:query="bareLetterQuery"
                v-model:is-shortcut-on="bareLetterShortcutOn"
                v-model:text="bareLetterText"
                @activate="() => (greetingCount += 1)"
            />
        </template>
    </PageExamples>
</template>
