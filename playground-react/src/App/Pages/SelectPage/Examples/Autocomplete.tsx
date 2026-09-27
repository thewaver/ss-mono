import { Select } from "@thewaver/ss-components-react";
import type { SelectOption } from "@thewaver/ss-components-react";
import * as popupStyles from "@thewaver/ss-playground-core/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { PagePopoverSurface } from "../../../StyledComponents/PopoverSurface/PopoverSurface";
import { PageSelectContent, computePageSelectTextStyle } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { PLACEHOLDER, QUERY_PADDING } from "../SelectPage.const";
import type { Airport } from "../SelectPage.types";

type Props = {
    valueState: readonly [Airport | undefined, (value: Airport | undefined) => void];
    queryState: readonly [string, (query: string) => void];
    options: SelectOption<Airport>[];
};

export const AutocompleteExample = (props: Props) => {
    return (
        <Select
            valueState={props.valueState}
            queryState={props.queryState}
            options={props.options}
            ariaLabel={"Airport"}
            padding={QUERY_PADDING}
            computeTextStyle={computePageSelectTextStyle}
            renderContent={(selectedOption, flags) => (
                <PageSelectContent flags={flags}>{selectedOption?.value.city ?? PLACEHOLDER}</PageSelectContent>
            )}
            renderOption={(option, flags) => (
                <PageSelectOptionContent flags={flags}>
                    {option.value.city} ({option.value.code})
                </PageSelectOptionContent>
            )}
            renderPopup={(renderOptions, visibilityTarget, transitionDurationMs, placement) => (
                <PagePopoverSurface
                    visibilityTarget={visibilityTarget}
                    transitionDurationMs={transitionDurationMs}
                    placement={placement}
                >
                    {props.options.length ? (
                        renderOptions()
                    ) : (
                        <div className={popupStyles.popoverSurfaceEmpty}>No airport matches that</div>
                    )}
                </PagePopoverSurface>
            )}
        />
    );
};
