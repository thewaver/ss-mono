import { createMemo } from "solid-js";

import { Button, CommandPalette, TextInput } from "@thewaver/ss-components-solid";
import type { CommandPaletteItem } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.css";
import { CommandPalettePageUtils } from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.utils";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
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
import type { CommandPaletteBareLetterExampleProps } from "../CommandPalettePageSolid.types";

type Props = CommandPaletteBareLetterExampleProps;

export const BareLetterExample = (props: Props) => {
    const getAllActions = createMemo((): CommandPaletteItem<string>[] => [
        props.isShortcutOn[0]() ? { value: GREET, shortcut: BARE_LETTER_SHORTCUT } : { value: GREET },
    ]);

    const getActions = createMemo(() => CommandPalettePageUtils.filterItems(getAllActions(), props.query[0]()));

    return (
        <div class={styles.root}>
            <div class={styles.row}>
                <Button
                    id={"bareLetterOpenPalette"}
                    renderContent={(getFlags) => (
                        <PageButtonContent flags={getFlags}>Open the palette</PageButtonContent>
                    )}
                    onClick={() => {
                        props.visibility[1](true);
                    }}
                />

                <Button
                    id={"bareLetterToggleShortcut"}
                    renderContent={(getFlags) => (
                        <PageButtonContent flags={getFlags}>
                            {props.isShortcutOn[0]() ? "Turn G off" : "Turn G on"}
                        </PageButtonContent>
                    )}
                    onClick={() => {
                        props.isShortcutOn[1]((isOn) => !isOn);
                    }}
                />
            </div>

            <TextInput
                value={props.text}
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
                visibility={props.visibility}
                query={props.query}
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
                onActivate={props.onActivate}
            />
        </div>
    );
};
