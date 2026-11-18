import { createSignal } from "solid-js";

import { SCROLLER_DEFAULTS, SCROLLER_OVERFLOWS, ScrollerUtils } from "@thewaver/ss-components-solid";
import type { ScrollerOverflow, ScrollerProgress } from "@thewaver/ss-components-solid";
import { ScrollerKnobs } from "@thewaver/ss-playground/App/Knobs/Scrollers.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import { DOCS_ROOT, DOCS_SECTIONS, PERCENT } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";

import { PageDocsAlert } from "../../PageComponents/DocsAlert/DocsAlert";
import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { ArchedDocsExample } from "./Docs/Arched";
import { BasicDocsExample } from "./Docs/Basic";
import { BothWaysDocsExample } from "./Docs/BothWays";
import { ColumnDocsExample } from "./Docs/Column";
import { DrivenDocsExample } from "./Docs/Driven";
import { FadingDocsExample } from "./Docs/Fading";
import { FocusableChildrenDocsExample } from "./Docs/FocusableChildren";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { ShortTrackDocsExample } from "./Docs/ShortTrack";
import { TabbedDocsExample } from "./Docs/Tabbed";

export const ScrollerDocs = () => {
    const [getItemCount, setItemCount] = createSignal(ScrollerKnobs.STARTING_ITEM_COUNT);
    const [getOverlapCount, setOverlapCount] = createSignal(SCROLLER_DEFAULTS.overlapCount);
    const progressSignal = createSignal<ScrollerProgress>(ScrollerUtils.NO_PROGRESS);
    const [getOverflowX, setOverflowX] = createSignal<ScrollerOverflow>("auto");
    const [getOverflowY, setOverflowY] = createSignal<ScrollerOverflow>("auto");
    const [getIsAutoHiding, setIsAutoHiding] = createSignal(true);
    const [getIsBarOverlaid, setIsBarOverlaid] = createSignal(true);
    const [getHideDelayMs, setHideDelayMs] = createSignal(SCROLLER_DEFAULTS.hideDelayMs);

    return (
        <>
            <PageDocsAlert severity={"alert"}>
                The scroller draws no buttons: build them on the controller{" "}
                <span class={docsStyles.docsPropName}>onMount</span> hands you, wherever the page wants them. Without
                them, a keyboard scrolls the strip only by moving focus, which reaches each focusable item, or the box
                itself when nothing in it takes focus, but not plain content lying beyond the last focusable item (
                <a href={WCAG_URLS["2.1.1"]}>WCAG 2.1.1</a>). Name each button by the way it scrolls, or a screen reader
                announces a button with no name (<a href={WCAG_URLS["4.1.2"]}>WCAG 4.1.2</a>), and point it at the box
                with aria-controls, using the id <span class={docsStyles.docsPropName}>getBoxId</span> hands back.
            </PageDocsAlert>

            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"itemCount"} {...ScrollerKnobs.ITEM_COUNT_TEXT}>
                            <PageNumberField
                                value={getItemCount}
                                min={ScrollerKnobs.MIN_ITEM_COUNT}
                                max={ScrollerKnobs.MAX_ITEM_COUNT}
                                step={ScrollerKnobs.ITEM_COUNT_STEP}
                                ariaLabel={"Item count"}
                                onInput={setItemCount}
                            />
                        </PageProp>

                        <PageProp key={"overlapCount"} {...ScrollerKnobs.OVERLAP_COUNT_TEXT}>
                            <PageNumberField
                                value={getOverlapCount}
                                min={ScrollerKnobs.MIN_OVERLAP_COUNT}
                                max={ScrollerKnobs.MAX_OVERLAP_COUNT}
                                step={ScrollerKnobs.OVERLAP_COUNT_STEP}
                                ariaLabel={"Overlap count"}
                                onInput={setOverlapCount}
                            />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample itemCount={getItemCount} overlapCount={getOverlapCount} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.focusRevealsTarget} />

            <PageDocsExample path={`${DOCS_ROOT}/Tabbed.tsx`}>
                <TabbedDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.focusableChildrenAnyKind} />

            <PageDocsExample path={`${DOCS_ROOT}/FocusableChildren.tsx`}>
                <FocusableChildrenDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.drivenOutside} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Driven.tsx`}
                renderKnobs={() => (
                    <PageProp key={"position"} {...ScrollerKnobs.POSITION_TEXT}>
                        <PageNumberField
                            value={() => Math.round(progressSignal[0]().x * PERCENT)}
                            min={ScrollerKnobs.MIN_POSITION}
                            max={PERCENT}
                            step={ScrollerKnobs.POSITION_STEP}
                            ariaLabel={"Position in percent"}
                            onInput={(value) => progressSignal[1]((current) => ({ ...current, x: value / PERCENT }))}
                        />
                    </PageProp>
                )}
            >
                <DrivenDocsExample progress={progressSignal} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.shortTrackBetweenButtons} />

            <PageDocsAlert severity={"alert"}>
                A drawn bar is a target people press and drag, and unlike the browser's own it is not exempt from{" "}
                <a href={WCAG_URLS["2.5.8"]}>WCAG 2.5.8</a>, which asks for 24 by 24 CSS pixels. The library keeps the
                thumb at least 24 pixels long; how thick the bar is, is your painter's call. A thinner bar passes only
                with room around it, or with step buttons of the full size on the page doing the same job, and nothing
                warns about it.
            </PageDocsAlert>

            <PageDocsExample path={`${DOCS_ROOT}/ShortTrack.tsx`}>
                <ShortTrackDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.archedBar} />

            <PageDocsExample path={`${DOCS_ROOT}/Arched.tsx`}>
                <ArchedDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.columnScrollingDown} />

            <PageDocsExample path={`${DOCS_ROOT}/Column.tsx`}>
                <ColumnDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.boxScrollingBothWays} />

            <PageDocsExample
                path={`${DOCS_ROOT}/BothWays.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"overflowX"}
                            label={ScrollerKnobs.OVERFLOW_X.label}
                            hint={ScrollerKnobs.OVERFLOW_X.hint}
                            controls={"Sets ScrollerProps.overflowX"}
                        >
                            <PageSelectField
                                value={getOverflowX}
                                values={SCROLLER_OVERFLOWS}
                                ariaLabel={ScrollerKnobs.OVERFLOW_X.label}
                                onChange={setOverflowX}
                            />
                        </PageProp>

                        <PageProp
                            key={"overflowY"}
                            label={ScrollerKnobs.OVERFLOW_Y.label}
                            hint={ScrollerKnobs.OVERFLOW_Y.hint}
                            controls={"Sets ScrollerProps.overflowY"}
                        >
                            <PageSelectField
                                value={getOverflowY}
                                values={SCROLLER_OVERFLOWS}
                                ariaLabel={ScrollerKnobs.OVERFLOW_Y.label}
                                onChange={setOverflowY}
                            />
                        </PageProp>
                    </>
                )}
            >
                <BothWaysDocsExample overflowX={getOverflowX} overflowY={getOverflowY} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.barThatFades} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Fading.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"isAutoHiding"}
                            label={ScrollerKnobs.IS_AUTO_HIDING.label}
                            hint={ScrollerKnobs.IS_AUTO_HIDING.hint}
                            controls={"Sets ScrollerProps.isAutoHiding"}
                        >
                            <PageCheckField
                                value={getIsAutoHiding}
                                ariaLabel={ScrollerKnobs.IS_AUTO_HIDING.label}
                                onChange={setIsAutoHiding}
                            />
                        </PageProp>

                        <PageProp
                            key={"isBarOverlaid"}
                            label={ScrollerKnobs.IS_BAR_OVERLAID.label}
                            hint={ScrollerKnobs.IS_BAR_OVERLAID.hint}
                            controls={"Sets ScrollerProps.isBarOverlaid"}
                        >
                            <PageCheckField
                                value={getIsBarOverlaid}
                                ariaLabel={ScrollerKnobs.IS_BAR_OVERLAID.label}
                                onChange={setIsBarOverlaid}
                            />
                        </PageProp>

                        <PageProp
                            key={"hideDelayMs"}
                            label={ScrollerKnobs.HIDE_DELAY_MS.label}
                            hint={ScrollerKnobs.HIDE_DELAY_MS.hint}
                            controls={"Sets ScrollerProps.hideDelayMs"}
                        >
                            <PageNumberField
                                value={getHideDelayMs}
                                min={ScrollerKnobs.HIDE_DELAY_MS.min}
                                max={ScrollerKnobs.HIDE_DELAY_MS.max}
                                step={ScrollerKnobs.HIDE_DELAY_MS.step}
                                ariaLabel={ScrollerKnobs.HIDE_DELAY_MS.label}
                                onInput={setHideDelayMs}
                            />
                        </PageProp>
                    </>
                )}
            >
                <FadingDocsExample
                    isAutoHiding={getIsAutoHiding}
                    isBarOverlaid={getIsBarOverlaid}
                    hideDelayMs={getHideDelayMs}
                />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>
        </>
    );
};
