<script lang="ts">
    import { Checkbox } from "@thewaver/ss-components-svelte";

    import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.svelte";
    import type { CheckboxBasicDocsExampleProps } from "../CheckboxPageSvelte.types";

    type Props = CheckboxBasicDocsExampleProps;

    let props: Props = $props();

    let checked = $state(false);
</script>

<Checkbox bind:checked hasError={props.hasError} isDisabled={props.isDisabled} ariaLabel={"Default checkbox"}>
    {#snippet renderContent(flags)}
        <PageCheckboxContent {flags}>Default checkbox</PageCheckboxContent>
    {/snippet}
</Checkbox>
