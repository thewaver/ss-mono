<script lang="ts">
    import { CornerHighlight, Toggle } from "@thewaver/ss-components-svelte";

    import PageToggleContent from "../../../StyledComponents/ToggleContent/ToggleContent.svelte";

    const CORNER_LENGTH = { width: 8, height: 8 };
    const STROKE_THICKNESS = 2;

    let checked = $state(true);
</script>

<Toggle bind:checked ariaLabel={"Decorated toggle"} isPressed={checked}>
    {#snippet renderContent(flags)}
        <PageToggleContent {flags}>Decorated toggle</PageToggleContent>
    {/snippet}

    {#snippet renderDecoration(flags)}
        <CornerHighlight
            color={flags.isPressed ? "yellow" : "transparent"}
            cornerLength={CORNER_LENGTH}
            strokeThickness={STROKE_THICKNESS}
        />
    {/snippet}
</Toggle>
