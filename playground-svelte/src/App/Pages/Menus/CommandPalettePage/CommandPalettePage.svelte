<script lang="ts">
    import { APP_PALETTE_SHORTCUT } from "@thewaver/ss-playground/App/PageComponents/AppCommands/AppCommands.const";

    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import {
        ADD_NOTE,
        BARE_LETTER_SHORTCUT,
        CLEAR_NOTES,
        EXAMPLE_NAMES,
        EXAMPLES_ROOT,
        NOTE_ACTIONS,
        NOTHING_RUN,
        REMOVE_NOTE,
        formatPageShortcut,
    } from "./CommandPalettePage.const.svelte";
    import ActionShortcutsExample from "./Examples/ActionShortcuts.svelte";
    import BareLetterExample from "./Examples/BareLetter.svelte";
    import DefaultExample from "./Examples/Default.svelte";

    const NOTE_SHORTCUTS = NOTE_ACTIONS.flatMap((item) => ("options" in item ? item.options : [item]))
        .map((action) => formatPageShortcut(action.shortcut))
        .filter((shortcut) => shortcut !== undefined)
        .join(", ");

    let defaultVisibility = $state(false);
    let defaultQuery = $state("");
    let defaultRun = $state(NOTHING_RUN);

    let notesVisibility = $state(false);
    let notesQuery = $state("");
    let notesRun = $state(NOTHING_RUN);
    let noteCount = $state(0);

    let bareLetterVisibility = $state(false);
    let bareLetterQuery = $state("");
    let bareLetterShortcutOn = $state(true);
    let bareLetterText = $state("");
    let greetingCount = $state(0);

    const runNoteAction = (value: string) => {
        notesRun = value;

        if (value === ADD_NOTE) noteCount += 1;
        if (value === REMOVE_NOTE) noteCount = Math.max(noteCount - 1, 0);
        if (value === CLEAR_NOTES) noteCount = 0;
    };

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () =>
                `open: ${defaultVisibility} | last run: ${defaultRun} — opened by its button; ${formatPageShortcut(APP_PALETTE_SHORTCUT)} opens the Playground's own palette from any page`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "actionShortcuts",
            name: EXAMPLE_NAMES.actionShortcuts,
            readout: () =>
                `open: ${notesVisibility} | notes: ${noteCount} | last run: ${notesRun} — ${NOTE_SHORTCUTS} run their actions with the palette closed`,
            component: actionShortcutsExample,
            path: `${EXAMPLES_ROOT}/ActionShortcuts.svelte`,
        },
        {
            key: "bareLetter",
            name: EXAMPLE_NAMES.bareLetter,
            readout: () =>
                `greetings: ${greetingCount} | ${formatPageShortcut(BARE_LETTER_SHORTCUT)}: ${bareLetterShortcutOn ? "on" : "off"} — it runs anywhere but in a text field, and registering it warns in the console, since WCAG 2.1.4 asks that it can be turned off`,
            component: bareLetterExample,
            path: `${EXAMPLES_ROOT}/BareLetter.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample
        bind:visibility={defaultVisibility}
        bind:query={defaultQuery}
        onActivate={(value) => {
            defaultRun = value;
        }}
    />
{/snippet}

{#snippet actionShortcutsExample()}
    <ActionShortcutsExample bind:visibility={notesVisibility} bind:query={notesQuery} onActivate={runNoteAction} />
{/snippet}

{#snippet bareLetterExample()}
    <BareLetterExample
        bind:visibility={bareLetterVisibility}
        bind:query={bareLetterQuery}
        bind:isShortcutOn={bareLetterShortcutOn}
        bind:text={bareLetterText}
        onActivate={() => {
            greetingCount += 1;
        }}
    />
{/snippet}

<PageExamples items={examples} />
