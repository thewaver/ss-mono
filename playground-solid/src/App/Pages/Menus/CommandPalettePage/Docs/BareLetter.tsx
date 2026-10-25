import { createMemo, createSignal } from "solid-js";

import { Button, CommandPalette, TextInput } from "@thewaver/ss-components-solid";
import type { CommandPaletteItem } from "@thewaver/ss-components-solid";
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
} from "../CommandPalettePageSolid.const";

export const BareLetterDocsExample = () => {
    const visibilitySignal = createSignal(false);
    const querySignal = createSignal("");
    const textSignal = createSignal("");
    const [getIsShortcutOn, setIsShortcutOn] = createSignal(true);
    const [getGreetingCount, setGreetingCount] = createSignal(0);

    const getAllActions = createMemo((): CommandPaletteItem<string>[] => [
        getIsShortcutOn() ? { value: GREET, shortcut: BARE_LETTER_SHORTCUT } : { value: GREET },
    ]);

    const getActions = createMemo(() => CommandPalettePageUtils.filterItems(getAllActions(), querySignal[0]()));

    return (
        <>
            <Button
                id={"bareLetterOpenPalette"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Open the palette</PageButtonContent>}
                onClick={() => {
                    visibilitySignal[1](true);
                }}
            />

            <TextInput
                value={textSignal}
                padding={FIELD_PADDING}
                gap={FIELD_GAP}
                ariaLabel={"Somewhere to type"}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} />}
                renderPlaceholder={(getFlags) => (
                    <PageTextFieldPlaceholder flags={getFlags}>A g typed here stays a g</PageTextFieldPlaceholder>
                )}
            />

            <CommandPalette
                visibility={visibilitySignal}
                query={querySignal}
                actions={getActions}
                ariaLabel={"Greetings"}
                fieldAriaLabel={"Search the greetings"}
                listAriaLabel={"Matching greetings"}
                renderOverlay={renderPaletteOverlay}
                renderPanel={computePalettePanelRenderer(getActions)}
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
                renderContent={(getFlags) => (
                    <PageControlButtonContent flags={getFlags}>
                        {getIsShortcutOn() ? "Turn G off" : "Turn G on"}
                    </PageControlButtonContent>
                )}
                onClick={() => {
                    setIsShortcutOn((isOn) => !isOn);
                }}
            />

            <div class={exampleStyles.exampleReadout} data-readout>{`Greetings: ${getGreetingCount()}`}</div>
        </>
    );
};
