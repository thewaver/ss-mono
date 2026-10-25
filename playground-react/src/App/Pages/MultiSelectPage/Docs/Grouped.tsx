import { useMemo, useState } from "react";

import { MultiSelect, SelectUtils } from "@thewaver/ss-components-react";
import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PagePopoverSurface } from "../../../StyledComponents/PopoverSurface/PopoverSurface";
import { PageSelectContent, computePageSelectTextStyle } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectGroupContent } from "../../../StyledComponents/SelectGroupContent/SelectGroupContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { GROUPED_COUNTRIES, PLACEHOLDER, QUERY_PADDING } from "../../SelectPage/SelectPageReact.const";

export const GroupedDocsExample = () => {
    const valuesState = useState<string[]>([]);
    const queryState = useState("");

    const query = queryState[0];

    const options = useMemo(() => {
        const needle = query.toLocaleLowerCase();

        if (!needle) return GROUPED_COUNTRIES;

        return GROUPED_COUNTRIES.map((item) =>
            SelectUtils.getIsGroup(item)
                ? {
                      ...item,
                      options: item.options.filter((option) => option.value.toLocaleLowerCase().includes(needle)),
                  }
                : item,
        ).filter((item) =>
            SelectUtils.getIsGroup(item) ? item.options.length > 0 : item.value.toLocaleLowerCase().includes(needle),
        );
    }, [query]);

    return (
        <MultiSelect
            renderHighlightFloater={renderPageHighlightFloater}
            values={valuesState}
            query={queryState}
            options={options}
            ariaLabel={"Countries"}
            padding={QUERY_PADDING}
            computeTextStyle={computePageSelectTextStyle}
            renderContent={(selectedOptions, flags) => (
                <PageSelectContent flags={flags}>
                    {selectedOptions.length ? `${selectedOptions.length} selected` : PLACEHOLDER}
                </PageSelectContent>
            )}
            renderGroupHeader={(group, flags) => (
                <PageSelectGroupContent flags={flags}>{group.label}</PageSelectGroupContent>
            )}
            renderOption={(option, flags) => (
                <PageSelectOptionContent isGliding flags={flags}>
                    {option.value}
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
                        <div className={popupStyles.popoverSurfaceEmpty}>No country matches that</div>
                    )}
                </PagePopoverSurface>
            )}
        />
    );
};
