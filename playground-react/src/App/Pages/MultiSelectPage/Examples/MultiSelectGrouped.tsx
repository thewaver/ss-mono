import { MultiSelect } from "@thewaver/ss-components-react";
import type { SelectItem } from "@thewaver/ss-components-react";
import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { PagePopoverSurface } from "../../../StyledComponents/PopoverSurface/PopoverSurface";
import { PageSelectContent, computePageSelectTextStyle } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectGroupContent } from "../../../StyledComponents/SelectGroupContent/SelectGroupContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { PLACEHOLDER, QUERY_PADDING } from "../../SelectPage/SelectPage.const";

type Props = {
    values: readonly [string[], (values: string[]) => void];
    query: readonly [string, (query: string) => void];
    options: SelectItem<string>[];
};

export const MultiSelectGroupedExample = (props: Props) => {
    return (
        <MultiSelect
            values={props.values}
            query={props.query}
            options={props.options}
            ariaLabel={"Countries"}
            padding={QUERY_PADDING}
            computeTextStyle={computePageSelectTextStyle}
            renderContent={(selectedOptions, flags) => (
                <PageSelectContent flags={flags}>
                    {selectedOptions.length ? `${selectedOptions.length} selected` : PLACEHOLDER}
                </PageSelectContent>
            )}
            renderGroup={(group, flags) => <PageSelectGroupContent flags={flags}>{group.label}</PageSelectGroupContent>}
            renderOption={(option, flags) => (
                <PageSelectOptionContent flags={flags}>{option.value}</PageSelectOptionContent>
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
                        <div className={popupStyles.popoverSurfaceEmpty}>No country matches that</div>
                    )}
                </PagePopoverSurface>
            )}
        />
    );
};
