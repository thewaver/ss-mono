import { createMemo, createSignal } from "solid-js";

import { Breadcrumbs, Button, access } from "@thewaver/ss-components-solid";
import type { Breadcrumb } from "@thewaver/ss-components-solid";
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
import type { BreadcrumbsBasicDocsExampleProps } from "../BreadcrumbsPageSolid.types";

type Props = BreadcrumbsBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const [getDepth, setDepth] = createSignal(TRAIL.length);

    const getCrumbs = createMemo<Breadcrumb<CrumbValue>[]>(() =>
        TRAIL.slice(0, getDepth()).map((entry) => ({ value: entry.value, isDisabled: access(props.isDisabled) })),
    );

    return (
        <>
            <Breadcrumbs
                crumbs={getCrumbs}
                gap={BREADCRUMBS_GAP}
                ariaLabel={"Trail"}
                onSelect={(value) => {
                    setDepth(TRAIL.findIndex((entry) => entry.value === value) + 1);
                }}
                renderCrumb={(getCrumb, getFlags) => (
                    <PageBreadcrumbContent flags={getFlags}>{labelOf(getCrumb().value)}</PageBreadcrumbContent>
                )}
                renderSeparator={
                    access(props.separator) === "none"
                        ? undefined
                        : () => <PageBreadcrumbSeparator>{access(props.separator)}</PageBreadcrumbSeparator>
                }
            />

            <Button
                id={"basicReset"}
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
