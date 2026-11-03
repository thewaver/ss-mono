<script lang="ts">
    import { Button } from "@thewaver/ss-components-svelte";

    import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { LookStateProps } from "./LooksPage.types";

    let props: LookStateProps = $props();
</script>

<Button sizing={"fill"} isPressed={props.isPressed} isDisabled={props.isDisabled} hasError={props.hasError}>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>{props.state}</PageButtonContent>
    {/snippet}
</Button>
