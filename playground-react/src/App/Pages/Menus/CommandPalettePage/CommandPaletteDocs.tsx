import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
} from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.const";

import { PageDocsAlert } from "../../../PageComponents/DocsAlert/DocsAlert";
import { PageDocsExample } from "../../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../../PageComponents/DocsSection/DocsSection";
import { ActionShortcutsDocsExample } from "./Docs/ActionShortcuts";
import { BareLetterDocsExample } from "./Docs/BareLetter";
import { BasicDocsExample } from "./Docs/Basic";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";

export const CommandPaletteDocs = () => (
    <>
        <PageDocsExample path={`${DOCS_ROOT}/Basic.tsx`}>
            <BasicDocsExample />
        </PageDocsExample>

        <PageDocsSection {...DOCS_SECTIONS.actionsWithOwnShortcuts} />

        <PageDocsExample path={`${DOCS_ROOT}/ActionShortcuts.tsx`}>
            <ActionShortcutsDocsExample />
        </PageDocsExample>

        <PageDocsSection {...DOCS_SECTIONS.bareLetterShortcut} />

        <PageDocsAlert severity={"alert"}>
            A shortcut of a single character needs a way for the person to turn it off or change it, such as a setting
            in your app, or it fails <a href={WCAG_URLS["2.1.4"]}>WCAG 2.1.4</a>. The library warns about every such
            shortcut it registers, since it cannot tell whether you have.
        </PageDocsAlert>

        <PageDocsExample path={`${DOCS_ROOT}/BareLetter.tsx`}>
            <BareLetterDocsExample />
        </PageDocsExample>

        <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

        <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
            <RightToLeftDocsExample />
        </PageDocsExample>
    </>
);
