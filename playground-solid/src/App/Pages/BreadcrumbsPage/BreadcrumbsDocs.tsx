import { createSignal } from "solid-js";

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
    const [getIsDisabled, setIsDisabled] = createSignal(BreadcrumbKnobs.STARTING_IS_DISABLED);
    const [getSeparator, setSeparator] = createSignal<BreadcrumbSeparatorKey>("/");
    const [getHasLinkComponent, setHasLinkComponent] = createSignal(false);

    return (
        <>
            <PageDocsAlert severity={"info"}>
                The separators here are only examples. Whatever you return from{" "}
                <span class={docsStyles.docsPropName}>renderSeparator</span> is drawn, so what sits between the crumbs
                is entirely yours: text, an icon, any markup.
            </PageDocsAlert>

            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"separator"} {...BreadcrumbKnobs.SEPARATOR_TEXT}>
                            <PageSelectField
                                value={getSeparator}
                                values={BREADCRUMB_SEPARATORS}
                                ariaLabel={"Separator"}
                                onChange={setSeparator}
                            />
                        </PageProp>

                        <PageProp key={"isDisabled"} {...BreadcrumbKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isDisabled={getIsDisabled} separator={getSeparator} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.links} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Links.tsx`}
                renderKnobs={() => (
                    <PageProp key={"hasLinkComponent"} {...BreadcrumbKnobs.HAS_LINK_COMPONENT_TEXT}>
                        <PageCheckField
                            value={getHasLinkComponent}
                            ariaLabel={"Custom link component"}
                            onChange={setHasLinkComponent}
                        />
                    </PageProp>
                )}
            >
                <LinksDocsExample isDisabled={getIsDisabled} hasLinkComponent={getHasLinkComponent} />
            </PageDocsExample>
        </>
    );
};
