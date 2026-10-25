import { createSignal } from "solid-js";

import { TABLE_SELECTION_MODES } from "@thewaver/ss-components-solid";
import type { TableSelectionMode } from "@thewaver/ss-components-solid";
import { TableKnobs } from "@thewaver/ss-playground/App/Knobs/Tables.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import { DOCS_ROOT, STRESS_COUNT_FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.const";

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
                        <PageProp
                            key={"selectionMode"}
                            label={"Selection"}
                            hint={
                                "Whether rows can be picked: not at all, one at a time, so picking a second drops the first, or several at once."
                            }
                            controls={"Sets TableProps.selectionMode"}
                        >
                            <PageSelectField
                                value={getSelectionMode}
                                values={TABLE_SELECTION_MODES}
                                ariaLabel={"Selection"}
                                onChange={setSelectionMode}
                            />
                        </PageProp>

                        <PageProp
                            key={"isDisabled"}
                            label={"Disabled"}
                            hint={
                                "Turns the table off: nothing sorts or selects, and every cell still reads out to a screen reader."
                            }
                            controls={"Sets TableProps.isDisabled"}
                        >
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample selectionMode={getSelectionMode} isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection
                title={"Resizable columns"}
                content={
                    "Hand the table [prop]widths[/prop], mark a column [prop]isResizable[/prop] and draw its grab handle through [prop]renderResizer[/prop], and the column can be resized. Drag the handle on its trailing edge, press the handle without dragging to step the width by [prop]resizeStepPx[/prop] toward the side pressed, or focus the header and hold Control with the left or right arrow. Each column stays between its [prop]minWidthPx[/prop] and [prop]maxWidthPx[/prop]."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Resizable.tsx`}>
                <ResizableDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Reorderable columns"}
                content={
                    "Hand the table [prop]order[/prop], the column ids in the order shown, and mark a column [prop]isReorderable[/prop], and its header can be moved: drag it sideways, tap its grip and then the header where it should go, or focus it and hold Shift with the left or right arrow to move it one place straight away. Escape puts a picked-up column back. Every move is spoken in the words of [prop]announcements[/prop], and [prop]renderMarker[/prop] draws where a carried column would land."
                }
            />

            <PageDocsAlert severity={"alert"}>
                Put a TableHeaderReorder in the header of every column that can be moved. Not everyone can drag, so
                there must be a way to move a column with single taps (<a href={WCAG_URLS["2.5.7"]}>WCAG 2.5.7</a>), and
                that control is it: tap it to pick the column up, then tap the header where it should go. Without one
                the column can only be dragged, and the table warns in development.
            </PageDocsAlert>

            <PageDocsExample path={`${DOCS_ROOT}/Reorderable.tsx`}>
                <ReorderableDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the columns run from the right, each column's grab handle sits on its left edge, and the left and right arrows swap, so Control with the left arrow widens the focused column."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Sorted by the page"}
                content={
                    "A sortable column with no [prop]compare[/prop] only reports the sort: the table writes [prop]sort[/prop] and calls [prop]onSortChange[/prop], and leaves the rows as they are. That is the case for rows sorted on a server, or by rules only your code knows. Here the page sorts them itself and hands the table the new order, and the Category column cannot be sorted at all."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/ConsumerSorted.tsx`}>
                <ConsumerSortedDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Many rows"}
                content={
                    "Give it an estimated row height through [prop]computeEstimatedRowHeight[/prop] and only the rows in view are built, however many the table holds. The box you put the table in is the one that scrolls, and the header stays at its top. Every row still says which row it is and how many there are, so a screen reader counts the whole table although most of it is not on the page."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Virtualized.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"count"}
                        label={"Row count"}
                        hint={"How many rows the table holds. Only the ones in view are built."}
                        controls={"Sets the number of example rows sent to TableProps.rows"}
                    >
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

            <PageDocsSection
                title={"Pinned columns"}
                content={
                    "A column with [prop]pin[/prop] set to start or end stays at that edge while the others scroll sideways under it. It needs [prop]widthPx[/prop], since where it is held is the sum of the widths of the pinned columns before it. Pinned columns gather at their edge whatever the order says, and can only be moved among themselves. Here SKU is held at the start and Price at the end: scroll sideways, or widen SKU and watch the other columns slide under it."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Pinned.tsx`}>
                <PinnedDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Expandable rows"}
                content={
                    "Give it [prop]renderDetail[/prop] and a row can open a detail beneath it, as wide as the row. Put a TableRowExpander in one of the row's cells for the pointer; from the keyboard, Enter on a row's first cell opens and closes it, and the down arrow walks into an open detail. Which rows can open is up to [prop]computeIsExpandable[/prop]: here a part out of stock has nothing to show. A screen reader then hears the table as a tree grid, whose rows say whether they are open."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Expandable.tsx`}>
                <ExpandableDocsExample />
            </PageDocsExample>
        </>
    );
};
