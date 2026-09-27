import { Select } from "@thewaver/ss-components-react";
import * as popupStyles from "@thewaver/ss-playground-core/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { PagePopoverSurface } from "../../../StyledComponents/PopoverSurface/PopoverSurface";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { PLACEHOLDER } from "../SelectPage.const";
import type { SelectRoutesExampleProps } from "../SelectPage.types";

type Props = SelectRoutesExampleProps;

export const OnDemandExample = (props: Props) => {
    return (
        <Select
            valueState={props.valueState}
            options={props.options}
            hasMoreOptions={props.hasMore}
            ariaLabel={"Route"}
            renderContent={(selectedOption, flags) => (
                <PageSelectContent flags={flags}>{selectedOption?.value.name ?? PLACEHOLDER}</PageSelectContent>
            )}
            renderOption={(option, flags) => (
                <PageSelectOptionContent flags={flags} description={option.value.description}>
                    {option.value.name}
                </PageSelectOptionContent>
            )}
            renderPopup={(renderOptions, visibilityTarget, transitionDurationMs, placement) => (
                <PagePopoverSurface
                    visibilityTarget={visibilityTarget}
                    transitionDurationMs={transitionDurationMs}
                    placement={placement}
                >
                    {renderOptions()}

                    {props.isFetching && <div className={popupStyles.popoverSurfaceEmpty}>Fetching more routes…</div>}
                </PagePopoverSurface>
            )}
            onReachEnd={props.onReachEnd}
        />
    );
};
