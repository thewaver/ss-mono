<script lang="ts">
    import { Checkbox } from "@thewaver/ss-components-svelte";

    import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.svelte";

    let checked = $state(true);
</script>

<div dir={"rtl"}>
    <Checkbox bind:checked ariaLabel={"Remember me"}>
        {#snippet renderContent(flags)}
            <PageCheckboxContent {flags}>Remember me</PageCheckboxContent>
        {/snippet}
    </Checkbox>
</div>
