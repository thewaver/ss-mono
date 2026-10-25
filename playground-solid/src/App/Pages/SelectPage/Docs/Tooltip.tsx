import { createSignal } from "solid-js";

import { Select } from "@thewaver/ss-components-solid";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import { COUNTRIES, PLACEHOLDER, renderSelectPopup } from "../SelectPageSolid.const";
import type { SelectTooltipDocsExampleProps } from "../SelectPageSolid.types";

type Props = SelectTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const valueSignal = createSignal<string | undefined>("Sweden");

    return (
        <Select
            renderHighlightFloater={renderPageHighlightFloater}
            value={valueSignal}
            options={COUNTRIES}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            ariaLabel={"Country"}
            renderContent={(getSelectedOption, getFlags) => (
                <PageSelectContent flags={getFlags}>{getSelectedOption()?.value ?? PLACEHOLDER}</PageSelectContent>
            )}
            renderOption={(getOption, getFlags) => (
                <PageSelectOptionContent isGliding flags={getFlags}>
                    {getOption().value}
                </PageSelectOptionContent>
            )}
            renderPopup={renderSelectPopup}
            tooltipDefs={() => ({
                placement: () => ({ x: "center", y: "top_out" }),
                offset: () => ({ x: 0, y: 10 }),
                renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                    <PageTooltipContent
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    >
                        Focusable so this can be read, but the list must not open.
                    </PageTooltipContent>
                ),
            })}
        />
    );
};
