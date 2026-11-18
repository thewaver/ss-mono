import { createSignal } from "solid-js";

import type { ToastsAlignment, ToastsFlexDirection, ToastsOverflow } from "@thewaver/ss-components-solid";
import {
    TOASTS_ALIGNMENTS,
    TOASTS_DEFAULTS,
    TOASTS_FLEX_DIRECTIONS,
    TOASTS_OVERFLOWS,
} from "@thewaver/ss-components-solid";
import { ToastKnobs } from "@thewaver/ss-playground/App/Knobs/Toasts.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
    FIELD_WIDTH,
    NO_LIMIT,
} from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";

import { PageDocsAlert } from "../../PageComponents/DocsAlert/DocsAlert";
import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import type { ToastAnimation, ToastStacking } from "../../StyledComponents/ToastContent/ToastContentSolid.types";
import { AnimationDocsExample } from "./Docs/Animation";
import { BasicDocsExample } from "./Docs/Basic";
import { DurationDocsExample } from "./Docs/Duration";
import { FarDownDocsExample } from "./Docs/FarDown";
import { HotkeysDocsExample } from "./Docs/Hotkeys";
import { LimitDocsExample } from "./Docs/Limit";
import { OwnPainterDocsExample } from "./Docs/OwnPainter";
import { PlacementDocsExample } from "./Docs/Placement";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { SharedQueueDocsExample } from "./Docs/SharedQueue";

export const ToastsDocs = () => {
    const [getAlignment, setAlignment] = createSignal<ToastsAlignment>(ToastKnobs.STARTING_PLACEMENT_ALIGNMENT);
    const [getFlexDirection, setFlexDirection] = createSignal<ToastsFlexDirection>(TOASTS_DEFAULTS.flexDirection);
    const [getGap, setGap] = createSignal(TOASTS_DEFAULTS.gap);
    const [getMargin, setMargin] = createSignal(ToastKnobs.STARTING_MARGIN);
    const [getStacking, setStacking] = createSignal<ToastStacking>(ToastKnobs.STARTING_STACKING);
    const [getLimit, setLimit] = createSignal(ToastKnobs.STARTING_LIMIT);
    const [getOverflow, setOverflow] = createSignal<ToastsOverflow>(TOASTS_DEFAULTS.overflow);
    const [getDurationMs, setDurationMs] = createSignal(ToastKnobs.STARTING_DURATION_MS);
    const [getAnimation, setAnimation] = createSignal<ToastAnimation>(ToastKnobs.STARTING_ANIMATION);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(TOASTS_DEFAULTS.transitionDurationMs);

    return (
        <>
            <PageDocsExample path={`${DOCS_ROOT}/Basic.tsx`}>
                <BasicDocsExample />
            </PageDocsExample>

            <PageDocsAlert severity={"alert"}>
                A toast can be swiped off the edge its stack sits against. Paint a control that closes it, as Close does
                here, in every toast that can be swiped, or a reader who cannot drag has no way to dismiss it (
                <a href={WCAG_URLS["2.5.7"]}>WCAG 2.5.7</a>). The library draws no control of its own.
            </PageDocsAlert>

            <PageDocsAlert severity={"alert"}>
                Nothing can tab to a stack, since it is drawn at the end of the document, so F8 is the keyboard's way
                in: it moves focus to each stack holding toasts in turn, Shift+F8 goes back, and Escape hands focus back
                to where it was. One shortcut reaches every stack on the page, so a keyboard user can always get to a
                toast's controls (<a href={WCAG_URLS["2.1.1"]}>WCAG 2.1.1</a>). Raise toasts in two of the examples
                below and press F8 twice to try it. A page that needs F8 for itself can change the keys or switch them
                off, as the last example shows.
            </PageDocsAlert>

            <PageDocsSection {...DOCS_SECTIONS.whereStackSitsHow} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Placement.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"alignment"} {...ToastKnobs.ALIGNMENT_TEXT}>
                            <PageSelectField
                                value={getAlignment}
                                values={TOASTS_ALIGNMENTS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Alignment"}
                                onChange={(alignment) => setAlignment(() => alignment)}
                            />
                        </PageProp>

                        <PageProp key={"flexDirection"} {...ToastKnobs.FLEX_DIRECTION_TEXT}>
                            <PageSelectField
                                value={getFlexDirection}
                                values={TOASTS_FLEX_DIRECTIONS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Flex direction"}
                                onChange={(flexDirection) => setFlexDirection(() => flexDirection)}
                            />
                        </PageProp>

                        <PageProp key={"gap"} {...ToastKnobs.GAP_TEXT}>
                            <PageNumberField
                                value={getGap}
                                min={ToastKnobs.MIN_GAP}
                                max={ToastKnobs.MAX_GAP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Gap in pixels"}
                                onInput={setGap}
                            />
                        </PageProp>

                        <PageProp key={"margin"} {...ToastKnobs.MARGIN_TEXT}>
                            <PageNumberField
                                value={getMargin}
                                min={ToastKnobs.MIN_MARGIN}
                                max={ToastKnobs.MAX_MARGIN}
                                width={FIELD_WIDTH}
                                ariaLabel={"Margin in pixels"}
                                onInput={setMargin}
                            />
                        </PageProp>

                        <PageProp key={"stacking"} {...ToastKnobs.STACKING_TEXT}>
                            <PageSelectField
                                value={getStacking}
                                values={ToastKnobs.STACKINGS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Stacking"}
                                onChange={(stacking) => setStacking(() => stacking)}
                            />
                        </PageProp>
                    </>
                )}
            >
                <PlacementDocsExample
                    alignment={getAlignment}
                    flexDirection={getFlexDirection}
                    gap={getGap}
                    margin={getMargin}
                    stacking={getStacking}
                />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.howManyShowOnce} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Limit.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"limit"} {...ToastKnobs.LIMIT_TEXT}>
                            <PageSelectField
                                value={getLimit}
                                values={ToastKnobs.LIMITS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Limit"}
                                computeLabel={(limit) => (limit === NO_LIMIT ? "none" : `${limit}`)}
                                onChange={setLimit}
                            />
                        </PageProp>

                        <PageProp key={"overflow"} {...ToastKnobs.OVERFLOW_TEXT}>
                            <PageSelectField
                                value={getOverflow}
                                values={TOASTS_OVERFLOWS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Overflow"}
                                onChange={(overflow) => setOverflow(() => overflow)}
                            />
                        </PageProp>
                    </>
                )}
            >
                <LimitDocsExample
                    limit={() => (getLimit() === NO_LIMIT ? undefined : getLimit())}
                    overflow={getOverflow}
                />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.howLongToastStays} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Duration.tsx`}
                renderKnobs={() => (
                    <PageProp key={"durationMs"} {...ToastKnobs.DURATION_MS_TEXT}>
                        <PageSelectField
                            value={getDurationMs}
                            values={ToastKnobs.TIMED_DURATIONS_MS}
                            width={FIELD_WIDTH}
                            ariaLabel={"Duration"}
                            computeLabel={(durationMs) => `${durationMs}ms`}
                            onChange={setDurationMs}
                        />
                    </PageProp>
                )}
            >
                <DurationDocsExample durationMs={getDurationMs} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.howToastArrivesLeaves} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Animation.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"animation"} {...ToastKnobs.ANIMATION_TEXT}>
                            <PageSelectField
                                value={getAnimation}
                                values={ToastKnobs.ANIMATIONS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Animation"}
                                onChange={(animation) => setAnimation(() => animation)}
                            />
                        </PageProp>

                        <PageProp key={"transitionDurationMs"} {...ToastKnobs.TRANSITION_DURATION_MS_TEXT}>
                            <PageNumberField
                                value={getTransitionDurationMs}
                                min={ToastKnobs.MIN_TRANSITION_DURATION_MS}
                                max={ToastKnobs.MAX_TRANSITION_DURATION_MS}
                                step={ToastKnobs.TRANSITION_DURATION_STEP_MS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Transition duration in milliseconds"}
                                onInput={setTransitionDurationMs}
                            />
                        </PageProp>
                    </>
                )}
            >
                <AnimationDocsExample animation={getAnimation} transitionDurationMs={getTransitionDurationMs} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.toastThatPaintsItself} />

            <PageDocsExample path={`${DOCS_ROOT}/OwnPainter.tsx`}>
                <OwnPainterDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Raising from far down the tree"}
                content={
                    "Any component inside the provider, however deep, gets show and dismiss from useToastsContext, with nothing passed down on the way, and where providers are nested the nearest one answers. Both say whether they acted. show answers the toast's id, made up unless you gave one, which dismiss takes to close it from anywhere; it answers undefined when it refused — a toast whose id is already queued, or any toast outside a provider, which Save outside shows. dismiss answers true or false."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/FarDown.tsx`}>
                <FarDownDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.queueHeldOutsidePage} />

            <PageDocsExample path={`${DOCS_ROOT}/SharedQueue.tsx`}>
                <SharedQueueDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.anotherShortcut} />

            <PageDocsExample path={`${DOCS_ROOT}/Hotkeys.tsx`}>
                <HotkeysDocsExample />
            </PageDocsExample>
        </>
    );
};
