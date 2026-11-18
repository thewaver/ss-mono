<script lang="ts">
    import { FLYOUT_MENU_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { FlyoutMenuKnobs } from "@thewaver/ss-playground/App/Knobs/FlyoutMenus.const";
    import { DOCS_SECTIONS,
        DOCS_ROOT,
        FIELD_WIDTH,
    } from "@thewaver/ss-playground/App/Pages/Menus/FlyoutMenuPage/FlyoutMenuPage.const";

    import PageDocsExample from "../../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import NarrowDocsExample from "./Docs/Narrow.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";

    let hoverShowDelayMs = $state(FLYOUT_MENU_DEFAULTS.hoverShowDelayMs);
    let transitionDurationMs = $state(FLYOUT_MENU_DEFAULTS.transitionDurationMs);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {hoverShowDelayMs} {transitionDurationMs} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"hoverShowDelayMs"}
            {...FlyoutMenuKnobs.HOVER_SHOW_DELAY_MS_TEXT}
        >
            <PageNumberField
                value={hoverShowDelayMs}
                min={FlyoutMenuKnobs.MIN_DELAY_MS}
                max={FlyoutMenuKnobs.MAX_DELAY_MS}
                step={FlyoutMenuKnobs.DELAY_STEP_MS}
                width={FIELD_WIDTH}
                ariaLabel={"Hover delay in milliseconds"}
                onInput={(value) => {
                    hoverShowDelayMs = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"transitionDurationMs"}
            {...FlyoutMenuKnobs.TRANSITION_DURATION_MS_TEXT}
        >
            <PageNumberField
                value={transitionDurationMs}
                min={FlyoutMenuKnobs.MIN_TRANSITION_MS}
                max={FlyoutMenuKnobs.MAX_TRANSITION_MS}
                step={FlyoutMenuKnobs.TRANSITION_STEP_MS}
                width={FIELD_WIDTH}
                ariaLabel={"Transition duration in milliseconds"}
                onInput={(value) => {
                    transitionDurationMs = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.tooNarrowEveryEntry}
/>

<PageDocsExample path={`${DOCS_ROOT}/Narrow.svelte`}>
    <NarrowDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.rightLeft}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>
