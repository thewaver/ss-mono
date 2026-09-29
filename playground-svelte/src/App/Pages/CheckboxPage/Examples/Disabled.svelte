<script lang="ts">
    import { Checkbox } from "@thewaver/ss-components-svelte";

    import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.svelte";
    import type { CheckboxExampleProps } from "../CheckboxPage.types";

    type Props = CheckboxExampleProps;

    let { checked = $bindable() }: Props = $props();
</script>

<Checkbox bind:checked ariaLabel={"Disabled checkbox"} isDisabled={true}>
    {#snippet renderContent(flags)}
        <PageCheckboxContent {flags} />
    {/snippet}
</Checkbox>
