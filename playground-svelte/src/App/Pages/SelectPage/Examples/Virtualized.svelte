<script lang="ts">
    import { Select } from "@thewaver/ss-components-svelte";
    import type { SelectItem } from "@thewaver/ss-components-svelte";
    import { SelectKnobs } from "@thewaver/ss-playground/App/Knobs/Selects.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/SelectPage/SelectPage.css";

    import PageExampleKnobs from "../../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectGroupContent from "../../../StyledComponents/SelectGroupContent/SelectGroupContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { PLACEHOLDER, renderSelectPopup } from "../SelectPage.const.svelte";
    import type { Delivery } from "../SelectPage.types";

    const STRESS_COUNT_FIELD_WIDTH = 120;
    const STRESS_OPTION_HEIGHT = 100;
    const STRESS_GROUP_HEIGHT = 32;

    type Props = {
        value: Delivery | undefined;
        visibility: boolean;
        options: SelectItem<Delivery>[];
        count: number;
        onCountChange: (count: number) => void;
    };

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
        {#snippet renderGroup(group)}
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

    <PageExampleKnobs>
        <PageProp
            itemKey={"stressCount"}
            label={"Option count"}
            hint={"How many options the list holds. Only the ones on screen are rendered, so a very large number should still open instantly."}
        >
            <PageNumberField
                value={props.count}
                min={SelectKnobs.MIN_STRESS_COUNT}
                max={SelectKnobs.MAX_STRESS_COUNT}
                step={SelectKnobs.STRESS_COUNT_STEP}
                width={STRESS_COUNT_FIELD_WIDTH}
                ariaLabel={"Option count"}
                onInput={props.onCountChange}
            />
        </PageProp>
    </PageExampleKnobs>
</div>
