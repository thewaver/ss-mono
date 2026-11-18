import { createSignal } from "solid-js";

import type { SortableOrientation } from "@thewaver/ss-components-solid";
import { SORTABLE_DEFAULTS, SORTABLE_ORIENTATIONS } from "@thewaver/ss-components-solid";
import { SortableKnobs } from "@thewaver/ss-playground/App/Knobs/Sortables.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.const";

import { PageDocsAlert } from "../../PageComponents/DocsAlert/DocsAlert";
import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { PairDocsExample } from "./Docs/Pair";
import { PickyDocsExample } from "./Docs/Picky";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { RingDocsExample } from "./Docs/Ring";

export const SortableDocs = () => {
    const [getOrientation, setOrientation] = createSignal<SortableOrientation>(SORTABLE_DEFAULTS.orientation);
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getIsBoardLocked, setIsBoardLocked] = createSignal(false);

    return (
        <>
            <PageDocsAlert severity={"info"}>
                Every list can be worked three ways, all built in: by dragging; by tapping a card to pick it up and
                tapping a place to put it down, so dragging is never the only way (
                <a href={WCAG_URLS["2.5.7"]}>WCAG 2.5.7</a>); and from the keyboard, where Enter picks up, the arrows
                choose a place, Tab changes list, Enter drops and Escape cancels (
                <a href={WCAG_URLS["2.1.1"]}>WCAG 2.1.1</a>). What a screen reader hears at each step is the words you
                pass in <span class={docsStyles.docsPropName}>announcements</span>.
            </PageDocsAlert>

            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"orientation"} {...SortableKnobs.ORIENTATION_TEXT}>
                            <PageSelectField
                                value={getOrientation}
                                values={SORTABLE_ORIENTATIONS}
                                ariaLabel={"Orientation"}
                                onChange={(orientation) => setOrientation(() => orientation)}
                            />
                        </PageProp>

                        <PageProp key={"isDisabled"} {...SortableKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample orientation={getOrientation} isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.betweenTwoLists} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Pair.tsx`}
                renderKnobs={() => (
                    <PageProp key={"isBoardLocked"} {...SortableKnobs.IS_BOARD_LOCKED_TEXT}>
                        <PageCheckField
                            value={getIsBoardLocked}
                            ariaLabel={"Board locked"}
                            onChange={setIsBoardLocked}
                        />
                    </PageProp>
                )}
            >
                <PairDocsExample isBoardLocked={getIsBoardLocked} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.listRefusingSomeCards} />

            <PageDocsExample path={`${DOCS_ROOT}/Picky.tsx`}>
                <PickyDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.reorderingRoundRing} />

            <PageDocsExample path={`${DOCS_ROOT}/Ring.tsx`}>
                <RingDocsExample />
            </PageDocsExample>
        </>
    );
};
