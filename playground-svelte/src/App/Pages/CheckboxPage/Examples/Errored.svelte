<script lang="ts">
    import { Checkbox } from "@thewaver/ss-components-svelte";

    import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.svelte";
    import type { CheckboxExampleProps } from "../CheckboxPage.types";

    type Props = CheckboxExampleProps;

    let { checked = $bindable() }: Props = $props();
</script>

<Checkbox bind:checked ariaLabel={"Errored checkbox"} hasError={!checked}>
    {#snippet renderContent(flags)}
        <PageCheckboxContent {flags} />
    {/snippet}
</Checkbox>
