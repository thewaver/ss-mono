<script lang="ts">
    import { CommandPalette, MediaQueryMonitorSvelteUtils, SHAPE_REVEAL_DEFAULTS } from "@thewaver/ss-components-svelte";
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
        renderPaletteField,
        renderPaletteGroupHeader,
        renderPaletteOption,
        renderPaletteOverlay,
        renderPalettePanel,
        renderPalettePlaceholder,
    } from "../../Pages/Menus/CommandPalettePage/CommandPalettePage.const.svelte";
    import { renderPageHighlightFloater } from "../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import { computePageTextFieldTextStyle } from "../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import { getAppliedTheme, revealTheme } from "../Theme/ThemeSvelte.const.svelte";
    import type { AppCommandsProps } from "./AppCommandsSvelte.types";

    let props: AppCommandsProps = $props();

    let visibility = $state(false);
    let query = $state("");

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    const items = $derived(computeAppCommandItems(props.pageNames));

    const actions = $derived(CommandPalettePageUtils.filterItems(items, query));

    const cycleTheme = () => {
        const index = THEME_OPTIONS.findIndex((option) => option.value === getAppliedTheme());
        const next = THEME_OPTIONS[(index + 1) % THEME_OPTIONS.length].value;

        void revealTheme(next, {
            origin: SHAPE_REVEAL_DEFAULTS.origin,
            durationMs: getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : SHAPE_REVEAL_DEFAULTS.durationMs,
        });
    };

    const runs = $derived<Record<string, () => void>>({
        [APP_COMMANDS.goToAbout]: props.onGoToAbout,
        [APP_COMMANDS.cycleTheme]: cycleTheme,
        [APP_COMMANDS.expandAll]: props.onExpandAll,
        [APP_COMMANDS.collapseAll]: props.onCollapseAll,
        ...Object.fromEntries(
            props.pageNames.map((pageName) => [toGoToPageCommand(pageName), () => props.onGoToPage(pageName)]),
        ),
    });
</script>

<CommandPalette
    bind:visibility
    bind:query
    {actions}
    shortcut={APP_PALETTE_SHORTCUT}
    ariaLabel={"Commands"}
    fieldAriaLabel={"Search the commands"}
    listAriaLabel={"Matching commands"}
    fieldPadding={FIELD_PADDING}
    fieldGap={FIELD_GAP}
    computeFieldTextStyle={computePageTextFieldTextStyle}
    renderOverlay={renderPaletteOverlay}
    renderFieldContent={renderPaletteField}
    renderFieldPlaceholder={renderPalettePlaceholder}
    renderOption={renderPaletteOption}
    renderGroupHeader={renderPaletteGroupHeader}
    renderHighlightFloater={renderPageHighlightFloater}
    onActivate={(command) => {
        if (Object.hasOwn(runs, command)) runs[command]();
    }}
>
    {#snippet renderPanel(renderField, renderOptions, visibilityTarget, transitionDurationMs)}
        {@render renderPalettePanel(
            renderField,
            renderOptions,
            visibilityTarget,
            transitionDurationMs,
            actions.length > 0,
        )}
    {/snippet}
</CommandPalette>
