import { useState } from "react";

import { Breadcrumbs, Button } from "@thewaver/ss-components-react";
import type { Breadcrumb } from "@thewaver/ss-components-react";
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

export const RightToLeftDocsExample = () => {
    const [depth, setDepth] = useState(TRAIL.length);

    const crumbs: Breadcrumb<CrumbValue>[] = TRAIL.slice(0, depth).map((entry) => ({ value: entry.value }));

    return (
        <>
            <div dir={"rtl"}>
                <Breadcrumbs
                    crumbs={crumbs}
                    gap={BREADCRUMBS_GAP}
                    ariaLabel={"Trail"}
                    onSelect={(value) => {
                        setDepth(TRAIL.findIndex((entry) => entry.value === value) + 1);
                    }}
                    renderCrumb={(crumb, flags) => (
                        <PageBreadcrumbContent flags={flags}>{labelOf(crumb.value)}</PageBreadcrumbContent>
                    )}
                    renderSeparator={() => <PageBreadcrumbSeparator>{">"}</PageBreadcrumbSeparator>}
                />
            </div>

            <Button
                id={"rightToLeftReset"}
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
