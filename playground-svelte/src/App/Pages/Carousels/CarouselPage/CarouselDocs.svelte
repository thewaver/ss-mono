<script lang="ts">
    import { CAROUSEL_DEFAULTS, CAROUSEL_ORIENTATIONS, CarouselPlacements } from "@thewaver/ss-components-svelte";
    import type { CarouselOrientation } from "@thewaver/ss-components-svelte";
    import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";
    import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
    import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
    import { FIELD_WIDTH, PLACEMENT_FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";

    import PageDocsAlert from "../../../PageComponents/DocsAlert/PageDocsAlert.svelte";
    import PageDocsExample from "../../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import LooksDocsExample from "./Docs/Looks.svelte";
    import LoopingDocsExample from "./Docs/Looping.svelte";
    import PairsDocsExample from "./Docs/Pairs.svelte";
    import ScrolledDocsExample from "./Docs/Scrolled.svelte";
    import WindowedDocsExample from "./Docs/Windowed.svelte";

    let transitionDurationMs = $state(CAROUSEL_DEFAULTS.transitionDurationMs);
    let orientation = $state<CarouselOrientation>(CAROUSEL_DEFAULTS.orientation);
    let isDisabled = $state(false);
    let placement = $state<CarouselPlacements.SampleKey>(CarouselKnobs.STARTING_PLACEMENT);
    let looksOrientation = $state<CarouselOrientation>(CAROUSEL_DEFAULTS.orientation);
    let isLooping = $state(CAROUSEL_DEFAULTS.isLooping);
    let autoplayDelayMs = $state(CarouselKnobs.STARTING_DELAY_MS);
</script>

<PageDocsAlert severity="alert">
    Build Previous and Next buttons on the controller <span class={docsStyles.docsPropName}>onMount</span> hands you,
    since not everyone can swipe (<a href={WCAG_URLS["2.5.7"]}>WCAG 2.5.7</a>), and if the carousel moves on its own, a
    button that stops it (<a href={WCAG_URLS["2.2.2"]}>WCAG 2.2.2</a>). Pass those buttons' hover and focus to
    <span class={docsStyles.docsPropName}>setIsHeldByPage</span>, so it holds still while someone is using them.
</PageDocsAlert>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {orientation} {transitionDurationMs} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"transitionDurationMs"}
            {...CarouselKnobs.TRANSITION_DURATION_MS_TEXT}
        >
            <PageNumberField
                value={transitionDurationMs}
                min={CarouselKnobs.MIN_TRANSITION_MS}
                max={CarouselKnobs.MAX_TRANSITION_MS}
                step={CarouselKnobs.TRANSITION_STEP_MS}
                width={FIELD_WIDTH}
                ariaLabel={"Transition duration in milliseconds"}
                onInput={(value) => {
                    transitionDurationMs = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"orientation"}
            {...CarouselKnobs.ORIENTATION_TEXT}
        >
            <PageSelectField
                value={orientation}
                values={CAROUSEL_ORIENTATIONS}
                ariaLabel={"Orientation"}
                onChange={(value) => {
                    orientation = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"isDisabled"}
            {...CarouselKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.looks}
/>

<PageDocsAlert severity="info">
    The looks here are only examples. Any rule you write can be the <span class={docsStyles.docsPropName}
        >placement</span
    >: a function told how far a slide is from the one showing that answers where to draw it, so the layout is entirely
    yours.
</PageDocsAlert>

<PageDocsExample path={`${DOCS_ROOT}/Looks.svelte`}>
    <LooksDocsExample {placement} orientation={looksOrientation} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"placement"}
            {...CarouselKnobs.PLACEMENT_TEXT}
        >
            <PageSelectField
                value={placement}
                values={CarouselPlacements.SAMPLE_KEYS}
                width={PLACEMENT_FIELD_WIDTH}
                ariaLabel={"Placement"}
                onChange={(value) => {
                    placement = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"orientation"}
            {...CarouselKnobs.ORIENTATION_2_TEXT}
        >
            <PageSelectField
                value={looksOrientation}
                values={CAROUSEL_ORIENTATIONS}
                ariaLabel={"Orientation"}
                onChange={(value) => {
                    looksOrientation = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.loopingAndSelfMoving}
/>

<PageDocsExample path={`${DOCS_ROOT}/Looping.svelte`}>
    <LoopingDocsExample {isLooping} {autoplayDelayMs} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isLooping"}
            {...CarouselKnobs.IS_LOOPING_TEXT}
        >
            <PageCheckField
                value={isLooping}
                ariaLabel={"Looping"}
                onChange={(value) => {
                    isLooping = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"autoplayDelayMs"}
            {...CarouselKnobs.AUTOPLAY_DELAY_MS_TEXT}
        >
            <PageNumberField
                value={autoplayDelayMs}
                min={CarouselKnobs.MIN_DELAY_MS}
                max={CarouselKnobs.MAX_DELAY_MS}
                step={CarouselKnobs.DELAY_STEP_MS}
                width={FIELD_WIDTH}
                ariaLabel={"Delay in milliseconds"}
                onInput={(value) => {
                    autoplayDelayMs = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.drivenOutside}
/>

<PageDocsExample path={`${DOCS_ROOT}/Scrolled.svelte`}>
    <ScrolledDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.severalSlidesStop}
/>

<PageDocsExample path={`${DOCS_ROOT}/Pairs.svelte`}>
    <PairsDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.onlyNearbySlidesBuilt}
/>

<PageDocsExample path={`${DOCS_ROOT}/Windowed.svelte`}>
    <WindowedDocsExample />
</PageDocsExample>
