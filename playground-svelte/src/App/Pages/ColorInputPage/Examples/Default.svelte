<script lang="ts">
    import { ColorInput } from "@thewaver/ss-components-svelte";
    import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

    import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker.svelte";
    import PageColorInputContent from "../../../StyledComponents/ColorInputContent/ColorInputContent.svelte";
    import type { ColorInputExampleProps } from "../ColorInputPage.types";

    type Props = ColorInputExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<ColorInput {...pageColorPickerSlots} bind:value ariaLabel={"Brand color"} {...COLOR_INPUT_LABELS}>
    {#snippet renderContent(renderProps)}
        <PageColorInputContent {renderProps} />
    {/snippet}
</ColorInput>
