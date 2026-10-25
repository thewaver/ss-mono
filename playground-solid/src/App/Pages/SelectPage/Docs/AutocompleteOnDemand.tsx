import { Show, createEffect, createSignal, on } from "solid-js";

import { Select } from "@thewaver/ss-components-solid";
import type { SelectOption } from "@thewaver/ss-components-solid";
import type { Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";
import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PagePopoverSurface } from "../../../StyledComponents/PopoverSurface/PopoverSurface";
import { PageSelectContent, computePageSelectTextStyle } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { PLACEHOLDER, QUERY_PADDING, searchRoutes } from "../SelectPageSolid.const";

export const AutocompleteOnDemandDocsExample = () => {
    const valueSignal = createSignal<Delivery | undefined>();
    const querySignal = createSignal("");
    const [getResults, setResults] = createSignal<SelectOption<Delivery>[]>([]);
    const [getTotal, setTotal] = createSignal(0);
    const [getIsSearching, setIsSearching] = createSignal(false);

    let latestRequest = 0;

    const search = async (offset: number) => {
        const request = ++latestRequest;

        setIsSearching(true);

        const page = await searchRoutes(querySignal[0](), offset);

        if (request !== latestRequest) return;

        setResults((results) => (offset > 0 ? [...results, ...page.items] : page.items));
        setTotal(page.total);
        setIsSearching(false);
    };

    createEffect(
        on(
            () => querySignal[0](),
            () => {
                setResults([]);
                setTotal(0);

                void search(0);
            },
        ),
    );

    return (
        <Select
            renderHighlightFloater={renderPageHighlightFloater}
            value={valueSignal}
            query={querySignal}
            options={getResults}
            hasMoreOptions={() => getResults().length < getTotal() || getIsSearching()}
            ariaLabel={"Route"}
            padding={QUERY_PADDING}
            computeTextStyle={computePageSelectTextStyle}
            renderContent={(getSelectedOption, getFlags) => (
                <PageSelectContent flags={getFlags}>{getSelectedOption()?.value.name ?? PLACEHOLDER}</PageSelectContent>
            )}
            renderOption={(getOption, getFlags) => (
                <PageSelectOptionContent isGliding flags={getFlags} description={() => getOption().value.description}>
                    {getOption().value.name}
                </PageSelectOptionContent>
            )}
            renderPopup={(renderOptions, getVisibilityTarget, getTransitionDurationMs, getPlacement) => (
                <PagePopoverSurface
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                    placement={getPlacement}
                >
                    {renderOptions()}

                    <Show when={getIsSearching()}>
                        <div class={popupStyles.popoverSurfaceEmpty}>Searching…</div>
                    </Show>

                    <Show when={!getIsSearching() && getTotal() < 1}>
                        <div class={popupStyles.popoverSurfaceEmpty}>No route matches that</div>
                    </Show>
                </PagePopoverSurface>
            )}
            onReachEnd={() => {
                if (getIsSearching()) return;

                void search(getResults().length);
            }}
        />
    );
};
