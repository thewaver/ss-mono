import { createMemo, createSignal } from "solid-js";

import { Select } from "@thewaver/ss-components-solid";
import type { Airport } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";
import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PagePopoverSurface } from "../../../StyledComponents/PopoverSurface/PopoverSurface";
import { PageSelectContent, computePageSelectTextStyle } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { AIRPORTS, PLACEHOLDER, QUERY_PADDING } from "../SelectPageSolid.const";

export const AutocompleteDocsExample = () => {
    const valueSignal = createSignal<Airport | undefined>();
    const querySignal = createSignal("");

    const getOptions = createMemo(() => {
        const query = querySignal[0]().toLocaleLowerCase();

        if (!query) return AIRPORTS;

        return AIRPORTS.filter(
            (option) =>
                option.value.city.toLocaleLowerCase().includes(query) ||
                option.value.code.toLocaleLowerCase().includes(query),
        );
    });

    return (
        <Select
            renderHighlightFloater={renderPageHighlightFloater}
            value={valueSignal}
            query={querySignal}
            options={getOptions}
            ariaLabel={"Airport"}
            padding={QUERY_PADDING}
            computeTextStyle={computePageSelectTextStyle}
            renderContent={(getSelectedOption, getFlags) => (
                <PageSelectContent flags={getFlags}>{getSelectedOption()?.value.city ?? PLACEHOLDER}</PageSelectContent>
            )}
            renderOption={(getOption, getFlags) => (
                <PageSelectOptionContent isGliding flags={getFlags}>
                    {getOption().value.city} ({getOption().value.code})
                </PageSelectOptionContent>
            )}
            renderPopup={(renderOptions, getVisibilityTarget, getTransitionDurationMs, getPlacement) => (
                <PagePopoverSurface
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                    placement={getPlacement}
                >
                    {getOptions().length ? (
                        renderOptions()
                    ) : (
                        <div class={popupStyles.popoverSurfaceEmpty}>No airport matches that</div>
                    )}
                </PagePopoverSurface>
            )}
        />
    );
};
