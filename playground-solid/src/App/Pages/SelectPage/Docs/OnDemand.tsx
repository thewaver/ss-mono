import { Show, createSignal } from "solid-js";

import { Select } from "@thewaver/ss-components-solid";
import type { SelectOption } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { PAGED_TOTAL } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectPage.const";
import type { Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";
import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PagePopoverSurface } from "../../../StyledComponents/PopoverSurface/PopoverSurface";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { PLACEHOLDER, fetchRoutes } from "../SelectPageSolid.const";

export const OnDemandDocsExample = () => {
    const valueSignal = createSignal<Delivery | undefined>();
    const [getRoutes, setRoutes] = createSignal<SelectOption<Delivery>[]>([]);
    const [getIsFetching, setIsFetching] = createSignal(false);

    const fetchNext = async () => {
        if (getIsFetching()) return;

        setIsFetching(true);

        const page = await fetchRoutes(getRoutes().length);

        setRoutes((routes) => [...routes, ...page]);
        setIsFetching(false);
    };

    return (
        <>
            <Select
                renderHighlightFloater={renderPageHighlightFloater}
                value={valueSignal}
                options={getRoutes}
                hasMoreOptions={() => getRoutes().length < PAGED_TOTAL}
                ariaLabel={"Route"}
                renderContent={(getSelectedOption, getFlags) => (
                    <PageSelectContent flags={getFlags}>
                        {getSelectedOption()?.value.name ?? PLACEHOLDER}
                    </PageSelectContent>
                )}
                renderOption={(getOption, getFlags) => (
                    <PageSelectOptionContent
                        isGliding
                        flags={getFlags}
                        description={() => getOption().value.description}
                    >
                        {getOption().value.name}
                    </PageSelectOptionContent>
                )}
                renderPopup={(renderOptions, getVisibilityTarget, getTransitionDurationMs, getPlacement) => (
                    <PagePopoverSurface
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                        placement={getPlacement}
                    >
                        {renderOptions()}

                        <Show when={getIsFetching()}>
                            <div class={popupStyles.popoverSurfaceEmpty}>Fetching more routes…</div>
                        </Show>
                    </PagePopoverSurface>
                )}
                onReachEnd={() => void fetchNext()}
            />

            <div class={exampleStyles.exampleReadout}>
                {`${getRoutes().length} of ${PAGED_TOTAL} routes fetched${getIsFetching() ? ", more on the way" : ""}`}
            </div>
        </>
    );
};
