import { useState } from "react";

import { LISTBOX_ORIENTATIONS } from "@thewaver/ss-components-react";
import type { ListboxOrientation } from "@thewaver/ss-components-react";
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
    const [isDisabled, setIsDisabled] = useState(false);
    const [orientation, setOrientation] = useState<ListboxOrientation>("horizontal");
    const [isGliding, setIsGliding] = useState(true);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"isDisabled"} {...ListboxKnobs.IS_DISABLED_TEXT}>
                        <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                    </PageProp>
                )}
            >
                <BasicDocsExample isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.severalValuesGroups} />

            <PageDocsExample path={`${DOCS_ROOT}/Groups.tsx`}>
                <GroupsDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.horizontalRightLeft} />

            <PageDocsExample
                path={`${DOCS_ROOT}/RightToLeft.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"orientation"} {...ListboxKnobs.ORIENTATION_TEXT}>
                        <PageSelectField
                            value={orientation}
                            values={LISTBOX_ORIENTATIONS}
                            ariaLabel={"Orientation"}
                            onChange={(orientation) => setOrientation(orientation)}
                        />
                    </PageProp>
                )}
            >
                <RightToLeftDocsExample orientation={orientation} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.markersThatGlide} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Glide.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"isGliding"} {...ListboxKnobs.IS_GLIDING_TEXT}>
                        <PageCheckField value={isGliding} ariaLabel={"Gliding markers"} onChange={setIsGliding} />
                    </PageProp>
                )}
            >
                <GlideDocsExample isGliding={isGliding} />
            </PageDocsExample>
        </>
    );
};
