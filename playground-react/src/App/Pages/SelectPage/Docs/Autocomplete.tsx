import { useMemo, useState } from "react";

import { Select } from "@thewaver/ss-components-react";
import type { Airport } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";
import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PagePopoverSurface } from "../../../StyledComponents/PopoverSurface/PopoverSurface";
import { PageSelectContent, computePageSelectTextStyle } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { AIRPORTS, PLACEHOLDER, QUERY_PADDING } from "../SelectPageReact.const";

export const AutocompleteDocsExample = () => {
    const valueState = useState<Airport | undefined>();
    const queryState = useState("");

    const query = queryState[0];

    const options = useMemo(() => {
        const needle = query.toLocaleLowerCase();

        if (!needle) return AIRPORTS;

        return AIRPORTS.filter(
            (option) =>
                option.value.city.toLocaleLowerCase().includes(needle) ||
                option.value.code.toLocaleLowerCase().includes(needle),
        );
    }, [query]);

    return (
        <Select
            renderHighlightFloater={renderPageHighlightFloater}
            value={valueState}
            query={queryState}
            options={options}
            ariaLabel={"Airport"}
            padding={QUERY_PADDING}
            computeTextStyle={computePageSelectTextStyle}
            renderContent={(selectedOption, flags) => (
                <PageSelectContent flags={flags}>{selectedOption?.value.city ?? PLACEHOLDER}</PageSelectContent>
            )}
            renderOption={(option, flags) => (
                <PageSelectOptionContent isGliding flags={flags}>
                    {option.value.city} ({option.value.code})
                </PageSelectOptionContent>
            )}
            renderPopup={(renderOptions, visibilityTarget, transitionDurationMs, placement) => (
                <PagePopoverSurface
                    visibilityTarget={visibilityTarget}
                    transitionDurationMs={transitionDurationMs}
                    placement={placement}
                >
                    {options.length ? (
                        renderOptions()
                    ) : (
                        <div className={popupStyles.popoverSurfaceEmpty}>No airport matches that</div>
                    )}
                </PagePopoverSurface>
            )}
        />
    );
};
