<script lang="ts">
    import { Button } from "@thewaver/ss-components-svelte";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { ButtonErroredExampleProps } from "../ButtonPage.types";

    type Props = ButtonErroredExampleProps;

    let props: Props = $props();
</script>

<Button hasError={props.hasError} onClick={props.onClick}>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>Toggle Error</PageButtonContent>
    {/snippet}
</Button>
