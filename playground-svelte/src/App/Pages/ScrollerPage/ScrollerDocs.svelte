<script lang="ts">
    import { SCROLLER_DEFAULTS, SCROLLER_OVERFLOWS, ScrollerUtils } from "@thewaver/ss-components-svelte";
    import type { ScrollerOverflow, ScrollerProgress } from "@thewaver/ss-components-svelte";
    import { ScrollerKnobs } from "@thewaver/ss-playground/App/Knobs/Scrollers.const";
    import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
    import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
    import { DOCS_SECTIONS, DOCS_ROOT, PERCENT } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";

    import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.svelte";
    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import ArchedDocsExample from "./Docs/Arched.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import BothWaysDocsExample from "./Docs/BothWays.svelte";
    import ColumnDocsExample from "./Docs/Column.svelte";
    import DrivenDocsExample from "./Docs/Driven.svelte";
    import FadingDocsExample from "./Docs/Fading.svelte";
    import FocusableChildrenDocsExample from "./Docs/FocusableChildren.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import ShortTrackDocsExample from "./Docs/ShortTrack.svelte";
    import TabbedDocsExample from "./Docs/Tabbed.svelte";

    let itemCount = $state(ScrollerKnobs.STARTING_ITEM_COUNT);
    let overlapCount = $state(SCROLLER_DEFAULTS.overlapCount);
    let progress = $state<ScrollerProgress>(ScrollerUtils.NO_PROGRESS);
    let overflowX = $state<ScrollerOverflow>("auto");
    let overflowY = $state<ScrollerOverflow>("auto");
    let isAutoHiding = $state(true);
    let isBarOverlaid = $state(true);
    let hideDelayMs = $state(SCROLLER_DEFAULTS.hideDelayMs);
</script>

<PageDocsAlert severity="alert">
    The scroller draws no buttons: build them on the controller <span class={docsStyles.docsPropName}>onMount</span>
    hands you, wherever the page wants them. Without them, a keyboard scrolls the strip only by moving focus, which
    reaches each focusable item, or the box itself when nothing in it takes focus, but not plain content lying beyond
    the last focusable item (<a href={WCAG_URLS["2.1.1"]}>WCAG 2.1.1</a>). Name each button by the way it scrolls, or a
    screen reader announces a button with no name (<a href={WCAG_URLS["4.1.2"]}>WCAG 4.1.2</a>), and point it at the
    box with aria-controls, using the id <span class={docsStyles.docsPropName}>getBoxId</span> hands back.
</PageDocsAlert>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {itemCount} {overlapCount} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"itemCount"}
            {...ScrollerKnobs.ITEM_COUNT_TEXT}
        >
            <PageNumberField
                value={itemCount}
                min={ScrollerKnobs.MIN_ITEM_COUNT}
                max={ScrollerKnobs.MAX_ITEM_COUNT}
                step={ScrollerKnobs.ITEM_COUNT_STEP}
                ariaLabel={"Item count"}
                onInput={(value) => {
                    itemCount = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"overlapCount"}
            {...ScrollerKnobs.OVERLAP_COUNT_TEXT}
        >
            <PageNumberField
                value={overlapCount}
                min={ScrollerKnobs.MIN_OVERLAP_COUNT}
                max={ScrollerKnobs.MAX_OVERLAP_COUNT}
                step={ScrollerKnobs.OVERLAP_COUNT_STEP}
                ariaLabel={"Overlap count"}
                onInput={(value) => {
                    overlapCount = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.focusRevealsTarget}
/>

<PageDocsExample path={`${DOCS_ROOT}/Tabbed.svelte`}>
    <TabbedDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.focusableChildrenAnyKind}
/>

<PageDocsExample path={`${DOCS_ROOT}/FocusableChildren.svelte`}>
    <FocusableChildrenDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.drivenOutside}
/>

<PageDocsExample path={`${DOCS_ROOT}/Driven.svelte`}>
    <DrivenDocsExample bind:progress />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"position"}
            {...ScrollerKnobs.POSITION_TEXT}
        >
            <PageNumberField
                value={Math.round(progress.x * PERCENT)}
                min={ScrollerKnobs.MIN_POSITION}
                max={PERCENT}
                step={ScrollerKnobs.POSITION_STEP}
                ariaLabel={"Position in percent"}
                onInput={(value) => {
                    progress = { ...progress, x: value / PERCENT };
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.shortTrackBetweenButtons}
/>

<PageDocsAlert severity="alert">
    A drawn bar is a target people press and drag, and unlike the browser's own it is not exempt from
    <a href={WCAG_URLS["2.5.8"]}>WCAG 2.5.8</a>, which asks for 24 by 24 CSS pixels. The library keeps the thumb at
    least 24 pixels long; how thick the bar is, is your painter's call. A thinner bar passes only with room around it,
    or with step buttons of the full size on the page doing the same job, and nothing warns about it.
</PageDocsAlert>

<PageDocsExample path={`${DOCS_ROOT}/ShortTrack.svelte`}>
    <ShortTrackDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.archedBar}
/>

<PageDocsExample path={`${DOCS_ROOT}/Arched.svelte`}>
    <ArchedDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.columnScrollingDown}
/>

<PageDocsExample path={`${DOCS_ROOT}/Column.svelte`}>
    <ColumnDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.boxScrollingBothWays}
/>

<PageDocsExample path={`${DOCS_ROOT}/BothWays.svelte`}>
    <BothWaysDocsExample {overflowX} {overflowY} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"overflowX"}
            label={ScrollerKnobs.OVERFLOW_X.label}
            hint={ScrollerKnobs.OVERFLOW_X.hint}
            controls={"Sets ScrollerProps.overflowX"}
        >
            <PageSelectField
                value={overflowX}
                values={SCROLLER_OVERFLOWS}
                ariaLabel={ScrollerKnobs.OVERFLOW_X.label}
                onChange={(value) => {
                    overflowX = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"overflowY"}
            label={ScrollerKnobs.OVERFLOW_Y.label}
            hint={ScrollerKnobs.OVERFLOW_Y.hint}
            controls={"Sets ScrollerProps.overflowY"}
        >
            <PageSelectField
                value={overflowY}
                values={SCROLLER_OVERFLOWS}
                ariaLabel={ScrollerKnobs.OVERFLOW_Y.label}
                onChange={(value) => {
                    overflowY = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.barThatFades}
/>

<PageDocsExample path={`${DOCS_ROOT}/Fading.svelte`}>
    <FadingDocsExample {isAutoHiding} {isBarOverlaid} {hideDelayMs} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isAutoHiding"}
            label={ScrollerKnobs.IS_AUTO_HIDING.label}
            hint={ScrollerKnobs.IS_AUTO_HIDING.hint}
            controls={"Sets ScrollerProps.isAutoHiding"}
        >
            <PageCheckField
                value={isAutoHiding}
                ariaLabel={ScrollerKnobs.IS_AUTO_HIDING.label}
                onChange={(value) => {
                    isAutoHiding = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"isBarOverlaid"}
            label={ScrollerKnobs.IS_BAR_OVERLAID.label}
            hint={ScrollerKnobs.IS_BAR_OVERLAID.hint}
            controls={"Sets ScrollerProps.isBarOverlaid"}
        >
            <PageCheckField
                value={isBarOverlaid}
                ariaLabel={ScrollerKnobs.IS_BAR_OVERLAID.label}
                onChange={(value) => {
                    isBarOverlaid = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"hideDelayMs"}
            label={ScrollerKnobs.HIDE_DELAY_MS.label}
            hint={ScrollerKnobs.HIDE_DELAY_MS.hint}
            controls={"Sets ScrollerProps.hideDelayMs"}
        >
            <PageNumberField
                value={hideDelayMs}
                min={ScrollerKnobs.HIDE_DELAY_MS.min}
                max={ScrollerKnobs.HIDE_DELAY_MS.max}
                step={ScrollerKnobs.HIDE_DELAY_MS.step}
                ariaLabel={ScrollerKnobs.HIDE_DELAY_MS.label}
                onInput={(value) => {
                    hideDelayMs = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.rightLeft}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>
