<script lang="ts">
    import { Checkbox } from "@thewaver/ss-components-svelte";

    import PageControlRow from "../../../PageComponents/ControlRow/PageControlRow.svelte";
    import PageControlRowLabel from "../../../PageComponents/ControlRow/PageControlRowLabel.svelte";
    import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.svelte";

    let all = $state(false);
    let firstChild = $state(true);
    let secondChild = $state(false);

    const isMixed = $derived.by(() => firstChild !== secondChild);

    $effect(() => {
        all = firstChild && secondChild;
    });
</script>

<PageControlRow>
    <Checkbox
        bind:checked={all}
        {isMixed}
        id={"selectAll"}
        ariaLabel={"Select all"}
        onChange={(isChecked) => {
            firstChild = isChecked;
            secondChild = isChecked;
        }}
    >
        {#snippet renderContent(flags)}
            <PageCheckboxContent {flags}>Select all</PageCheckboxContent>
        {/snippet}
    </Checkbox>

    <PageControlRowLabel>controls</PageControlRowLabel>

    <Checkbox bind:checked={firstChild} id={"firstChild"} ariaLabel={"First child"}>
        {#snippet renderContent(flags)}
            <PageCheckboxContent {flags}>First child</PageCheckboxContent>
        {/snippet}
    </Checkbox>

    <Checkbox bind:checked={secondChild} ariaLabel={"Second child"}>
        {#snippet renderContent(flags)}
            <PageCheckboxContent {flags}>Second child</PageCheckboxContent>
        {/snippet}
    </Checkbox>
</PageControlRow>
