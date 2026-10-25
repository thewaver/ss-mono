import { createSignal } from "solid-js";

import { LISTBOX_ORIENTATIONS } from "@thewaver/ss-components-solid";
import type { ListboxOrientation } from "@thewaver/ss-components-solid";
import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/ListboxPage/ListboxPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { GlideDocsExample } from "./Docs/Glide";
import { GroupsDocsExample } from "./Docs/Groups";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";

export const ListboxDocs = () => {
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getOrientation, setOrientation] = createSignal<ListboxOrientation>("horizontal");
    const [getIsGliding, setIsGliding] = createSignal(true);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"isDisabled"}
                        label={"Disabled"}
                        hint={"Turns the list off: no option can be picked, and the Tab key skips it."}
                        controls={"Sets ListboxProps.isDisabled"}
                    >
                        <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                    </PageProp>
                )}
            >
                <BasicDocsExample isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection
                title={"Several values, in groups"}
                content={
                    "For more than one value, use MultiListbox: Enter or Space picks the focused option and pressing it again drops it, and every pick is held in one [prop]values[/prop] list. Options can sit in groups under headings drawn by [prop]renderGroupHeader[/prop]: a screen reader announces each group's name, and the arrow keys walk past the headings from one group into the next, skipping a disabled option such as Finland."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Groups.tsx`}>
                <GroupsDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Horizontal, right to left"}
                content={
                    "Set [prop]orientation[/prop] to horizontal and the options run across, walked by the left and right arrows instead of the up and down ones. A horizontal list follows the text's direction, so inside a box whose text runs right to left the options start from the right and the left arrow moves forward. A vertical one keeps the up and down arrows, and its options read from the right. L is disabled, so the arrows skip it."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/RightToLeft.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"orientation"}
                        label={"Orientation"}
                        hint={"Whether the options run across the page or down it, and so which arrows walk them."}
                        controls={"Sets ListboxProps.orientation"}
                    >
                        <PageSelectField
                            value={getOrientation}
                            values={LISTBOX_ORIENTATIONS}
                            ariaLabel={"Orientation"}
                            onChange={(orientation) => setOrientation(() => orientation)}
                        />
                    </PageProp>
                )}
            >
                <RightToLeftDocsExample orientation={getOrientation} />
            </PageDocsExample>

            <PageDocsSection
                title={"Markers that glide"}
                content={
                    "Give the list [prop]renderSelectionFloater[/prop] and one marker sits behind the picked option and slides to each new pick; give it [prop]renderHighlightFloater[/prop] and a second slides to whichever option the pointer or the arrows are on. Without them, each option paints its own highlight from the flags it is handed."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Glide.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"isGliding"}
                        label={"Gliding markers"}
                        hint={
                            "Draws one marker on the picked option and a second that slides between the options. Off, each option lights up on its own."
                        }
                        controls={
                            "Passes ListboxProps.renderSelectionFloater and renderHighlightFloater, or leaves them out"
                        }
                    >
                        <PageCheckField value={getIsGliding} ariaLabel={"Gliding markers"} onChange={setIsGliding} />
                    </PageProp>
                )}
            >
                <GlideDocsExample isGliding={getIsGliding} />
            </PageDocsExample>
        </>
    );
};
