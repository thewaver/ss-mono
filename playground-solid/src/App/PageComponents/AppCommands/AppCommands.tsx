import { createMemo, createSignal } from "solid-js";

import { CommandPalette, MediaQueryMonitorSolidUtils, SHAPE_REVEAL_DEFAULTS } from "@thewaver/ss-components-solid";
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
} from "../../Pages/Menus/CommandPalettePage/CommandPalettePageSolid.const";
import { renderPageHighlightFloater } from "../../StyledComponents/GlideFloater/GlideFloater";
import { computePageTextFieldTextStyle } from "../../StyledComponents/TextFieldContent/TextFieldContent";
import { getAppliedTheme, revealTheme } from "../Theme/ThemeSolid.const";
import type { AppCommandsProps } from "./AppCommandsSolid.types";

export const PageAppCommands = (props: AppCommandsProps) => {
    const visibilitySignal = createSignal(false);
    const querySignal = createSignal("");

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    const getItems = createMemo(() => computeAppCommandItems(props.pageNames));

    const getActions = createMemo(() => CommandPalettePageUtils.filterItems(getItems(), querySignal[0]()));

    const cycleTheme = () => {
        const index = THEME_OPTIONS.findIndex((option) => option.value === getAppliedTheme());
        const next = THEME_OPTIONS[(index + 1) % THEME_OPTIONS.length].value;

        void revealTheme(next, {
            origin: SHAPE_REVEAL_DEFAULTS.origin,
            durationMs: getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : SHAPE_REVEAL_DEFAULTS.durationMs,
        });
    };

    const getRuns = createMemo((): Record<string, () => void> => ({
        [APP_COMMANDS.goToAbout]: props.onGoToAbout,
        [APP_COMMANDS.cycleTheme]: cycleTheme,
        [APP_COMMANDS.expandAll]: props.onExpandAll,
        [APP_COMMANDS.collapseAll]: props.onCollapseAll,
        ...Object.fromEntries(
            props.pageNames.map((pageName) => [toGoToPageCommand(pageName), () => props.onGoToPage(pageName)]),
        ),
    }));

    return (
        <CommandPalette
            visibility={visibilitySignal}
            query={querySignal}
            actions={getActions}
            shortcut={APP_PALETTE_SHORTCUT}
            ariaLabel={"Commands"}
            fieldAriaLabel={"Search the commands"}
            listAriaLabel={"Matching commands"}
            fieldPadding={FIELD_PADDING}
            fieldGap={FIELD_GAP}
            computeFieldTextStyle={computePageTextFieldTextStyle}
            renderOverlay={renderPaletteOverlay}
            renderPanel={computePalettePanelRenderer(getActions)}
            renderFieldContent={renderPaletteField}
            renderFieldPlaceholder={renderPalettePlaceholder}
            renderOption={renderPaletteOption}
            renderGroupHeader={renderPaletteGroupHeader}
            renderHighlightFloater={renderPageHighlightFloater}
            onActivate={(command) => {
                const runs = getRuns();

                if (Object.hasOwn(runs, command)) runs[command]();
            }}
        />
    );
};
