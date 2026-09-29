<script lang="ts">
    import { Button } from "@thewaver/ss-components-svelte";

    import PageMeridiemToggleContent from "../../StyledComponents/MeridiemToggleContent/MeridiemToggleContent.svelte";
    import type { MeridiemToggleProps } from "./MeridiemToggle.types";

    let props: MeridiemToggleProps = $props();
</script>

<Button
    isDisabled={props.isDisabled}
    ariaLabel={`Before or after noon: ${props.meridiem === "am" ? "AM" : "PM"}`}
    onClick={props.onToggle}
>
    {#snippet renderContent(flags)}
        <PageMeridiemToggleContent {flags} meridiem={props.meridiem} />
    {/snippet}
</Button>
