<script lang="ts">
    import { Button, CommandPalette, TextInput } from "@thewaver/ss-components-svelte";
    import type { CommandPaletteItem } from "@thewaver/ss-components-svelte";
    import { CommandPalettePageUtils } from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.utils";
    import * as styles from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.css";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.svelte";
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
    import type { CommandPaletteBareLetterExampleProps } from "../CommandPalettePageSvelte.types";

    type Props = CommandPaletteBareLetterExampleProps;

    let {
        visibility = $bindable(),
        query = $bindable(),
        isShortcutOn = $bindable(),
        text = $bindable(),
        ...props
    }: Props = $props();

    const allActions = $derived<CommandPaletteItem<string>[]>([
        isShortcutOn ? { value: GREET, shortcut: BARE_LETTER_SHORTCUT } : { value: GREET },
    ]);

    const actions = $derived(CommandPalettePageUtils.filterItems(allActions, query));
</script>

<div class={styles.root}>
    <div class={styles.row}>
        <Button
            id="bareLetterOpenPalette"
            onClick={() => {
                visibility = true;
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Open the palette</PageButtonContent>
            {/snippet}
        </Button>

        <Button
            id="bareLetterToggleShortcut"
            onClick={() => {
                isShortcutOn = !isShortcutOn;
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>{isShortcutOn ? "Turn G off" : "Turn G on"}</PageButtonContent>
            {/snippet}
        </Button>
    </div>

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
        onActivate={props.onActivate}
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
