import { useMemo, useState } from "react";

import { Button, CommandPalette, TextInput } from "@thewaver/ss-components-react";
import type { CommandPaletteItem } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { CommandPalettePageUtils } from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.utils";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import { PageControlButtonContent } from "../../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import {
    BARE_LETTER_SHORTCUT,
    GREET,
    computePalettePanelRenderer,
    renderPaletteField,
    renderPaletteOption,
    renderPaletteOverlay,
    renderPalettePlaceholder,
} from "../CommandPalettePageReact.const";

export const BareLetterDocsExample = () => {
    const visibilityState = useState(false);
    const queryState = useState("");
    const query = queryState[0];
    const textState = useState("");
    const [isShortcutOn, setIsShortcutOn] = useState(true);
    const [greetingCount, setGreetingCount] = useState(0);

    const allActions = useMemo(
        (): CommandPaletteItem<string>[] => [
            isShortcutOn ? { value: GREET, shortcut: BARE_LETTER_SHORTCUT } : { value: GREET },
        ],
        [isShortcutOn],
    );

    const actions = useMemo(() => CommandPalettePageUtils.filterItems(allActions, query), [allActions, query]);

    return (
        <>
            <Button
                id={"bareLetterOpenPalette"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Open the palette</PageButtonContent>}
                onClick={() => {
                    visibilityState[1](true);
                }}
            />

            <TextInput
                value={textState}
                padding={FIELD_PADDING}
                gap={FIELD_GAP}
                ariaLabel={"Somewhere to type"}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(flags) => <PageTextFieldContent flags={flags} />}
                renderPlaceholder={(flags) => (
                    <PageTextFieldPlaceholder flags={flags}>A g typed here stays a g</PageTextFieldPlaceholder>
                )}
            />

            <CommandPalette
                visibility={visibilityState}
                query={queryState}
                actions={actions}
                ariaLabel={"Greetings"}
                fieldAriaLabel={"Search the greetings"}
                listAriaLabel={"Matching greetings"}
                renderOverlay={renderPaletteOverlay}
                renderPanel={computePalettePanelRenderer(actions)}
                fieldPadding={FIELD_PADDING}
                fieldGap={FIELD_GAP}
                computeFieldTextStyle={computePageTextFieldTextStyle}
                renderFieldContent={renderPaletteField}
                renderFieldPlaceholder={renderPalettePlaceholder}
                renderOption={renderPaletteOption}
                renderHighlightFloater={renderPageHighlightFloater}
                onActivate={() => setGreetingCount((count) => count + 1)}
            />

            <Button
                id={"bareLetterToggleShortcut"}
                renderContent={(flags) => (
                    <PageControlButtonContent flags={flags}>
                        {isShortcutOn ? "Turn G off" : "Turn G on"}
                    </PageControlButtonContent>
                )}
                onClick={() => {
                    setIsShortcutOn((isOn) => !isOn);
                }}
            />

            <div className={exampleStyles.exampleReadout} data-readout>{`Greetings: ${greetingCount}`}</div>
        </>
    );
};
