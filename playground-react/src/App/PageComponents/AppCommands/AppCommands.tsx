import { useMemo, useState } from "react";

import { CommandPalette, MediaQueryMonitorReactUtils, SHAPE_REVEAL_DEFAULTS } from "@thewaver/ss-components-react";
import {
    APP_COMMANDS,
    APP_PALETTE_SHORTCUT,
} from "@thewaver/ss-playground/App/PageComponents/AppCommands/AppCommands.const";
import {
    computeAppCommandItems,
    toGoToPageCommand,
} from "@thewaver/ss-playground/App/PageComponents/AppCommands/AppCommands.utils";
import {
    NO_MOTION_DURATION_MS,
    THEME_OPTIONS,
} from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";
import { CommandPalettePageUtils } from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.utils";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    computePalettePanelRenderer,
    renderPaletteField,
    renderPaletteGroupHeader,
    renderPaletteOption,
    renderPaletteOverlay,
    renderPalettePlaceholder,
} from "../../Pages/Menus/CommandPalettePage/CommandPalettePageReact.const";
import { renderPageHighlightFloater } from "../../StyledComponents/GlideFloater/GlideFloater";
import { computePageTextFieldTextStyle } from "../../StyledComponents/TextFieldContent/TextFieldContent";
import { getAppliedTheme, revealTheme } from "../Theme/ThemeReact.const";
import type { AppCommandsProps } from "./AppCommandsReact.types";

export const PageAppCommands = (props: AppCommandsProps) => {
    const visibilityState = useState(false);
    const queryState = useState("");
    const query = queryState[0];

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const items = useMemo(() => computeAppCommandItems(props.pageNames), [props.pageNames]);

    const actions = useMemo(() => CommandPalettePageUtils.filterItems(items, query), [items, query]);

    const cycleTheme = () => {
        const index = THEME_OPTIONS.findIndex((option) => option.value === getAppliedTheme());
        const next = THEME_OPTIONS[(index + 1) % THEME_OPTIONS.length].value;

        void revealTheme(next, {
            origin: SHAPE_REVEAL_DEFAULTS.origin,
            durationMs: prefersReducedMotion ? NO_MOTION_DURATION_MS : SHAPE_REVEAL_DEFAULTS.durationMs,
        });
    };

    const runs: Record<string, () => void> = {
        [APP_COMMANDS.goToAbout]: props.onGoToAbout,
        [APP_COMMANDS.cycleTheme]: cycleTheme,
        [APP_COMMANDS.expandAll]: props.onExpandAll,
        [APP_COMMANDS.collapseAll]: props.onCollapseAll,
        ...Object.fromEntries(
            props.pageNames.map((pageName) => [toGoToPageCommand(pageName), () => props.onGoToPage(pageName)]),
        ),
    };

    return (
        <CommandPalette
            visibility={visibilityState}
            query={queryState}
            actions={actions}
            shortcut={APP_PALETTE_SHORTCUT}
            ariaLabel={"Commands"}
            fieldAriaLabel={"Search the commands"}
            listAriaLabel={"Matching commands"}
            fieldPadding={FIELD_PADDING}
            fieldGap={FIELD_GAP}
            computeFieldTextStyle={computePageTextFieldTextStyle}
            renderOverlay={renderPaletteOverlay}
            renderPanel={computePalettePanelRenderer(actions)}
            renderFieldContent={renderPaletteField}
            renderFieldPlaceholder={renderPalettePlaceholder}
            renderOption={renderPaletteOption}
            renderGroupHeader={renderPaletteGroupHeader}
            renderHighlightFloater={renderPageHighlightFloater}
            onActivate={(command) => {
                if (Object.hasOwn(runs, command)) runs[command]();
            }}
        />
    );
};
