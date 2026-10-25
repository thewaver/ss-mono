<script lang="ts">
    import { DRAWER_EDGES, MODAL_DEFAULTS } from "@thewaver/ss-components-svelte";
    import type { DrawerEdge } from "@thewaver/ss-components-svelte";
    import { ModalKnobs } from "@thewaver/ss-playground/App/Knobs/Modals.const";
    import { DOCS_ROOT, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/DrawerPage/DrawerPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import SwipeDocsExample from "./Docs/Swipe.svelte";

    let edge = $state<DrawerEdge>(DRAWER_EDGES[0]);
    let transitionDurationMs = $state(MODAL_DEFAULTS.transitionDurationMs);
    let isDismissableOnOverlayClick = $state(MODAL_DEFAULTS.isDismissableOnOverlayClick);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {edge} {transitionDurationMs} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"edge"}
            label={"Edge"}
            hint={"Which edge of the screen the drawer is attached to. It fills the length of that edge, and the painter slides it in from there."}
            controls={"Sets DrawerProps.edge"}
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
            label={"Transition duration (ms)"}
            hint={"How long the drawer and its overlay take to arrive and leave. At 0 they appear and go at once."}
            controls={"Sets DrawerProps.transitionDurationMs"}
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
    title={"Swiping it away"}
    content={"Swipe a drawer back toward its edge, more than a third of the way across it, and letting go closes it; short of that it springs back. Under a finger, a swipe over content that has been scrolled scrolls it back instead. A swipe is a drag, and a drag needs a single-pointer way to do the same thing ([wcag id=\"2.5.7\"]WCAG 2.5.7[/wcag]), which here is the press on the overlay. So the two share one switch: turning off [prop]isDismissableOnOverlayClick[/prop] turns the swipe off with it."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Swipe.svelte`}>
    <SwipeDocsExample {isDismissableOnOverlayClick} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isDismissableOnOverlayClick"}
            label={"Closes on overlay click"}
            hint={"Whether a press on the overlay closes the drawer. Off, the drawer cannot be swiped away either."}
            controls={"Sets DrawerProps.isDismissableOnOverlayClick"}
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
