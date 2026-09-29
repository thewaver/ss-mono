import { Breadcrumbs } from "@thewaver/ss-components-react";
import type { TabLinkProps } from "@thewaver/ss-components-react";
import { BREADCRUMBS_GAP, labelOf } from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbsPage.const";

import {
    PageBreadcrumbContent,
    PageBreadcrumbSeparator,
} from "../../../StyledComponents/BreadcrumbContent/BreadcrumbContent";
import type { BreadcrumbsExampleProps } from "../BreadcrumbsPage.types";

type Props = BreadcrumbsExampleProps;

const PageBreadcrumbLink = (props: TabLinkProps) => <a {...props} data-link-component="" />;

export const LinkComponentExample = (props: Props) => {
    return (
        <Breadcrumbs
            crumbs={props.crumbs}
            gap={BREADCRUMBS_GAP}
            ariaLabel={"Routed trail"}
            linkComponent={PageBreadcrumbLink}
            renderCrumb={(crumb, flags) => (
                <PageBreadcrumbContent flags={flags}>{labelOf(crumb.value)}</PageBreadcrumbContent>
            )}
            renderSeparator={() => <PageBreadcrumbSeparator />}
        />
    );
};
