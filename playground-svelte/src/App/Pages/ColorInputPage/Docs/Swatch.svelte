<script lang="ts">
    import { ColorInput } from "@thewaver/ss-components-svelte";
    import {
        COLOR_INPUT_LABELS,
        computeColorValueText,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

    import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker.svelte";
    import PageColorInputContent from "../../../StyledComponents/ColorInputContent/ColorInputContent.svelte";

    let value = $state("#3366ff");
</script>

<ColorInput
    {...pageColorPickerSlots}
    bind:value
    ariaLabel={"Accent color"}
    {...COLOR_INPUT_LABELS}
    computeValueText={computeColorValueText}
>
    {#snippet renderContent(renderProps)}
        <PageColorInputContent {renderProps} isCompact={true} />
    {/snippet}
</ColorInput>

<div class={exampleStyles.exampleReadout} data-readout>{`Value: ${value}`}</div>
