<script lang="ts">
    import { Button, CommandPalette } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { CommandPalettePageUtils } from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.utils";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import { computePageTextFieldTextStyle } from "../../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import {
        ADD_NOTE,
        CLEAR_NOTES,
        NOTE_ACTIONS,
        NOTHING_RUN,
        REMOVE_NOTE,
        renderPaletteField,
        renderPaletteGroupHeader,
        renderPaletteOption,
        renderPaletteOverlay,
        renderPalettePanel,
        renderPalettePlaceholder,
    } from "../CommandPalettePage.const.svelte";

    let visibility = $state(false);
    let query = $state("");
    let lastRun = $state(NOTHING_RUN);
    let noteCount = $state(0);

    const actions = $derived(CommandPalettePageUtils.filterItems(NOTE_ACTIONS, query));

    const runNoteAction = (value: string) => {
        lastRun = value;

        if (value === ADD_NOTE) noteCount += 1;
        if (value === REMOVE_NOTE) noteCount = Math.max(noteCount - 1, 0);
        if (value === CLEAR_NOTES) noteCount = 0;
    };
</script>

<Button
    id={"actionShortcutsOpenPalette"}
    onClick={() => {
        visibility = true;
    }}
>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>Open the palette</PageButtonContent>
    {/snippet}
</Button>

<CommandPalette
    bind:visibility
    bind:query
    {actions}
    ariaLabel={"Note actions"}
    fieldAriaLabel={"Search the note actions"}
    listAriaLabel={"Matching note actions"}
    renderOverlay={renderPaletteOverlay}
    fieldPadding={FIELD_PADDING}
    fieldGap={FIELD_GAP}
    computeFieldTextStyle={computePageTextFieldTextStyle}
    renderFieldContent={renderPaletteField}
    renderFieldPlaceholder={renderPalettePlaceholder}
    renderOption={renderPaletteOption}
    renderGroupHeader={renderPaletteGroupHeader}
    renderHighlightFloater={renderPageHighlightFloater}
    onActivate={runNoteAction}
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

<div class={exampleStyles.exampleReadout} data-readout>{`Notes: ${noteCount} | Last run: ${lastRun}`}</div>
