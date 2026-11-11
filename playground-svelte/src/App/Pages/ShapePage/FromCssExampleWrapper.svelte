<script lang="ts">
    import { TextArea } from "@thewaver/ss-components-svelte";
    import { ShapeKnobs } from "@thewaver/ss-playground/App/Knobs/Shapes.const";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import {
        FROM_CSS_FIELD_WIDTH,
        FROM_CSS_MAX_ROWS,
        FROM_CSS_MIN_ROWS,
    } from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.const";
    import { ShapePageUtils } from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.utils";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageTextFieldContent from "../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import FromCssExample from "./Examples/FromCss.svelte";

    let cssText = $state(ShapeKnobs.STARTING_FROM_CSS_TEXT);

    const invalidDeclarations = $derived(ShapePageUtils.findInvalidCssDeclarations(cssText));
</script>

<TextArea
    bind:value={cssText}
    hasError={invalidDeclarations.length > 0}
    isAutoSizing={true}
    minRows={FROM_CSS_MIN_ROWS}
    maxRows={FROM_CSS_MAX_ROWS}
    padding={FIELD_PADDING}
    gap={FIELD_GAP}
    ariaLabel={"CSS"}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={FROM_CSS_FIELD_WIDTH} isStretched={true} />
    {/snippet}
</TextArea>

{#if invalidDeclarations.length > 0}
    <div class={exampleStyles.exampleReadout} data-readout>
        {`Not valid CSS: ${invalidDeclarations.join("; ")}`}
    </div>
{/if}

<FromCssExample {cssText} />
