<script lang="ts">
    import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/ColorAreaPage/ColorAreaPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import PickerDocsExample from "./Docs/Picker.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";

    let isDisabled = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isDisabled"}
            label={"Disabled"}
            hint={"Turns the square off: neither a press, a drag nor the arrow keys move it, and the Tab key skips both of its sliders."}
            controls={"Sets ColorAreaProps.isDisabled"}
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
    title={"Right to left"}
    content={"Inside a box whose text runs right to left, the square stays as it is. It is a picture of color rather than text, so saturation still grows to the right and brightness upward, and the right arrow still moves the handle right, as it does on screen."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"A picker built around it"}
    content={"The square moves saturation and brightness and nothing else, so a picker adds the rest around it. Here a button opens a dialog holding the square, a Range for the hue and a field for each channel, all reading and writing one [prop]hsv[/prop] signal. The button says what it opens through [prop]ariaHasPopup[/prop] and whether it is open through [prop]ariaExpanded[/prop], so a screen reader hears both before and after the press. ColorInput is this picker ready-made."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Picker.svelte`}>
    <PickerDocsExample />
</PageDocsExample>
