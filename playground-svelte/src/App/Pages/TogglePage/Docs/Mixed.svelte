<script lang="ts">
    import { Toggle } from "@thewaver/ss-components-svelte";

    import PageControlRow from "../../../PageComponents/ControlRow/PageControlRow.svelte";
    import PageControlRowLabel from "../../../PageComponents/ControlRow/PageControlRowLabel.svelte";
    import PageToggleContent from "../../../StyledComponents/ToggleContent/ToggleContent.svelte";

    let all = $state(false);
    let firstChild = $state(true);
    let secondChild = $state(false);

    const isMixed = $derived.by(() => firstChild !== secondChild);

    $effect(() => {
        all = firstChild && secondChild;
    });
</script>

<PageControlRow>
    <Toggle
        bind:checked={all}
        {isMixed}
        id={"allSettings"}
        ariaLabel={"All settings"}
        onChange={(isChecked) => {
            firstChild = isChecked;
            secondChild = isChecked;
        }}
    >
        {#snippet renderContent(flags)}
            <PageToggleContent {flags}>All settings</PageToggleContent>
        {/snippet}
    </Toggle>

    <PageControlRowLabel>controls</PageControlRowLabel>

    <Toggle bind:checked={firstChild} id={"firstSetting"} ariaLabel={"First setting"}>
        {#snippet renderContent(flags)}
            <PageToggleContent {flags}>First setting</PageToggleContent>
        {/snippet}
    </Toggle>

    <Toggle bind:checked={secondChild} ariaLabel={"Second setting"}>
        {#snippet renderContent(flags)}
            <PageToggleContent {flags}>Second setting</PageToggleContent>
        {/snippet}
    </Toggle>
</PageControlRow>
