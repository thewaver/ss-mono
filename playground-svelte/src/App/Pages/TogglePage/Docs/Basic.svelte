<script lang="ts">
    import { Toggle } from "@thewaver/ss-components-svelte";

    import PageToggleContent from "../../../StyledComponents/ToggleContent/ToggleContent.svelte";
    import type { ToggleBasicDocsExampleProps } from "../TogglePageSvelte.types";

    type Props = ToggleBasicDocsExampleProps;

    let props: Props = $props();

    let checked = $state(false);
</script>

<Toggle bind:checked hasError={props.hasError} isDisabled={props.isDisabled} ariaLabel={"Default toggle"}>
    {#snippet renderContent(flags)}
        <PageToggleContent {flags}>Default toggle</PageToggleContent>
    {/snippet}
</Toggle>
