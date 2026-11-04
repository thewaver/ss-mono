<script lang="ts">
    import { Button } from "@thewaver/ss-components-svelte";

    import PageControlButtonContent from "../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import type { SkinStateProps } from "./SkinsPage.types";

    let props: SkinStateProps = $props();
</script>

<Button isPressed={props.isPressed} isDisabled={props.isDisabled} hasError={props.hasError}>
    {#snippet renderContent(flags)}
        <PageControlButtonContent {flags}>{props.state}</PageControlButtonContent>
    {/snippet}
</Button>
