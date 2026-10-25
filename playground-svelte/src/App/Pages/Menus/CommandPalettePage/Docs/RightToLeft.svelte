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
        GROUPED_ACTIONS,
        NOTHING_RUN,
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

    const actions = $derived(CommandPalettePageUtils.filterItems(GROUPED_ACTIONS, query));
</script>

<div dir={"rtl"}>
    <Button
        id={"rightToLeftOpenPalette"}
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
        ariaLabel={"Actions"}
        fieldAriaLabel={"Search the actions"}
        listAriaLabel={"Matching actions"}
        renderOverlay={renderPaletteOverlay}
        fieldPadding={FIELD_PADDING}
        fieldGap={FIELD_GAP}
        computeFieldTextStyle={computePageTextFieldTextStyle}
        renderFieldContent={renderPaletteField}
        renderFieldPlaceholder={renderPalettePlaceholder}
        renderOption={renderPaletteOption}
        renderGroupHeader={renderPaletteGroupHeader}
        renderHighlightFloater={renderPageHighlightFloater}
        onActivate={(value) => {
                lastRun = value;
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
</div>

<div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun}`}</div>
