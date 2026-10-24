import { createMemo, createSignal } from "solid-js";

import { Breadcrumbs, Button, access } from "@thewaver/ss-components-solid";
import type { Breadcrumb, TabLinkProps } from "@thewaver/ss-components-solid";
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
import type { BreadcrumbsLinksDocsExampleProps } from "../BreadcrumbsPageSolid.types";

type Props = BreadcrumbsLinksDocsExampleProps;

const CustomBreadcrumbLink = (props: TabLinkProps) => <a {...props} data-link-component />;

export const LinksDocsExample = (props: Props) => {
    const [getDepth, setDepth] = createSignal(TRAIL.length);

    const getCrumbs = createMemo<Breadcrumb<CrumbValue>[]>(() =>
        TRAIL.slice(0, getDepth()).map((entry) => ({
            value: entry.value,
            href: `#breadcrumb-${entry.value}`,
            isDisabled: access(props.isDisabled),
        })),
    );

    return (
        <>
            <Breadcrumbs
                crumbs={getCrumbs}
                gap={BREADCRUMBS_GAP}
                ariaLabel={"Linked trail"}
                linkComponent={access(props.hasLinkComponent) ? CustomBreadcrumbLink : undefined}
                onSelect={(value) => {
                    setDepth(TRAIL.findIndex((entry) => entry.value === value) + 1);
                }}
                renderCrumb={(getCrumb, getFlags) => (
                    <PageBreadcrumbContent flags={getFlags}>{labelOf(getCrumb().value)}</PageBreadcrumbContent>
                )}
                renderSeparator={() => <PageBreadcrumbSeparator />}
            />

            <Button
                id={"linksReset"}
                isDisabled={() => getDepth() === TRAIL.length}
                ariaLabel={"Restore the trail"}
                renderContent={(getFlags) => (
                    <PageControlButtonContent flags={getFlags} glyph={CONTROL_GLYPHS.replay} />
                )}
                onClick={() => {
                    setDepth(TRAIL.length);
                }}
            />
        </>
    );
};
