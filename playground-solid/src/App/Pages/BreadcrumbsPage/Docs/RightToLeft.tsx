import { createMemo, createSignal } from "solid-js";

import { Breadcrumbs, Button } from "@thewaver/ss-components-solid";
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

export const RightToLeftDocsExample = () => {
    const [getDepth, setDepth] = createSignal(TRAIL.length);

    const getCrumbs = createMemo<Breadcrumb<CrumbValue>[]>(() =>
        TRAIL.slice(0, getDepth()).map((entry) => ({ value: entry.value })),
    );

    return (
        <>
            <div dir={"rtl"}>
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
                    renderSeparator={() => <PageBreadcrumbSeparator>{">"}</PageBreadcrumbSeparator>}
                />
            </div>

            <Button
                id={"rightToLeftReset"}
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
