import type { Signal } from "solid-js";

import { Select, access } from "@thewaver/ss-components-solid";
import type { MaybeAccessor, SelectOption } from "@thewaver/ss-components-solid";
import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { PagePopoverSurface } from "../../../StyledComponents/PopoverSurface/PopoverSurface";
import { PageSelectContent, computePageSelectTextStyle } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { PLACEHOLDER, QUERY_PADDING } from "../SelectPage.const";
import type { Airport } from "../SelectPage.types";

type Props = {
    value: Signal<Airport | undefined>;
    query: Signal<string>;
    options: MaybeAccessor<SelectOption<Airport>[]>;
};

export const AutocompleteExample = (props: Props) => {
    return (
        <Select
            value={props.value}
            query={props.query}
            options={props.options}
            ariaLabel={"Airport"}
            padding={() => QUERY_PADDING}
            computeTextStyle={computePageSelectTextStyle}
            renderContent={(getSelectedOption, getFlags) => (
                <PageSelectContent flags={getFlags}>{getSelectedOption()?.value.city ?? PLACEHOLDER}</PageSelectContent>
            )}
            renderOption={(getOption, getFlags) => (
                <PageSelectOptionContent flags={getFlags}>
                    {getOption().value.city} ({getOption().value.code})
                </PageSelectOptionContent>
            )}
            renderPopup={(renderOptions, getVisibilityTarget, getTransitionDurationMs, getPlacement) => (
                <PagePopoverSurface
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                    placement={getPlacement}
                >
                    {access(props.options).length ? (
                        renderOptions()
                    ) : (
                        <div class={popupStyles.popoverSurfaceEmpty}>No airport matches that</div>
                    )}
                </PagePopoverSurface>
            )}
        />
    );
};
