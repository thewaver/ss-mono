<script lang="ts">
    import { Corners, Toggle } from "@thewaver/ss-components-svelte";

    import PageToggleContent from "../../../StyledComponents/ToggleContent/ToggleContent.svelte";
    import type { ToggleExampleProps } from "../TogglePage.types";

    const CORNER_LENGTH = { width: 8, height: 8 };
    const STROKE_THICKNESS = 2;

    type Props = ToggleExampleProps;

    let { checked = $bindable() }: Props = $props();
</script>

<Toggle bind:checked ariaLabel={"Decorated toggle"} isPressed={checked}>
    {#snippet renderContent(flags)}
        <PageToggleContent {flags} />
    {/snippet}

    {#snippet renderDecoration(flags)}
        <Corners
            color={flags.isPressed ? "yellow" : "transparent"}
            cornerLength={CORNER_LENGTH}
            strokeThickness={STROKE_THICKNESS}
        />
    {/snippet}
</Toggle>
