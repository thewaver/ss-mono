<script lang="ts">
    import { ColorInput } from "@thewaver/ss-components-svelte";
    import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

    import PageColorInputContent from "../../StyledComponents/ColorInputContent/ColorInputContent.svelte";
    import { pageColorPickerSlots } from "../ColorPicker/ColorPicker.svelte";
    import { useFieldReset } from "./Field.context";
    import type { PageColorFieldProps } from "./Field.types";

    let props: PageColorFieldProps = $props();

    useFieldReset(
        () => props.value,
        (value) => props.onInput(value),
    );
</script>

<ColorInput
    bind:value={() => props.value, props.onInput}
    {...COLOR_INPUT_LABELS}
    isDisabled={props.isDisabled}
    ariaLabel={props.ariaLabel}
    {...pageColorPickerSlots}
>
    {#snippet renderContent(renderProps)}
        <PageColorInputContent {renderProps} isCompact={true} />
    {/snippet}
</ColorInput>
