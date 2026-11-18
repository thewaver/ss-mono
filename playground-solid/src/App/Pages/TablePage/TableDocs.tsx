import { createSignal } from "solid-js";

import { TABLE_SELECTION_MODES } from "@thewaver/ss-components-solid";
import type { TableSelectionMode } from "@thewaver/ss-components-solid";
import { TableKnobs } from "@thewaver/ss-playground/App/Knobs/Tables.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
    STRESS_COUNT_FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.const";

import { PageDocsAlert } from "../../PageComponents/DocsAlert/DocsAlert";
import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { ConsumerSortedDocsExample } from "./Docs/ConsumerSorted";
import { ExpandableDocsExample } from "./Docs/Expandable";
import { PinnedDocsExample } from "./Docs/Pinned";
import { ReorderableDocsExample } from "./Docs/Reorderable";
import { ResizableDocsExample } from "./Docs/Resizable";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { VirtualizedDocsExample } from "./Docs/Virtualized";

export const TableDocs = () => {
    const [getSelectionMode, setSelectionMode] = createSignal<TableSelectionMode>("multiple");
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getCount, setCount] = createSignal(TableKnobs.STARTING_STRESS_COUNT);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"selectionMode"} {...TableKnobs.SELECTION_MODE_TEXT}>
                            <PageSelectField
                                value={getSelectionMode}
                                values={TABLE_SELECTION_MODES}
                                ariaLabel={"Selection"}
                                onChange={setSelectionMode}
                            />
                        </PageProp>

                        <PageProp key={"isDisabled"} {...TableKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample selectionMode={getSelectionMode} isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.resizableColumns} />

            <PageDocsExample path={`${DOCS_ROOT}/Resizable.tsx`}>
                <ResizableDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.reorderableColumns} />

            <PageDocsAlert severity={"alert"}>
                Put a TableHeaderReorder in the header of every column that can be moved. Not everyone can drag, so
                there must be a way to move a column with single taps (<a href={WCAG_URLS["2.5.7"]}>WCAG 2.5.7</a>), and
                that control is it: tap it to pick the column up, then tap the header where it should go. Without one
                the column can only be dragged, and the table warns in development.
            </PageDocsAlert>

            <PageDocsExample path={`${DOCS_ROOT}/Reorderable.tsx`}>
                <ReorderableDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.sortedPage} />

            <PageDocsExample path={`${DOCS_ROOT}/ConsumerSorted.tsx`}>
                <ConsumerSortedDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.manyRows} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Virtualized.tsx`}
                renderKnobs={() => (
                    <PageProp key={"count"} {...TableKnobs.COUNT_TEXT}>
                        <PageNumberField
                            value={getCount}
                            min={TableKnobs.MIN_STRESS_COUNT}
                            max={TableKnobs.MAX_STRESS_COUNT}
                            step={TableKnobs.STRESS_COUNT_STEP}
                            width={STRESS_COUNT_FIELD_WIDTH}
                            ariaLabel={"Row count"}
                            onInput={setCount}
                        />
                    </PageProp>
                )}
            >
                <VirtualizedDocsExample count={getCount} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.pinnedColumns} />

            <PageDocsExample path={`${DOCS_ROOT}/Pinned.tsx`}>
                <PinnedDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.expandableRows} />

            <PageDocsExample path={`${DOCS_ROOT}/Expandable.tsx`}>
                <ExpandableDocsExample />
            </PageDocsExample>
        </>
    );
};
