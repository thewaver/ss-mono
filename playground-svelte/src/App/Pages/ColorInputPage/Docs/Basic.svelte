<script lang="ts">
    import { ColorInput } from "@thewaver/ss-components-svelte";
    import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

    import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker.svelte";
    import PageColorInputContent from "../../../StyledComponents/ColorInputContent/ColorInputContent.svelte";
    import type { ColorInputBasicDocsExampleProps } from "../ColorInputPageSvelte.types";

    type Props = ColorInputBasicDocsExampleProps;

    let props: Props = $props();

    let value = $state("#3366ff");
</script>

<ColorInput
    {...pageColorPickerSlots}
    bind:value
    hasError={props.hasError}
    isDisabled={props.isDisabled}
    ariaLabel={"Brand color"}
    {...COLOR_INPUT_LABELS}
>
    {#snippet renderContent(renderProps)}
        <PageColorInputContent {renderProps} />
    {/snippet}
</ColorInput>
