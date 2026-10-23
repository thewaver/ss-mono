import { useMemo } from "react";

import { Button, CommandPalette } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.css";
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
    computePalettePanelRenderer,
    renderPaletteField,
    renderPaletteGroupHeader,
    renderPaletteOption,
    renderPaletteOverlay,
    renderPalettePlaceholder,
} from "../CommandPalettePageReact.const";
import type { CommandPaletteExampleProps } from "../CommandPalettePageReact.types";

type Props = CommandPaletteExampleProps;

export const DefaultExample = (props: Props) => {
    const query = props.query[0];

    const actions = useMemo(() => CommandPalettePageUtils.filterItems(GROUPED_ACTIONS, query), [query]);

    return (
        <div className={styles.root}>
            <Button
                id={"defaultOpenPalette"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Open the palette</PageButtonContent>}
                onClick={() => {
                    props.visibility[1](true);
                }}
            />

            <CommandPalette
                visibility={props.visibility}
                query={props.query}
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
                onActivate={props.onActivate}
            />
        </div>
    );
};
