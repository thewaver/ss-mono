<script lang="ts">
    import { Checkbox, Corners } from "@thewaver/ss-components-svelte";

    import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.svelte";
    import type { CheckboxExampleProps } from "../CheckboxPage.types";

    const CORNER_LENGTH = { width: 8, height: 8 };
    const STROKE_THICKNESS = 2;

    type Props = CheckboxExampleProps;

    let { checked = $bindable() }: Props = $props();
</script>

<Checkbox bind:checked ariaLabel={"Decorated checkbox"} isPressed={checked}>
    {#snippet renderContent(flags)}
        <PageCheckboxContent {flags} />
    {/snippet}

    {#snippet renderDecoration(flags)}
        <Corners
            color={flags.isPressed ? "yellow" : "transparent"}
            cornerLength={CORNER_LENGTH}
            strokeThickness={STROKE_THICKNESS}
        />
    {/snippet}
</Checkbox>
