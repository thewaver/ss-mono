<script lang="ts">
    import { Checkbox, CornerHighlight } from "@thewaver/ss-components-svelte";

    import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.svelte";

    const CORNER_LENGTH = { width: 8, height: 8 };
    const STROKE_THICKNESS = 2;

    let checked = $state(true);
</script>

<Checkbox bind:checked ariaLabel={"Decorated checkbox"} isPressed={checked}>
    {#snippet renderContent(flags)}
        <PageCheckboxContent {flags}>Decorated checkbox</PageCheckboxContent>
    {/snippet}

    {#snippet renderDecoration(flags)}
        <CornerHighlight
            color={flags.isPressed ? "yellow" : "transparent"}
            cornerLength={CORNER_LENGTH}
            strokeThickness={STROKE_THICKNESS}
        />
    {/snippet}
</Checkbox>
