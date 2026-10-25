<script lang="ts">
    import { Toggle } from "@thewaver/ss-components-svelte";

    import PageToggleContent from "../../../StyledComponents/ToggleContent/ToggleContent.svelte";

    let checked = $state(false);
</script>

<div dir={"rtl"}>
    <Toggle bind:checked ariaLabel={"Send notifications"}>
        {#snippet renderContent(flags)}
            <PageToggleContent {flags}>Send notifications</PageToggleContent>
        {/snippet}
    </Toggle>
</div>
