<script lang="ts">
    import { ColorInput, Label } from "@thewaver/ss-components-svelte";
    import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

    import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker.svelte";
    import PageColorInputContent from "../../../StyledComponents/ColorInputContent/ColorInputContent.svelte";
    import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.svelte";
    import type { ColorInputExampleProps } from "../ColorInputPage.types";

    const LABEL_GAP = 5;

    type Props = ColorInputExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<Label orientation={"vertical"} gap={LABEL_GAP}>
    <PageLabelCaption>Accent</PageLabelCaption>

    <ColorInput {...pageColorPickerSlots} bind:value {...COLOR_INPUT_LABELS}>
        {#snippet renderContent(renderProps)}
            <PageColorInputContent {renderProps} />
        {/snippet}
    </ColorInput>
</Label>
