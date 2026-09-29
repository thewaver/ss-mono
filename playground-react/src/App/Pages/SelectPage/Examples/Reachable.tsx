import { Select } from "@thewaver/ss-components-react";

import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import { COUNTRIES, PLACEHOLDER, renderSelectPopup } from "../SelectPage.const";
import type { SelectExampleProps } from "../SelectPage.types";

type Props = SelectExampleProps;

export const ReachableExample = (props: Props) => {
    return (
        <Select
            value={props.value}
            options={COUNTRIES}
            isDisabled={true}
            isReachableWhenDisabled={true}
            ariaLabel={"Country"}
            renderContent={(selectedOption, flags) => (
                <PageSelectContent flags={flags}>{selectedOption?.value ?? PLACEHOLDER}</PageSelectContent>
            )}
            renderOption={(option, flags) => (
                <PageSelectOptionContent flags={flags}>{option.value}</PageSelectOptionContent>
            )}
            renderPopup={renderSelectPopup}
            tooltipDefs={{
                placement: { x: "center", y: "top-out" },
                offset: { x: 0, y: 10 },
                renderContent: (visibilityTarget, transitionDurationMs) => (
                    <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                        Focusable so this can be read, but the list must not open.
                    </PageTooltipContent>
                ),
            }}
        />
    );
};
