<script lang="ts">
    import { ColorInput } from "@thewaver/ss-components-svelte";
    import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { toNearestPaletteColor } from "@thewaver/ss-playground/App/Pages/ColorInputPage/ColorInputPage.const";

    import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker.svelte";
    import PageColorInputContent from "../../../StyledComponents/ColorInputContent/ColorInputContent.svelte";
    import type { ColorInputExampleProps } from "../ColorInputPage.types";

    type Props = ColorInputExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<ColorInput
    {...pageColorPickerSlots}
    bind:value
    ariaLabel={"Palette color"}
    {...COLOR_INPUT_LABELS}
    onInput={(next) => {
        value = toNearestPaletteColor(next);
    }}
>
    {#snippet renderContent(renderProps)}
        <PageColorInputContent {renderProps} />
    {/snippet}
</ColorInput>
