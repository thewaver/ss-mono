import { createSignal } from "solid-js";

import { LISTBOX_ORIENTATIONS } from "@thewaver/ss-components-solid";
import type { ListboxOrientation } from "@thewaver/ss-components-solid";
import { ListboxKnobs } from "@thewaver/ss-playground/App/Knobs/Listboxes.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/ListboxPage/ListboxPage.const";

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
                    <PageProp key={"isDisabled"} {...ListboxKnobs.IS_DISABLED_TEXT}>
                        <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                    </PageProp>
                )}
            >
                <BasicDocsExample isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.severalValuesGroups} />

            <PageDocsExample path={`${DOCS_ROOT}/Groups.tsx`}>
                <GroupsDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.horizontalRightLeft} />

            <PageDocsExample
                path={`${DOCS_ROOT}/RightToLeft.tsx`}
                renderKnobs={() => (
                    <PageProp key={"orientation"} {...ListboxKnobs.ORIENTATION_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.markersThatGlide} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Glide.tsx`}
                renderKnobs={() => (
                    <PageProp key={"isGliding"} {...ListboxKnobs.IS_GLIDING_TEXT}>
                        <PageCheckField value={getIsGliding} ariaLabel={"Gliding markers"} onChange={setIsGliding} />
                    </PageProp>
                )}
            >
                <GlideDocsExample isGliding={getIsGliding} />
            </PageDocsExample>
        </>
    );
};
