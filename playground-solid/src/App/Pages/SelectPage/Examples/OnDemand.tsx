import { Show } from "solid-js";

import { Select, access } from "@thewaver/ss-components-solid";
import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { PagePopoverSurface } from "../../../StyledComponents/PopoverSurface/PopoverSurface";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { PLACEHOLDER } from "../SelectPage.const";
import type { SelectRoutesExampleProps } from "../SelectPage.types";

type Props = SelectRoutesExampleProps;

export const OnDemandExample = (props: Props) => {
    return (
        <Select
            value={props.value}
            options={props.options}
            hasMoreOptions={props.hasMore}
            ariaLabel={"Route"}
            renderContent={(getSelectedOption, getFlags) => (
                <PageSelectContent flags={getFlags}>{getSelectedOption()?.value.name ?? PLACEHOLDER}</PageSelectContent>
            )}
            renderOption={(getOption, getFlags) => (
                <PageSelectOptionContent flags={getFlags} description={() => getOption().value.description}>
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

                    <Show when={access(props.isFetching)}>
                        <div class={popupStyles.popoverSurfaceEmpty}>Fetching more routes…</div>
                    </Show>
                </PagePopoverSurface>
            )}
            onReachEnd={props.onReachEnd}
        />
    );
};
