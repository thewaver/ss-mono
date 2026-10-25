import { useMemo, useState } from "react";

import { Button, CommandPalette } from "@thewaver/ss-components-react";
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
} from "../CommandPalettePageReact.const";

export const ActionShortcutsDocsExample = () => {
    const visibilityState = useState(false);
    const queryState = useState("");
    const query = queryState[0];
    const [lastRun, setLastRun] = useState(NOTHING_RUN);
    const [noteCount, setNoteCount] = useState(0);

    const actions = useMemo(() => CommandPalettePageUtils.filterItems(NOTE_ACTIONS, query), [query]);

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
                renderContent={(flags) => <PageButtonContent flags={flags}>Open the palette</PageButtonContent>}
                onClick={() => {
                    visibilityState[1](true);
                }}
            />

            <CommandPalette
                visibility={visibilityState}
                query={queryState}
                actions={actions}
                ariaLabel={"Note actions"}
                fieldAriaLabel={"Search the note actions"}
                listAriaLabel={"Matching note actions"}
                renderOverlay={renderPaletteOverlay}
                renderPanel={computePalettePanelRenderer(actions)}
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

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Notes: ${noteCount} | Last run: ${lastRun}`}
            </div>
        </>
    );
};
