<script lang="ts">
    import { Select } from "@thewaver/ss-components-svelte";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import {
        COUNTRIES_WITH_DISABLED,
        COUNTRIES_WITH_REACHABLE,
        PLACEHOLDER,
        renderSelectPopup,
    } from "../SelectPage.const.svelte";
    import type { SelectDisabledOptionsDocsExampleProps } from "../SelectPageSvelte.types";

    type Props = SelectDisabledOptionsDocsExampleProps;

    let props: Props = $props();

    let value = $state<string | undefined>();
</script>

<Select
    renderHighlightFloater={renderPageHighlightFloater}
    bind:value
    options={props.isReachable ? COUNTRIES_WITH_REACHABLE : COUNTRIES_WITH_DISABLED}
    ariaLabel={"Country"}
    renderPopup={renderSelectPopup}
>
    {#snippet renderContent(selectedOption, flags)}
        <PageSelectContent {flags}>{selectedOption?.value ?? PLACEHOLDER}</PageSelectContent>
    {/snippet}

    {#snippet renderOption(option, flags)}
        <PageSelectOptionContent isGliding {flags}>{option.value}</PageSelectOptionContent>
    {/snippet}
</Select>
