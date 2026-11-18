import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.const";

import { PageDocsExample } from "../../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../../PageComponents/DocsSection/DocsSection";
import { BasicDocsExample } from "./Docs/Basic";
import { SubmenusDocsExample } from "./Docs/Submenus";

export const FanMenuDocs = () => (
    <>
        <PageDocsExample path={`${DOCS_ROOT}/Basic.tsx`}>
            <BasicDocsExample />
        </PageDocsExample>

        <PageDocsSection {...DOCS_SECTIONS.submenus} />

        <PageDocsExample path={`${DOCS_ROOT}/Submenus.tsx`}>
            <SubmenusDocsExample />
        </PageDocsExample>
    </>
);
