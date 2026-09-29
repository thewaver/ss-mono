import type { Signal } from "solid-js";

import { MultiSelect, access } from "@thewaver/ss-components-solid";
import type { MaybeAccessor, SelectItem } from "@thewaver/ss-components-solid";
import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { PagePopoverSurface } from "../../../StyledComponents/PopoverSurface/PopoverSurface";
import { PageSelectContent, computePageSelectTextStyle } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectGroupContent } from "../../../StyledComponents/SelectGroupContent/SelectGroupContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { PLACEHOLDER, QUERY_PADDING } from "../../SelectPage/SelectPage.const";

type Props = {
    values: Signal<string[]>;
    query: Signal<string>;
    options: MaybeAccessor<SelectItem<string>[]>;
};

export const MultiSelectGroupedExample = (props: Props) => {
    return (
        <MultiSelect
            values={props.values}
            query={props.query}
            options={props.options}
            ariaLabel={"Countries"}
            padding={() => QUERY_PADDING}
            computeTextStyle={computePageSelectTextStyle}
            renderContent={(getSelectedOptions, getFlags) => (
                <PageSelectContent flags={getFlags}>
                    {getSelectedOptions().length ? `${getSelectedOptions().length} selected` : PLACEHOLDER}
                </PageSelectContent>
            )}
            renderGroup={(getGroup, getFlags) => (
                <PageSelectGroupContent flags={getFlags}>{getGroup().label}</PageSelectGroupContent>
            )}
            renderOption={(getOption, getFlags) => (
                <PageSelectOptionContent flags={getFlags}>{getOption().value}</PageSelectOptionContent>
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
                        <div class={popupStyles.popoverSurfaceEmpty}>No country matches that</div>
                    )}
                </PagePopoverSurface>
            )}
        />
    );
};
