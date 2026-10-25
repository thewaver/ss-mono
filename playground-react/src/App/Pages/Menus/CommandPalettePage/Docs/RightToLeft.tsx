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
    GROUPED_ACTIONS,
    NOTHING_RUN,
    computePalettePanelRenderer,
    renderPaletteField,
    renderPaletteGroupHeader,
    renderPaletteOption,
    renderPaletteOverlay,
    renderPalettePlaceholder,
} from "../CommandPalettePageReact.const";

export const RightToLeftDocsExample = () => {
    const visibilityState = useState(false);
    const queryState = useState("");
    const query = queryState[0];
    const [lastRun, setLastRun] = useState(NOTHING_RUN);

    const actions = useMemo(() => CommandPalettePageUtils.filterItems(GROUPED_ACTIONS, query), [query]);

    return (
        <>
            <div dir={"rtl"}>
                <Button
                    id={"rightToLeftOpenPalette"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Open the palette</PageButtonContent>}
                    onClick={() => {
                        visibilityState[1](true);
                    }}
                />

                <CommandPalette
                    visibility={visibilityState}
                    query={queryState}
                    actions={actions}
                    ariaLabel={"Actions"}
                    fieldAriaLabel={"Search the actions"}
                    listAriaLabel={"Matching actions"}
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
                    onActivate={setLastRun}
                />
            </div>

            <div className={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun}`}</div>
        </>
    );
};
