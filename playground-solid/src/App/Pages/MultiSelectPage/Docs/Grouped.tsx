import { createMemo, createSignal } from "solid-js";

import { MultiSelect, SelectUtils } from "@thewaver/ss-components-solid";
import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PagePopoverSurface } from "../../../StyledComponents/PopoverSurface/PopoverSurface";
import { PageSelectContent, computePageSelectTextStyle } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectGroupContent } from "../../../StyledComponents/SelectGroupContent/SelectGroupContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { GROUPED_COUNTRIES, PLACEHOLDER, QUERY_PADDING } from "../../SelectPage/SelectPageSolid.const";

export const GroupedDocsExample = () => {
    const valuesSignal = createSignal<string[]>([]);
    const querySignal = createSignal("");

    const getOptions = createMemo(() => {
        const query = querySignal[0]().toLocaleLowerCase();

        if (!query) return GROUPED_COUNTRIES;

        return GROUPED_COUNTRIES.map((item) =>
            SelectUtils.getIsGroup(item)
                ? {
                      ...item,
                      options: item.options.filter((option) => option.value.toLocaleLowerCase().includes(query)),
                  }
                : item,
        ).filter((item) =>
            SelectUtils.getIsGroup(item) ? item.options.length > 0 : item.value.toLocaleLowerCase().includes(query),
        );
    });

    return (
        <MultiSelect
            renderHighlightFloater={renderPageHighlightFloater}
            values={valuesSignal}
            query={querySignal}
            options={getOptions}
            ariaLabel={"Countries"}
            padding={QUERY_PADDING}
            computeTextStyle={computePageSelectTextStyle}
            renderContent={(getSelectedOptions, getFlags) => (
                <PageSelectContent flags={getFlags}>
                    {getSelectedOptions().length ? `${getSelectedOptions().length} selected` : PLACEHOLDER}
                </PageSelectContent>
            )}
            renderGroupHeader={(getGroup, getFlags) => (
                <PageSelectGroupContent flags={getFlags}>{getGroup().label}</PageSelectGroupContent>
            )}
            renderOption={(getOption, getFlags) => (
                <PageSelectOptionContent isGliding flags={getFlags}>
                    {getOption().value}
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
                        <div class={popupStyles.popoverSurfaceEmpty}>No country matches that</div>
                    )}
                </PagePopoverSurface>
            )}
        />
    );
};
