<script lang="ts">
    import { ColorInput, Label } from "@thewaver/ss-components-svelte";
    import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

    import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker.svelte";
    import PageColorInputContent from "../../../StyledComponents/ColorInputContent/ColorInputContent.svelte";
    import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.svelte";

    const LABEL_GAP = 5;

    let value = $state("#ff0055");
</script>

<Label orientation={"vertical"} gap={LABEL_GAP}>
    <PageLabelCaption>Accent</PageLabelCaption>

    <ColorInput {...pageColorPickerSlots} bind:value {...COLOR_INPUT_LABELS}>
        {#snippet renderContent(renderProps)}
            <PageColorInputContent {renderProps} />
        {/snippet}
    </ColorInput>
</Label>
