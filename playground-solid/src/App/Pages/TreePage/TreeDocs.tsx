import { createSignal } from "solid-js";

import { TreeKnobs } from "@thewaver/ss-playground/App/Knobs/Trees.const";
import type { TreeFalloff } from "@thewaver/ss-playground/App/Pages/TreePage/TreeFalloffs.types";
import { DOCS_ROOT, STRESS_COUNT_FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { CheckboxesDocsExample } from "./Docs/Checkboxes";
import { ControlledDocsExample } from "./Docs/Controlled";
import { DisabledDocsExample } from "./Docs/Disabled";
import { LeaningDocsExample } from "./Docs/Leaning";
import { LinksDocsExample } from "./Docs/Links";
import { OnDemandDocsExample } from "./Docs/OnDemand";
import { RadialDocsExample } from "./Docs/Radial";
import { RecordsDocsExample } from "./Docs/Records";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { VirtualizedDocsExample } from "./Docs/Virtualized";

export const TreeDocs = () => {
    const [getIsReachable, setIsReachable] = createSignal(false);
    const [getHasLinkComponent, setHasLinkComponent] = createSignal(false);
    const [getCount, setCount] = createSignal(TreeKnobs.STARTING_STRESS_COUNT);
    const [getFalloff, setFalloff] = createSignal<TreeFalloff>(TreeKnobs.STARTING_FALLOFF);

    return (
        <>
            <PageDocsExample path={`${DOCS_ROOT}/Basic.tsx`}>
                <BasicDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the rows are indented from the right and the arrows swap: the left arrow opens a branch and then steps into it, and the right arrow closes it or climbs to the parent."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Opening and closing from outside"}
                content={
                    "The tree keeps track of which branches are open by itself. To open or close them from elsewhere on the page, hold the list of open values and pass it in as [prop]expanded[/prop]: both sides write it, so opening a branch updates your list and writing your list opens or closes branches. The selected node can be held the same way, through [prop]value[/prop]. If a branch closes from outside while focus is on a row inside it, focus moves to the branch rather than being lost: press the delayed button, then focus a row inside Lib before it closes."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Controlled.tsx`}>
                <ControlledDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Disabled nodes"}
                content={
                    "A node can be disabled: the arrow keys skip it, and nothing selects or opens it. What is inside an open disabled branch is not disabled with it, so those rows stay reachable. Kept reachable when disabled, the arrow keys stop on the node instead, so a tooltip can say why it is off."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Disabled.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"isReachable"}
                        label={"Reachable when disabled"}
                        hint={"Lets the arrow keys stop on the disabled nodes, which then show a tooltip."}
                        controls={"Sets TreeNode.isReachableWhenDisabled on the disabled nodes"}
                    >
                        <PageCheckField
                            value={getIsReachable}
                            ariaLabel={"Reachable when disabled"}
                            onChange={setIsReachable}
                        />
                    </PageProp>
                )}
            >
                <DisabledDocsExample isReachable={getIsReachable} />
            </PageDocsExample>

            <PageDocsSection
                title={"Links"}
                content={
                    "Give a node an [prop]href[/prop] and it is drawn as a native HTML anchor element, so it can be opened in a new tab or copied as a link, and both Enter and Space follow it. In a routed app, pass [prop]linkComponent[/prop], a custom link component such as your router's, and the linking nodes are drawn with it instead."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Links.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"hasLinkComponent"}
                        label={"Custom link component"}
                        hint={
                            "Draws the linking nodes with a custom link component, as a router's link would be. Off, they use the native HTML anchor element."
                        }
                        controls={"Sets TreeProps.linkComponent"}
                    >
                        <PageCheckField
                            value={getHasLinkComponent}
                            ariaLabel={"Custom link component"}
                            onChange={setHasLinkComponent}
                        />
                    </PageProp>
                )}
            >
                <LinksDocsExample hasLinkComponent={getHasLinkComponent} />
            </PageDocsExample>

            <PageDocsSection
                title={"Records as values"}
                content={
                    "A node's value can be any record, not only a string. Here each asset is an object, the painter draws whichever of its parts you choose, and the line under the tree shows the record that is selected."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Records.tsx`}>
                <RecordsDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Ticking several"}
                content={
                    "MultiTree ticks nodes rather than selecting one. Ticking a folder ticks everything inside it, and a folder with only some of its contents ticked shows as partly ticked. Here the painter puts the expander ref that [prop]renderNode[/prop] hands it on each folder's arrow, so pressing the arrow opens the folder and pressing its name ticks it; without that ref, one press does both. Space ticks the focused node, Shift with an arrow moves and ticks, Shift with Space ticks a run from the last node ticked, and Control with A ticks everything, or clears it all when everything already is."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Checkboxes.tsx`}>
                <CheckboxesDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Branches that arrive later"}
                content={
                    "Set [prop]hasMoreChildren[/prop] on a node whose children are still to come, and it is drawn as a branch before it has any. Opening it writes it into [prop]expanded[/prop], which is your cue to fetch them. Until they arrive the branch tells screen readers it is busy, and [prop]renderPendingChildren[/prop] draws what stands in for them."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/OnDemand.tsx`}>
                <OnDemandDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Many nodes"}
                content={
                    "Give it an estimated node height through [prop]computeEstimatedNodeHeight[/prop] and only the rows in view are built, however many nodes the tree holds. Here the tree sits in a box that scrolls, and an asterisk opens every branch beside the focused one."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Virtualized.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"count"}
                        label={"Node count"}
                        hint={
                            "How many nodes the tree holds, in folders of fifty files. Only the rows in view are built."
                        }
                        controls={"Sets the number of example nodes sent to TreeProps.nodes"}
                    >
                        <PageNumberField
                            value={getCount}
                            min={TreeKnobs.MIN_STRESS_COUNT}
                            max={TreeKnobs.MAX_STRESS_COUNT}
                            step={TreeKnobs.STRESS_COUNT_STEP}
                            width={STRESS_COUNT_FIELD_WIDTH}
                            ariaLabel={"Node count"}
                            onInput={setCount}
                        />
                    </PageProp>
                )}
            >
                <VirtualizedDocsExample count={getCount} />
            </PageDocsExample>

            <PageDocsSection
                title={"Leaning toward the pointer"}
                content={
                    "Give it a layout through [prop]computeLayout[/prop] and an effect through [prop]computeEffect[/prop], and each node can answer how near the pointer is. Here the nodes sit in a column, and each shifts and brightens as the pointer nears it. The effect is not told which node is selected, so the painter keeps that one lit."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Leaning.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"falloff"}
                        label={"Falloff"}
                        hint={
                            "How the lean fades with distance from the pointer: smoothly, in a straight line, or sharply, so only the nearest nodes move."
                        }
                        controls={
                            "Picks how fast the example effect sent to TreeProps.computeEffect fades with distance"
                        }
                    >
                        <PageSelectField
                            value={getFalloff}
                            values={TreeKnobs.FALLOFFS}
                            ariaLabel={"Falloff"}
                            onChange={(falloff) => setFalloff(() => falloff)}
                        />
                    </PageProp>
                )}
            >
                <LeaningDocsExample falloff={getFalloff} />
            </PageDocsExample>

            <PageDocsSection
                title={"A tree drawn outward"}
                content={
                    "A layout can put the nodes anywhere. This one is told which node each hangs from, so children share the slice their parent was given, and every rank sits a ring further out whichever node it hangs from. The line from each node to its parent is drawn by [prop]renderConnector[/prop]; the rings are the page's own, drawn behind the tree."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Radial.tsx`}>
                <RadialDocsExample />
            </PageDocsExample>
        </>
    );
};
