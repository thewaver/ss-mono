import { Breadcrumbs } from "@thewaver/ss-components-react";
import { BREADCRUMBS_GAP, labelOf } from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbsPage.const";

import { PageBreadcrumbContent } from "../../../StyledComponents/BreadcrumbContent/BreadcrumbContent";
import type { BreadcrumbsExampleProps } from "../BreadcrumbsPage.types";

type Props = BreadcrumbsExampleProps;

export const BareExample = (props: Props) => {
    return (
        <Breadcrumbs
            crumbs={props.crumbs}
            gap={BREADCRUMBS_GAP}
            ariaLabel={"Trail without separators"}
            renderCrumb={(crumb, flags) => (
                <PageBreadcrumbContent flags={flags}>{labelOf(crumb.value)}</PageBreadcrumbContent>
            )}
        />
    );
};
