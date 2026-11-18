import { useState } from "react";

import { BreadcrumbKnobs } from "@thewaver/ss-playground/App/Knobs/Breadcrumbs.const";
import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import {
    BREADCRUMB_SEPARATORS,
    DOCS_ROOT,
    DOCS_SECTIONS,
} from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbsPage.const";
import type { BreadcrumbSeparatorKey } from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbsPage.types";

import { PageDocsAlert } from "../../PageComponents/DocsAlert/DocsAlert";
import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { LinksDocsExample } from "./Docs/Links";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";

export const BreadcrumbsDocs = () => {
    const [isDisabled, setIsDisabled] = useState(BreadcrumbKnobs.STARTING_IS_DISABLED);
    const [separator, setSeparator] = useState<BreadcrumbSeparatorKey>("/");
    const [hasLinkComponent, setHasLinkComponent] = useState(false);

    return (
        <>
            <PageDocsAlert severity={"info"}>
                The separators here are only examples. Whatever you return from{" "}
                <span className={docsStyles.docsPropName}>renderSeparator</span> is drawn, so what sits between the
                crumbs is entirely yours: text, an icon, any markup.
            </PageDocsAlert>

            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"separator"} {...BreadcrumbKnobs.SEPARATOR_TEXT}>
                            <PageSelectField
                                value={separator}
                                values={BREADCRUMB_SEPARATORS}
                                ariaLabel={"Separator"}
                                onChange={setSeparator}
                            />
                        </PageProp>

                        <PageProp itemKey={"isDisabled"} {...BreadcrumbKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isDisabled={isDisabled} separator={separator} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.links} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Links.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"hasLinkComponent"} {...BreadcrumbKnobs.HAS_LINK_COMPONENT_TEXT}>
                        <PageCheckField
                            value={hasLinkComponent}
                            ariaLabel={"Custom link component"}
                            onChange={setHasLinkComponent}
                        />
                    </PageProp>
                )}
            >
                <LinksDocsExample isDisabled={isDisabled} hasLinkComponent={hasLinkComponent} />
            </PageDocsExample>
        </>
    );
};
