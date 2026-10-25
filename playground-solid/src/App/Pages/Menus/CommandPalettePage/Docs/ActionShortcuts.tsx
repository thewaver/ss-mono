import { createMemo, createSignal } from "solid-js";

import { Button, CommandPalette } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { CommandPalettePageUtils } from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.utils";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { computePageTextFieldTextStyle } from "../../../../StyledComponents/TextFieldContent/TextFieldContent";
import {
    ADD_NOTE,
    CLEAR_NOTES,
    NOTE_ACTIONS,
    NOTHING_RUN,
    REMOVE_NOTE,
    computePalettePanelRenderer,
    renderPaletteField,
    renderPaletteGroupHeader,
    renderPaletteOption,
    renderPaletteOverlay,
    renderPalettePlaceholder,
} from "../CommandPalettePageSolid.const";

export const ActionShortcutsDocsExample = () => {
    const visibilitySignal = createSignal(false);
    const querySignal = createSignal("");
    const [getLastRun, setLastRun] = createSignal(NOTHING_RUN);
    const [getNoteCount, setNoteCount] = createSignal(0);

    const getActions = createMemo(() => CommandPalettePageUtils.filterItems(NOTE_ACTIONS, querySignal[0]()));

    const runNoteAction = (value: string) => {
        setLastRun(value);

        if (value === ADD_NOTE) setNoteCount((count) => count + 1);
        if (value === REMOVE_NOTE) setNoteCount((count) => Math.max(count - 1, 0));
        if (value === CLEAR_NOTES) setNoteCount(0);
    };

    return (
        <>
            <Button
                id={"actionShortcutsOpenPalette"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Open the palette</PageButtonContent>}
                onClick={() => {
                    visibilitySignal[1](true);
                }}
            />

            <CommandPalette
                visibility={visibilitySignal}
                query={querySignal}
                actions={getActions}
                ariaLabel={"Note actions"}
                fieldAriaLabel={"Search the note actions"}
                listAriaLabel={"Matching note actions"}
                renderOverlay={renderPaletteOverlay}
                renderPanel={computePalettePanelRenderer(getActions)}
                fieldPadding={FIELD_PADDING}
                fieldGap={FIELD_GAP}
                computeFieldTextStyle={computePageTextFieldTextStyle}
                renderFieldContent={renderPaletteField}
                renderFieldPlaceholder={renderPalettePlaceholder}
                renderOption={renderPaletteOption}
                renderGroupHeader={renderPaletteGroupHeader}
                renderHighlightFloater={renderPageHighlightFloater}
                onActivate={runNoteAction}
            />

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Notes: ${getNoteCount()} | Last run: ${getLastRun()}`}
            </div>
        </>
    );
};
