import { createMemo, createSignal } from "solid-js";

import { APP_PALETTE_SHORTCUT } from "@thewaver/ss-playground/App/PageComponents/AppCommands/AppCommands.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
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
} from "./CommandPalettePageSolid.const";
import { ActionShortcutsExample } from "./Examples/ActionShortcuts";
import { BareLetterExample } from "./Examples/BareLetter";
import { DefaultExample } from "./Examples/Default";

const NOTE_SHORTCUTS = NOTE_ACTIONS.flatMap((item) => ("options" in item ? item.options : [item]))
    .map((action) => formatPageShortcut(action.shortcut))
    .filter((shortcut) => shortcut !== undefined)
    .join(", ");

export const CommandPalettePage = () => {
    const defaultVisibility = createSignal(false);
    const defaultQuery = createSignal("");
    const [getDefaultRun, setDefaultRun] = createSignal(NOTHING_RUN);

    const notesVisibility = createSignal(false);
    const notesQuery = createSignal("");
    const [getNotesRun, setNotesRun] = createSignal(NOTHING_RUN);
    const [getNoteCount, setNoteCount] = createSignal(0);

    const bareLetterVisibility = createSignal(false);
    const bareLetterQuery = createSignal("");
    const bareLetterShortcutOn = createSignal(true);
    const bareLetterText = createSignal("");
    const [getGreetingCount, setGreetingCount] = createSignal(0);

    const runNoteAction = (value: string) => {
        setNotesRun(value);

        if (value === ADD_NOTE) setNoteCount((count) => count + 1);
        if (value === REMOVE_NOTE) setNoteCount((count) => Math.max(count - 1, 0));
        if (value === CLEAR_NOTES) setNoteCount(0);
    };

    const getExamples = createMemo(() => [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () =>
                `open: ${defaultVisibility[0]()} | last run: ${getDefaultRun()} — opened by its button; ${formatPageShortcut(APP_PALETTE_SHORTCUT)} opens the Playground's own palette from any page`,
            component: () => (
                <DefaultExample visibility={defaultVisibility} query={defaultQuery} onActivate={setDefaultRun} />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "actionShortcuts",
            name: EXAMPLE_NAMES.actionShortcuts,
            readout: () =>
                `open: ${notesVisibility[0]()} | notes: ${getNoteCount()} | last run: ${getNotesRun()} — ${NOTE_SHORTCUTS} run their actions with the palette closed`,
            component: () => (
                <ActionShortcutsExample visibility={notesVisibility} query={notesQuery} onActivate={runNoteAction} />
            ),
            path: `${EXAMPLES_ROOT}/ActionShortcuts.tsx`,
        },
        {
            key: "bareLetter",
            name: EXAMPLE_NAMES.bareLetter,
            readout: () =>
                `greetings: ${getGreetingCount()} | ${formatPageShortcut(BARE_LETTER_SHORTCUT)}: ${bareLetterShortcutOn[0]() ? "on" : "off"} — it runs anywhere but in a text field, and registering it warns in the console, since WCAG 2.1.4 asks that it can be turned off`,
            component: () => (
                <BareLetterExample
                    visibility={bareLetterVisibility}
                    query={bareLetterQuery}
                    isShortcutOn={bareLetterShortcutOn}
                    text={bareLetterText}
                    onActivate={() => setGreetingCount((count) => count + 1)}
                />
            ),
            path: `${EXAMPLES_ROOT}/BareLetter.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
