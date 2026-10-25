import { useEffect, useRef, useState } from "react";

import { Select } from "@thewaver/ss-components-react";
import type { SelectOption } from "@thewaver/ss-components-react";
import type { Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";
import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PagePopoverSurface } from "../../../StyledComponents/PopoverSurface/PopoverSurface";
import { PageSelectContent, computePageSelectTextStyle } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { PLACEHOLDER, QUERY_PADDING, searchRoutes } from "../SelectPageReact.const";

export const AutocompleteOnDemandDocsExample = () => {
    const valueState = useState<Delivery | undefined>();
    const queryState = useState("");
    const [results, setResults] = useState<SelectOption<Delivery>[]>([]);
    const [total, setTotal] = useState(0);
    const [isSearching, setIsSearching] = useState(false);

    const latestRequestRef = useRef(0);

    const query = queryState[0];

    const search = async (offset: number) => {
        const request = ++latestRequestRef.current;

        setIsSearching(true);

        const page = await searchRoutes(query, offset);

        if (request !== latestRequestRef.current) return;

        setResults((current) => (offset > 0 ? [...current, ...page.items] : page.items));
        setTotal(page.total);
        setIsSearching(false);
    };

    useEffect(() => {
        setResults([]);
        setTotal(0);

        void search(0);
    }, [query]);

    return (
        <Select
            renderHighlightFloater={renderPageHighlightFloater}
            value={valueState}
            query={queryState}
            options={results}
            hasMoreOptions={results.length < total || isSearching}
            ariaLabel={"Route"}
            padding={QUERY_PADDING}
            computeTextStyle={computePageSelectTextStyle}
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

                    {isSearching && <div className={popupStyles.popoverSurfaceEmpty}>Searching…</div>}

                    {!isSearching && total < 1 && (
                        <div className={popupStyles.popoverSurfaceEmpty}>No route matches that</div>
                    )}
                </PagePopoverSurface>
            )}
            onReachEnd={() => {
                if (isSearching) return;

                void search(results.length);
            }}
        />
    );
};
