<script lang="ts">
    import { Button, CommandPalette, TextInput } from "@thewaver/ss-components-svelte";
    import type { CommandPaletteItem } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { CommandPalettePageUtils } from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.utils";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageControlButtonContent from "../../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import {
        BARE_LETTER_SHORTCUT,
        GREET,
        renderPaletteField,
        renderPaletteOption,
        renderPaletteOverlay,
        renderPalettePanel,
        renderPalettePlaceholder,
    } from "../CommandPalettePage.const.svelte";

    let visibility = $state(false);
    let query = $state("");
    let text = $state("");
    let isShortcutOn = $state(true);
    let greetingCount = $state(0);

    const allActions = $derived<CommandPaletteItem<string>[]>([
        isShortcutOn ? { value: GREET, shortcut: BARE_LETTER_SHORTCUT } : { value: GREET },
    ]);

    const actions = $derived(CommandPalettePageUtils.filterItems(allActions, query));
</script>

<Button
    id={"bareLetterOpenPalette"}
    onClick={() => {
        visibility = true;
    }}
>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>Open the palette</PageButtonContent>
    {/snippet}
</Button>

<TextInput
    bind:value={text}
    padding={FIELD_PADDING}
    gap={FIELD_GAP}
    ariaLabel={"Somewhere to type"}
    computeTextStyle={computePageTextFieldTextStyle}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} />
    {/snippet}

    {#snippet renderPlaceholder(flags)}
        <PageTextFieldPlaceholder {flags}>A g typed here stays a g</PageTextFieldPlaceholder>
    {/snippet}
</TextInput>

<CommandPalette
    bind:visibility
    bind:query
    {actions}
    ariaLabel={"Greetings"}
    fieldAriaLabel={"Search the greetings"}
    listAriaLabel={"Matching greetings"}
    renderOverlay={renderPaletteOverlay}
    fieldPadding={FIELD_PADDING}
    fieldGap={FIELD_GAP}
    computeFieldTextStyle={computePageTextFieldTextStyle}
    renderFieldContent={renderPaletteField}
    renderFieldPlaceholder={renderPalettePlaceholder}
    renderOption={renderPaletteOption}
    renderHighlightFloater={renderPageHighlightFloater}
    onActivate={() => {
        greetingCount += 1;
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

<Button
    id={"bareLetterToggleShortcut"}
    onClick={() => {
        isShortcutOn = !isShortcutOn;
    }}
>
    {#snippet renderContent(flags)}
        <PageControlButtonContent {flags}>{isShortcutOn ? "Turn G off" : "Turn G on"}</PageControlButtonContent>
    {/snippet}
</Button>

<div class={exampleStyles.exampleReadout} data-readout>{`Greetings: ${greetingCount}`}</div>
