<script lang="ts">
    import { Select } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/SelectPage/SelectPage.css";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectGroupContent from "../../../StyledComponents/SelectGroupContent/SelectGroupContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { PLACEHOLDER, renderSelectPopup } from "../SelectPage.const.svelte";
    import type { SelectVirtualizedExampleProps } from "../SelectPage.types";

    const STRESS_OPTION_HEIGHT = 100;
    const STRESS_GROUP_HEIGHT = 32;

    type Props = SelectVirtualizedExampleProps;

    let { value = $bindable(), visibility = $bindable(), ...props }: Props = $props();
</script>

<div class={styles.column}>
    <Select
        renderHighlightFloater={renderPageHighlightFloater}
        bind:value
        bind:visibility
        options={props.options}
        ariaLabel={"Route"}
        computeEstimatedOptionHeight={() => STRESS_OPTION_HEIGHT}
        computeEstimatedGroupHeight={() => STRESS_GROUP_HEIGHT}
        computeCustomText={(option) => option.value.name}
        renderPopup={renderSelectPopup}
    >
        {#snippet renderGroupHeader(group)}
            <PageSelectGroupContent>{group.label}</PageSelectGroupContent>
        {/snippet}

        {#snippet renderContent(selectedOption, flags)}
            <PageSelectContent {flags}>{selectedOption?.value.name ?? PLACEHOLDER}</PageSelectContent>
        {/snippet}

        {#snippet renderOption(option, flags)}
            <PageSelectOptionContent isGliding {flags} description={option.value.description}>
                {option.value.name}
            </PageSelectOptionContent>
        {/snippet}
    </Select>
</div>
