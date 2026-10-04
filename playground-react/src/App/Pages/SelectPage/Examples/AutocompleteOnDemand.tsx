import { Select } from "@thewaver/ss-components-react";
import type { SelectOption } from "@thewaver/ss-components-react";
import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PagePopoverSurface } from "../../../StyledComponents/PopoverSurface/PopoverSurface";
import { PageSelectContent, computePageSelectTextStyle } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { PLACEHOLDER, QUERY_PADDING } from "../SelectPage.const";
import type { Delivery } from "../SelectPage.types";

type Props = {
    value: readonly [Delivery | undefined, (value: Delivery | undefined) => void];
    query: readonly [string, (query: string) => void];
    options: SelectOption<Delivery>[];
    hasMore: boolean;
    isSearching: boolean;
    total: number;
    onReachEnd: () => void;
};

export const AutocompleteOnDemandExample = (props: Props) => {
    return (
        <Select
            renderHighlightFloater={renderPageHighlightFloater}
            value={props.value}
            query={props.query}
            options={props.options}
            hasMoreOptions={props.hasMore}
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

                    {props.isSearching && <div className={popupStyles.popoverSurfaceEmpty}>Searching…</div>}

                    {!props.isSearching && props.total < 1 && (
                        <div className={popupStyles.popoverSurfaceEmpty}>No route matches that</div>
                    )}
                </PagePopoverSurface>
            )}
            onReachEnd={props.onReachEnd}
        />
    );
};
