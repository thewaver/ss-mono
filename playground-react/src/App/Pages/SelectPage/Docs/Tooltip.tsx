import { useState } from "react";

import { Select } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import { COUNTRIES, PLACEHOLDER, renderSelectPopup } from "../SelectPageReact.const";
import type { SelectTooltipDocsExampleProps } from "../SelectPageReact.types";

type Props = SelectTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const valueState = useState<string | undefined>("Sweden");

    return (
        <Select
            renderHighlightFloater={renderPageHighlightFloater}
            value={valueState}
            options={COUNTRIES}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            ariaLabel={"Country"}
            renderContent={(selectedOption, flags) => (
                <PageSelectContent flags={flags}>{selectedOption?.value ?? PLACEHOLDER}</PageSelectContent>
            )}
            renderOption={(option, flags) => (
                <PageSelectOptionContent isGliding flags={flags}>
                    {option.value}
                </PageSelectOptionContent>
            )}
            renderPopup={renderSelectPopup}
            tooltipDefs={{
                placement: { x: "center", y: "top_out" },
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
