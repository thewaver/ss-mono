import { useState } from "react";

import type { SortableOrientation } from "@thewaver/ss-components-react";
import { SORTABLE_DEFAULTS, SORTABLE_ORIENTATIONS } from "@thewaver/ss-components-react";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.const";

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
    const [orientation, setOrientation] = useState<SortableOrientation>(SORTABLE_DEFAULTS.orientation);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isBoardLocked, setIsBoardLocked] = useState(false);

    return (
        <>
            <PageDocsAlert severity={"info"}>
                Every list can be worked three ways, all built in: by dragging; by tapping a card to pick it up and
                tapping a place to put it down, so dragging is never the only way (
                <a href={WCAG_URLS["2.5.7"]}>WCAG 2.5.7</a>); and from the keyboard, where Enter picks up, the arrows
                choose a place, Tab changes list, Enter drops and Escape cancels (
                <a href={WCAG_URLS["2.1.1"]}>WCAG 2.1.1</a>). What a screen reader hears at each step is the words you
                pass in <span className={docsStyles.docsPropName}>announcements</span>.
            </PageDocsAlert>

            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"orientation"}
                            label={"Orientation"}
                            hint={
                                "Whether the cards are stacked or sit side by side. While one is carried, the up and down arrows choose its place in a stack, and the left and right arrows in a row."
                            }
                            controls={"Sets SortableProps.orientation"}
                        >
                            <PageSelectField
                                value={orientation}
                                values={SORTABLE_ORIENTATIONS}
                                ariaLabel={"Orientation"}
                                onChange={setOrientation}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"isDisabled"}
                            label={"Disabled"}
                            hint={"Turns the list off: nothing in it can be picked up or moved, by pointer or by key."}
                            controls={"Sets SortableProps.isDisabled"}
                        >
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample orientation={orientation} isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, a row of cards runs from the right, and while a card is carried the left arrow moves it on to a later place."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Between two lists"}
                content={
                    "Lists that share a [prop]groupId[/prop] trade cards: drag one across, tap it and then tap a place in the other list, or press Tab while carrying it from the keyboard. Set [prop]isLocked[/prop] on a list and it can still be reordered, but it takes nothing from outside."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Pair.tsx`}
                renderKnobs={() => (
                    <PageProp
                        itemKey={"isBoardLocked"}
                        label={"Board locked"}
                        hint={
                            "Whether the board refuses every card from the hand, while its own cards can still be reordered."
                        }
                        controls={"Sets SortableProps.isLocked on the board"}
                    >
                        <PageCheckField value={isBoardLocked} ariaLabel={"Board locked"} onChange={setIsBoardLocked} />
                    </PageProp>
                )}
            >
                <PairDocsExample isBoardLocked={isBoardLocked} />
            </PageDocsExample>

            <PageDocsSection
                title={"A list that refuses some cards"}
                content={
                    "Give a list [prop]computeCanAccept[/prop] and it decides card by card what it will take: this board takes nothing costing more than 3. A refused card is refused on every route, not only when it is dropped."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Picky.tsx`}>
                <PickyDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Reordering round a ring"}
                content={
                    "Hand [prop]computeLayout[/prop] a layout and the cards are placed by it rather than laid in a line, here round a ring. A carried card lands on the nearest place instead of being compared along one axis, since a ring has none."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Ring.tsx`}>
                <RingDocsExample />
            </PageDocsExample>
        </>
    );
};
