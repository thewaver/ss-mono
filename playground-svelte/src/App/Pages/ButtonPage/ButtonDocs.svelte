<script lang="ts">
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import DecoratedDocsExample from "./Docs/Decorated.svelte";
    import RepeatingDocsExample from "./Docs/Repeating.svelte";
    import TooltipDocsExample from "./Docs/Tooltip.svelte";
    import { ButtonKnobs } from "@thewaver/ss-playground/App/Knobs/Buttons.const";

    let isDisabled = $state(false);
    let hasError = $state(false);
    let isPressed = $state(false);
    let isTooltipDisabled = $state(false);
    let isReachableWhenDisabled = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {isDisabled} {hasError} {isPressed} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"hasError"}
            {...ButtonKnobs.HAS_ERROR_TEXT}
        >
            <PageCheckField
                value={hasError}
                ariaLabel={"Error"}
                onChange={(value) => {
                    hasError = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"isPressed"}
            {...ButtonKnobs.IS_PRESSED_TEXT}
        >
            <PageCheckField
                value={isPressed}
                ariaLabel={"Pressed"}
                onChange={(value) => {
                    isPressed = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"isDisabled"}
            {...ButtonKnobs.IS_DISABLED_TEXT}
        >
            <PageCheckField
                value={isDisabled}
                ariaLabel={"Disabled"}
                onChange={(value) => {
                    isDisabled = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.tooltip}
/>

<PageDocsExample path={`${DOCS_ROOT}/Tooltip.svelte`}>
    <TooltipDocsExample isDisabled={isTooltipDisabled} {isReachableWhenDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"tooltipIsReachableWhenDisabled"}
            {...ButtonKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
        >
            <PageCheckField
                value={isReachableWhenDisabled}
                ariaLabel={"Reachable when disabled"}
                onChange={(value) => {
                    isReachableWhenDisabled = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"tooltipIsDisabled"}
            {...ButtonKnobs.IS_DISABLED_TEXT}
        >
            <PageCheckField
                value={isTooltipDisabled}
                ariaLabel={"Disabled"}
                onChange={(value) => {
                    isTooltipDisabled = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.decoration}
/>

<PageDocsExample path={`${DOCS_ROOT}/Decorated.svelte`}>
    <DecoratedDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.holdRepeat}
/>

<PageDocsExample path={`${DOCS_ROOT}/Repeating.svelte`}>
    <RepeatingDocsExample />
</PageDocsExample>
