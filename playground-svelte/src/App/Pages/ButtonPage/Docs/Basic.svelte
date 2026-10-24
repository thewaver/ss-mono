<script lang="ts">
    import { Button } from "@thewaver/ss-components-svelte";

    import type { ButtonDocsExampleProps } from "../ButtonPageSvelte.types";
    import PressedButtonContent from "./PressedButtonContent.svelte";

    type Props = ButtonDocsExampleProps;

    let props: Props = $props();

    let clicks = $state(0);
</script>

<Button
    isDisabled={props.isDisabled}
    hasError={props.hasError}
    isPressed={props.isPressed}
    onClick={() => {
        clicks += 1;
    }}
>
    {#snippet renderContent(flags)}
        <PressedButtonContent {flags}>{`Clicks: ${clicks}`}</PressedButtonContent>
    {/snippet}
</Button>
