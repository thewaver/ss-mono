import { useState } from "react";

import { BreadcrumbKnobs } from "@thewaver/ss-playground/App/Knobs/Breadcrumbs.const";
import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import {
    BREADCRUMB_SEPARATORS,
    DOCS_ROOT,
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
                        <PageProp
                            itemKey={"separator"}
                            label={"Separator"}
                            hint={
                                'What is drawn between the crumbs. Choosing "none" leaves the slot out, so nothing sits between the crumbs and no empty element is rendered. Where drawn, it is hidden from assistive technology.'
                            }
                            controls={'Passes BreadcrumbsProps.renderSeparator, or omits it for "none"'}
                        >
                            <PageSelectField
                                value={separator}
                                values={BREADCRUMB_SEPARATORS}
                                ariaLabel={"Separator"}
                                onChange={setSeparator}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"isDisabled"}
                            label={"Disabled"}
                            hint={
                                "Turns every crumb off: it refuses the press and says it is disabled, without the native attribute."
                            }
                            controls={
                                "Sets Breadcrumb.isDisabled on every example crumb sent to BreadcrumbsProps.crumbs"
                            }
                        >
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isDisabled={isDisabled} separator={separator} />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the trail starts from the right, with the first crumb rightmost. A separator that points, such as the > here, is drawn mirrored by the browser, so it still points along the trail; a slash or a dash is drawn as it is, so pick one that reads either way."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Links"}
                content={
                    "Give a crumb an [prop]href[/prop] and it is drawn as a native HTML anchor element, with the address passed through untouched. In a routed app, pass [prop]linkComponent[/prop], a custom link component such as your router's, and the crumbs are drawn with it instead."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Links.tsx`}
                renderKnobs={() => (
                    <PageProp
                        itemKey={"hasLinkComponent"}
                        label={"Custom link component"}
                        hint={
                            "Draws the crumbs with a custom link component, as a router's link would be. Off, they use the native HTML anchor element."
                        }
                        controls={"Sets BreadcrumbsProps.linkComponent"}
                    >
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
