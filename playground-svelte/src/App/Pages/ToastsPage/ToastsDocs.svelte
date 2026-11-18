<script lang="ts">
    import type { ToastsAlignment, ToastsFlexDirection, ToastsOverflow } from "@thewaver/ss-components-svelte";
    import {
        TOASTS_ALIGNMENTS,
        TOASTS_DEFAULTS,
        TOASTS_FLEX_DIRECTIONS,
        TOASTS_OVERFLOWS,
    } from "@thewaver/ss-components-svelte";
    import { ToastKnobs } from "@thewaver/ss-playground/App/Knobs/Toasts.const";
    import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
    import { DOCS_SECTIONS, DOCS_ROOT, FIELD_WIDTH, NO_LIMIT } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";

    import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.svelte";
    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import type { ToastAnimation, ToastStacking } from "../../StyledComponents/ToastContent/ToastContentSvelte.types";
    import AnimationDocsExample from "./Docs/Animation.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import DurationDocsExample from "./Docs/Duration.svelte";
    import FarDownDocsExample from "./Docs/FarDown.svelte";
    import HotkeysDocsExample from "./Docs/Hotkeys.svelte";
    import LimitDocsExample from "./Docs/Limit.svelte";
    import OwnPainterDocsExample from "./Docs/OwnPainter.svelte";
    import PlacementDocsExample from "./Docs/Placement.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import SharedQueueDocsExample from "./Docs/SharedQueue.svelte";

    let alignment = $state<ToastsAlignment>(ToastKnobs.STARTING_PLACEMENT_ALIGNMENT);
    let flexDirection = $state<ToastsFlexDirection>(TOASTS_DEFAULTS.flexDirection);
    let gap = $state(TOASTS_DEFAULTS.gap);
    let margin = $state(ToastKnobs.STARTING_MARGIN);
    let stacking = $state<ToastStacking>(ToastKnobs.STARTING_STACKING);
    let limit = $state(ToastKnobs.STARTING_LIMIT);
    let overflow = $state<ToastsOverflow>(TOASTS_DEFAULTS.overflow);
    let durationMs = $state(ToastKnobs.STARTING_DURATION_MS);
    let animation = $state<ToastAnimation>(ToastKnobs.STARTING_ANIMATION);
    let transitionDurationMs = $state(TOASTS_DEFAULTS.transitionDurationMs);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample />
</PageDocsExample>

<PageDocsAlert severity="alert">
    A toast can be swiped off the edge its stack sits against. Paint a control that closes it, as Close does here, in
    every toast that can be swiped, or a reader who cannot drag has no way to dismiss it (<a href={WCAG_URLS["2.5.7"]}
        >WCAG 2.5.7</a
    >). The library draws no control of its own.
</PageDocsAlert>

<PageDocsAlert severity="alert">
    Nothing can tab to a stack, since it is drawn at the end of the document, so F8 is the keyboard's way in: it moves
    focus to each stack holding toasts in turn, Shift+F8 goes back, and Escape hands focus back to where it was. One
    shortcut reaches every stack on the page, so a keyboard user can always get to a toast's controls (<a
        href={WCAG_URLS["2.1.1"]}>WCAG 2.1.1</a
    >). Raise toasts in two of the examples below and press F8 twice to try it. A page that needs F8 for itself can
    change the keys or switch them off, as the last example shows.
</PageDocsAlert>

<PageDocsSection
    {...DOCS_SECTIONS.whereStackSitsHow}
/>

<PageDocsExample path={`${DOCS_ROOT}/Placement.svelte`}>
    <PlacementDocsExample {alignment} {flexDirection} {gap} {margin} {stacking} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"alignment"}
            {...ToastKnobs.ALIGNMENT_TEXT}
        >
            <PageSelectField
                value={alignment}
                values={TOASTS_ALIGNMENTS}
                width={FIELD_WIDTH}
                ariaLabel={"Alignment"}
                onChange={(value) => {
                    alignment = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"flexDirection"}
            {...ToastKnobs.FLEX_DIRECTION_TEXT}
        >
            <PageSelectField
                value={flexDirection}
                values={TOASTS_FLEX_DIRECTIONS}
                width={FIELD_WIDTH}
                ariaLabel={"Flex direction"}
                onChange={(value) => {
                    flexDirection = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"gap"}
            {...ToastKnobs.GAP_TEXT}
        >
            <PageNumberField
                value={gap}
                min={ToastKnobs.MIN_GAP}
                max={ToastKnobs.MAX_GAP}
                width={FIELD_WIDTH}
                ariaLabel={"Gap in pixels"}
                onInput={(value) => {
                    gap = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"margin"}
            {...ToastKnobs.MARGIN_TEXT}
        >
            <PageNumberField
                value={margin}
                min={ToastKnobs.MIN_MARGIN}
                max={ToastKnobs.MAX_MARGIN}
                width={FIELD_WIDTH}
                ariaLabel={"Margin in pixels"}
                onInput={(value) => {
                    margin = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"stacking"}
            {...ToastKnobs.STACKING_TEXT}
        >
            <PageSelectField
                value={stacking}
                values={ToastKnobs.STACKINGS}
                width={FIELD_WIDTH}
                ariaLabel={"Stacking"}
                onChange={(value) => {
                    stacking = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.howManyShowOnce}
/>

<PageDocsExample path={`${DOCS_ROOT}/Limit.svelte`}>
    <LimitDocsExample limit={limit === NO_LIMIT ? undefined : limit} {overflow} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"limit"}
            {...ToastKnobs.LIMIT_TEXT}
        >
            <PageSelectField
                value={limit}
                values={ToastKnobs.LIMITS}
                width={FIELD_WIDTH}
                ariaLabel={"Limit"}
                computeLabel={(value) => (value === NO_LIMIT ? "none" : `${value}`)}
                onChange={(value) => {
                    limit = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"overflow"}
            {...ToastKnobs.OVERFLOW_TEXT}
        >
            <PageSelectField
                value={overflow}
                values={TOASTS_OVERFLOWS}
                width={FIELD_WIDTH}
                ariaLabel={"Overflow"}
                onChange={(value) => {
                    overflow = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.howLongToastStays}
/>

<PageDocsExample path={`${DOCS_ROOT}/Duration.svelte`}>
    <DurationDocsExample {durationMs} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"durationMs"}
            {...ToastKnobs.DURATION_MS_TEXT}
        >
            <PageSelectField
                value={durationMs}
                values={ToastKnobs.TIMED_DURATIONS_MS}
                width={FIELD_WIDTH}
                ariaLabel={"Duration"}
                computeLabel={(value) => `${value}ms`}
                onChange={(value) => {
                    durationMs = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.howToastArrivesLeaves}
/>

<PageDocsExample path={`${DOCS_ROOT}/Animation.svelte`}>
    <AnimationDocsExample {animation} {transitionDurationMs} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"animation"}
            {...ToastKnobs.ANIMATION_TEXT}
        >
            <PageSelectField
                value={animation}
                values={ToastKnobs.ANIMATIONS}
                width={FIELD_WIDTH}
                ariaLabel={"Animation"}
                onChange={(value) => {
                    animation = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"transitionDurationMs"}
            {...ToastKnobs.TRANSITION_DURATION_MS_TEXT}
        >
            <PageNumberField
                value={transitionDurationMs}
                min={ToastKnobs.MIN_TRANSITION_DURATION_MS}
                max={ToastKnobs.MAX_TRANSITION_DURATION_MS}
                step={ToastKnobs.TRANSITION_DURATION_STEP_MS}
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
    {...DOCS_SECTIONS.toastThatPaintsItself}
/>

<PageDocsExample path={`${DOCS_ROOT}/OwnPainter.svelte`}>
    <OwnPainterDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Raising from far down the tree"}
    content={"Any component inside the provider, however deep, gets show and dismiss from getToastsContext, with nothing passed down on the way, and where providers are nested the nearest one answers. Both say whether they acted. show answers the toast's id, made up unless you gave one, which dismiss takes to close it from anywhere; it answers undefined when it refused — a toast whose id is already queued, or any toast outside a provider, which Save outside shows. dismiss answers true or false."}
/>

<PageDocsExample path={`${DOCS_ROOT}/FarDown.svelte`}>
    <FarDownDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.queueHeldOutsidePage}
/>

<PageDocsExample path={`${DOCS_ROOT}/SharedQueue.svelte`}>
    <SharedQueueDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.rightLeft}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.anotherShortcut}
/>

<PageDocsExample path={`${DOCS_ROOT}/Hotkeys.svelte`}>
    <HotkeysDocsExample />
</PageDocsExample>
