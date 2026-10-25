import { useRef, useState } from "react";

import { Select } from "@thewaver/ss-components-react";
import type { SelectOption } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { PAGED_TOTAL } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectPage.const";
import type { Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";
import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PagePopoverSurface } from "../../../StyledComponents/PopoverSurface/PopoverSurface";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { PLACEHOLDER, fetchRoutes } from "../SelectPageReact.const";

export const OnDemandDocsExample = () => {
    const valueState = useState<Delivery | undefined>();
    const [routes, setRoutes] = useState<SelectOption<Delivery>[]>([]);
    const [isFetching, setIsFetching] = useState(false);

    const isFetchingRef = useRef(false);

    const fetchNext = async () => {
        if (isFetchingRef.current) return;

        isFetchingRef.current = true;
        setIsFetching(true);

        const page = await fetchRoutes(routes.length);

        setRoutes((current) => [...current, ...page]);
        isFetchingRef.current = false;
        setIsFetching(false);
    };

    return (
        <>
            <Select
                renderHighlightFloater={renderPageHighlightFloater}
                value={valueState}
                options={routes}
                hasMoreOptions={routes.length < PAGED_TOTAL}
                ariaLabel={"Route"}
                renderContent={(selectedOption, flags) => (
                    <PageSelectContent flags={flags}>{selectedOption?.value.name ?? PLACEHOLDER}</PageSelectContent>
                )}
                renderOption={(option, flags) => (
                    <PageSelectOptionContent isGliding flags={flags} description={option.value.description}>
                        {option.value.name}
                    </PageSelectOptionContent>
                )}
                renderPopup={(renderOptions, visibilityTarget, transitionDurationMs, placement) => (
                    <PagePopoverSurface
                        visibilityTarget={visibilityTarget}
                        transitionDurationMs={transitionDurationMs}
                        placement={placement}
                    >
                        {renderOptions()}

                        {isFetching && <div className={popupStyles.popoverSurfaceEmpty}>Fetching more routes…</div>}
                    </PagePopoverSurface>
                )}
                onReachEnd={() => void fetchNext()}
            />

            <div className={exampleStyles.exampleReadout} data-readout>
                {`${routes.length} of ${PAGED_TOTAL} routes fetched${isFetching ? ", more on the way" : ""}`}
            </div>
        </>
    );
};
