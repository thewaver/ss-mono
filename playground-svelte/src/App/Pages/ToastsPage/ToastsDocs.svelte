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
    import { DOCS_ROOT, FIELD_WIDTH, NO_LIMIT } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";

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
    >). Raise toasts in two of the examples below and press F8 twice to try it.
</PageDocsAlert>

<PageDocsSection
    title={"Where the stack sits and how it grows"}
    content={"Set [prop]alignment[/prop] to put the stack at one of nine places on the screen, and [prop]flexDirection[/prop] for the way it grows from there: down a column or along a row, with new toasts joining at the far end or, reversed, at the near one, while the stack stays where it was put. The [prop]gap[/prop] spaces the toasts and the [prop]margins[/prop] hold the stack off the edges. Two providers at one alignment draw their stacks over each other, and the second warns in the console; every example on this page has a place of its own, so moving this one onto another's shows it. Piling the toasts on each other is the painter's work: each is handed its place in the stack and the measured size of every toast, and this one offsets and shrinks itself from them."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Placement.svelte`}>
    <PlacementDocsExample {alignment} {flexDirection} {gap} {margin} {stacking} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"alignment"}
            label={"Alignment"}
            hint={"Which corner or edge of the screen the toasts gather at."}
            controls={"Sets ToastsProps.alignment"}
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
            label={"Flex direction"}
            hint={"Which way the stack grows from there, and so whether a new toast joins at the near end or the far one."}
            controls={"Sets ToastsProps.flexDirection"}
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
            label={"Gap (px)"}
            hint={"The space between one toast and the next."}
            controls={"Sets ToastsProps.gap"}
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
            label={"Margin (px)"}
            hint={"How far the stack is held off the edges of the screen."}
            controls={"Sets every side of ToastsProps.margins"}
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
            label={"Stacking"}
            hint={"Whether the toasts sit in a row of their own, or pile up on each other with only the newest fully shown."}
            controls={"Picks how the example painter places each toast"}
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
    title={"How many show at once"}
    content={"Give [prop]limit[/prop] a number and only that many toasts are on screen. What happens to the rest is the [prop]overflow[/prop]: under dismiss_oldest the oldest are taken out of the queue so the newest show, and under hold_newest the newest wait in the queue and come on as places free, running no clock while they wait. The readout counts the queue, which this example holds itself through [prop]toasts[/prop]."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Limit.svelte`}>
    <LimitDocsExample limit={limit === NO_LIMIT ? undefined : limit} {overflow} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"limit"}
            label={"Limit"}
            hint={"How many toasts may be on screen at once. Choose none and they all show."}
            controls={"Sets ToastsProps.limit, with no limit sent as undefined"}
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
            label={"Overflow"}
            hint={"What happens once the limit is reached: the oldest toast is dismissed, or the newest waits its turn."}
            controls={"Sets ToastsProps.overflow"}
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
    title={"How long a toast stays"}
    content={"A toast given a [prop]durationMs[/prop] dismisses itself once that time has passed, and one without waits to be dismissed. Hovering or focusing the stack holds every countdown, and so does switching to another tab; a held toast gets the rest of its time back, not a fresh start. Each toast's [prop]onShow[/prop] and [prop]onHide[/prop] run as it starts to arrive and to leave, which the readout counts."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Duration.svelte`}>
    <DurationDocsExample {durationMs} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"durationMs"}
            label={"Duration"}
            hint={"How long a Timed toast stays before it dismisses itself. Sticky ones wait to be closed."}
            controls={"Sets Toast.durationMs on each Timed toast raised"}
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
    title={"How a toast arrives and leaves"}
    content={"The painter draws the arrival and the exit. It is handed whether its toast is arriving or leaving and how long [prop]transitionDurationMs[/prop] gives it, and the provider keeps a leaving toast on screen until that time is up, so the exit plays out. This painter zooms, slides or fades."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Animation.svelte`}>
    <AnimationDocsExample {animation} {transitionDurationMs} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"animation"}
            label={"Animation"}
            hint={"How a toast arrives and leaves."}
            controls={"Picks how the example painter draws the arrival and the exit"}
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
            label={"Transition duration (ms)"}
            hint={"How long a toast takes to arrive, to leave, and to slide when the stack shifts."}
            controls={"Sets ToastsProps.transitionDurationMs"}
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
    title={"A toast that paints itself"}
    content={"Every toast that brings no painter is drawn by the provider's [prop]renderToast[/prop], and one that brings its own [prop]renderToast[/prop] is drawn by that instead, so a toast raised anywhere can look and behave unlike its neighbors. The provider's painter is handed a dismiss for the toast it draws, and a toast's own painter closes it with the dismiss it was raised with. Here Save raises an ordinary toast, and Delete draft raises one that slides in and carries an Undo button wired to the code that raised it. A toast's painter is read once, when it arrives."}
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
    title={"A queue held outside the page"}
    content={"Hand the provider a queue of your own as [prop]toasts[/prop], bound both ways, and it is yours: code outside any component can raise a toast by writing to it, as the sync here does, and the page can read it, as the count does. The provider still writes to it, taking out a toast whose time is up, one swiped away, and any past the limit."}
/>

<PageDocsExample path={`${DOCS_ROOT}/SharedQueue.svelte`}>
    <SharedQueueDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Right to left"}
    content={"Each toast reads in the direction of whatever raised it: the element focused when show was called, or the page when nothing was. Publish sits in a right-to-left box, so its toast reads right to left with nothing set in the painter, even though the stack is drawn at the end of the document, outside the box. The [prop]alignment[/prop] names a side of the screen, not of the text, so middle_left stays on the left."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>
