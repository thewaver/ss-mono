<script lang="ts">
    import { Button, CommandPalette } from "@thewaver/ss-components-svelte";
    import { CommandPalettePageUtils } from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.utils";
    import * as styles from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.css";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import { computePageTextFieldTextStyle } from "../../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import {
        GROUPED_ACTIONS,
        renderPaletteField,
        renderPaletteGroupHeader,
        renderPaletteOption,
        renderPaletteOverlay,
        renderPalettePanel,
        renderPalettePlaceholder,
    } from "../CommandPalettePage.const.svelte";
    import type { CommandPaletteExampleProps } from "../CommandPalettePageSvelte.types";

    type Props = CommandPaletteExampleProps;

    let { visibility = $bindable(), query = $bindable(), ...props }: Props = $props();

    const actions = $derived(CommandPalettePageUtils.filterItems(GROUPED_ACTIONS, query));
</script>

<div class={styles.root}>
    <Button
        id="defaultOpenPalette"
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
