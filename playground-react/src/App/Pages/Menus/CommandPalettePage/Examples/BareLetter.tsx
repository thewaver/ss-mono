import { useMemo } from "react";

import { Button, CommandPalette, TextInput } from "@thewaver/ss-components-react";
import type { CommandPaletteItem } from "@thewaver/ss-components-react";
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
} from "../CommandPalettePageReact.const";
import type { CommandPaletteBareLetterExampleProps } from "../CommandPalettePageReact.types";

type Props = CommandPaletteBareLetterExampleProps;

export const BareLetterExample = (props: Props) => {
    const [isShortcutOn, setIsShortcutOn] = props.isShortcutOn;
    const query = props.query[0];

    const allActions = useMemo(
        (): CommandPaletteItem<string>[] => [
            isShortcutOn ? { value: GREET, shortcut: BARE_LETTER_SHORTCUT } : { value: GREET },
        ],
        [isShortcutOn],
    );

    const actions = useMemo(() => CommandPalettePageUtils.filterItems(allActions, query), [allActions, query]);

    return (
        <div className={styles.root}>
            <div className={styles.row}>
                <Button
                    id={"bareLetterOpenPalette"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Open the palette</PageButtonContent>}
                    onClick={() => {
                        props.visibility[1](true);
                    }}
                />

                <Button
                    id={"bareLetterToggleShortcut"}
                    renderContent={(flags) => (
                        <PageButtonContent flags={flags}>{isShortcutOn ? "Turn G off" : "Turn G on"}</PageButtonContent>
                    )}
                    onClick={() => {
                        setIsShortcutOn(!isShortcutOn);
                    }}
                />
            </div>

            <TextInput
                value={props.text}
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
                visibility={props.visibility}
                query={props.query}
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
                onActivate={props.onActivate}
            />
        </div>
    );
};
