<script lang="ts">
    import { DRAWER_EDGES, MODAL_DEFAULTS } from "@thewaver/ss-components-svelte";
    import type { DrawerEdge } from "@thewaver/ss-components-svelte";
    import { ModalKnobs } from "@thewaver/ss-playground/App/Knobs/Modals.const";
    import { DOCS_SECTIONS, DOCS_ROOT, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/DrawerPage/DrawerPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import SwipeDocsExample from "./Docs/Swipe.svelte";
    import { DrawerKnobs } from "@thewaver/ss-playground/App/Knobs/Drawers.const";

    let edge = $state<DrawerEdge>(DRAWER_EDGES[0]);
    let transitionDurationMs = $state(MODAL_DEFAULTS.transitionDurationMs);
    let isDismissableOnOverlayClick = $state(MODAL_DEFAULTS.isDismissableOnOverlayClick);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {edge} {transitionDurationMs} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"edge"}
            {...DrawerKnobs.EDGE_TEXT}
        >
            <PageSelectField
                value={edge}
                values={DRAWER_EDGES}
                ariaLabel={"Edge"}
                onChange={(value) => {
                    edge = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"transitionDurationMs"}
            {...DrawerKnobs.TRANSITION_DURATION_MS_TEXT}
        >
            <PageNumberField
                value={transitionDurationMs}
                min={ModalKnobs.MIN_TRANSITION_MS}
                max={ModalKnobs.MAX_TRANSITION_MS}
                step={ModalKnobs.TRANSITION_STEP_MS}
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
    {...DOCS_SECTIONS.swipingAway}
/>

<PageDocsExample path={`${DOCS_ROOT}/Swipe.svelte`}>
    <SwipeDocsExample {isDismissableOnOverlayClick} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isDismissableOnOverlayClick"}
            {...DrawerKnobs.IS_DISMISSABLE_ON_OVERLAY_CLICK_TEXT}
        >
            <PageCheckField
                value={isDismissableOnOverlayClick}
                ariaLabel={"Closes on overlay click"}
                onChange={(value) => {
                    isDismissableOnOverlayClick = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>
