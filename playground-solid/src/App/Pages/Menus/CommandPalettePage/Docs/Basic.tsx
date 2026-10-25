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
    GROUPED_ACTIONS,
    NOTHING_RUN,
    computePalettePanelRenderer,
    renderPaletteField,
    renderPaletteGroupHeader,
    renderPaletteOption,
    renderPaletteOverlay,
    renderPalettePlaceholder,
} from "../CommandPalettePageSolid.const";

export const BasicDocsExample = () => {
    const visibilitySignal = createSignal(false);
    const querySignal = createSignal("");
    const [getLastRun, setLastRun] = createSignal(NOTHING_RUN);

    const getActions = createMemo(() => CommandPalettePageUtils.filterItems(GROUPED_ACTIONS, querySignal[0]()));

    return (
        <>
            <Button
                id={"basicOpenPalette"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Open the palette</PageButtonContent>}
                onClick={() => {
                    visibilitySignal[1](true);
                }}
            />

            <CommandPalette
                visibility={visibilitySignal}
                query={querySignal}
                actions={getActions}
                ariaLabel={"Actions"}
                fieldAriaLabel={"Search the actions"}
                listAriaLabel={"Matching actions"}
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
                onActivate={setLastRun}
            />

            <div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${getLastRun()}`}</div>
        </>
    );
};
