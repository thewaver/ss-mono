import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.const";

import { PageDocsExample } from "../../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../../PageComponents/DocsSection/DocsSection";
import { BasicDocsExample } from "./Docs/Basic";
import { SubmenusDocsExample } from "./Docs/Submenus";

export const FanMenuDocs = () => (
    <>
        <PageDocsExample path={`${DOCS_ROOT}/Basic.tsx`}>
            <BasicDocsExample />
        </PageDocsExample>

        <PageDocsSection
            title={"Submenus"}
            content={
                "Give an item [prop]items[/prop] of its own and picking it replaces the arc with its submenu, rather than opening a second arc beside it. The card at the head of the new arc is the item you came in through, and picking it, or pressing the left arrow, takes you back. A submenu opens on a press, not on a hover, so sweeping the pointer across the arc never drills into a level by accident."
            }
        />

        <PageDocsExample path={`${DOCS_ROOT}/Submenus.tsx`}>
            <SubmenusDocsExample />
        </PageDocsExample>
    </>
);
