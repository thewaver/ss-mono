<script lang="ts">
    import { Button, CornerHighlight, type InteractionActivation } from "@thewaver/ss-components-svelte";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageRipple from "../../../StyledComponents/Ripple/Ripple.svelte";

    let isPressed = $state(false);
    let activation = $state.raw<InteractionActivation>();
</script>

<Button
    {isPressed}
    onActivation={(next) => {
        activation = next;
    }}
    onClick={() => {
        isPressed = !isPressed;
    }}
>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>Toggle Me</PageButtonContent>
    {/snippet}

    {#snippet renderDecoration(flags)}
        <CornerHighlight color={flags.isPressed ? "yellow" : "transparent"} />
        <PageRipple {activation} color={"yellow"} />
    {/snippet}
</Button>
