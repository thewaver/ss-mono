import { useState } from "react";

import { Breadcrumbs, Button } from "@thewaver/ss-components-react";
import type { Breadcrumb, TabLinkProps } from "@thewaver/ss-components-react";
import type { CrumbValue } from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbTrail.types";
import {
    BREADCRUMBS_GAP,
    TRAIL,
    labelOf,
} from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbsPage.const";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import {
    PageBreadcrumbContent,
    PageBreadcrumbSeparator,
} from "../../../StyledComponents/BreadcrumbContent/BreadcrumbContent";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { BreadcrumbsLinksDocsExampleProps } from "../BreadcrumbsPageReact.types";

type Props = BreadcrumbsLinksDocsExampleProps;

const CustomBreadcrumbLink = (props: TabLinkProps) => <a {...props} data-link-component="" />;

export const LinksDocsExample = (props: Props) => {
    const [depth, setDepth] = useState(TRAIL.length);

    const crumbs: Breadcrumb<CrumbValue>[] = TRAIL.slice(0, depth).map((entry) => ({
        value: entry.value,
        href: `#breadcrumb-${entry.value}`,
        isDisabled: props.isDisabled,
    }));

    return (
        <>
            <Breadcrumbs
                crumbs={crumbs}
                gap={BREADCRUMBS_GAP}
                ariaLabel={"Linked trail"}
                linkComponent={props.hasLinkComponent ? CustomBreadcrumbLink : undefined}
                onSelect={(value) => {
                    setDepth(TRAIL.findIndex((entry) => entry.value === value) + 1);
                }}
                renderCrumb={(crumb, flags) => (
                    <PageBreadcrumbContent flags={flags}>{labelOf(crumb.value)}</PageBreadcrumbContent>
                )}
                renderSeparator={() => <PageBreadcrumbSeparator />}
            />

            <Button
                id={"linksReset"}
                isDisabled={depth === TRAIL.length}
                ariaLabel={"Restore the trail"}
                renderContent={(flags) => <PageControlButtonContent flags={flags} glyph={CONTROL_GLYPHS.replay} />}
                onClick={() => {
                    setDepth(TRAIL.length);
                }}
            />
        </>
    );
};
