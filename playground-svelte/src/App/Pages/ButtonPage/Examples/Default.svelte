<script lang="ts">
    import { Button } from "@thewaver/ss-components-svelte";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { ButtonExampleProps } from "../ButtonPage.types";

    type Props = ButtonExampleProps;

    let props: Props = $props();
</script>

<Button onClick={props.onClick}>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>Click Me</PageButtonContent>
    {/snippet}
</Button>
