import { Listbox } from "@thewaver/ss-components-solid";

import { PageGlideFloater, PageGlideLabel } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageListboxSurface } from "../../../StyledComponents/ListboxSurface/ListboxSurface";
import { COUNTRIES_WITH_REACHABLE } from "../../SelectPage/SelectPage.const";
import type { ListboxExampleProps } from "../ListboxPage.types";

type Props = ListboxExampleProps;

export const GlideExample = (props: Props) => (
    <PageListboxSurface>
        <Listbox
            value={props.value}
            options={() => COUNTRIES_WITH_REACHABLE}
            ariaLabel={"Shipping country, gliding"}
            renderOption={(getOption, getFlags) => (
                <PageGlideLabel
                    isSelected={() => getFlags().isSelected}
                    isDisabled={() => getFlags().isDisabled ?? false}
                >
                    {getOption().value}
                </PageGlideLabel>
            )}
            renderSelectionFloater={(getVisibilityTarget, getTransitionDurationMs) => (
                <PageGlideFloater
                    kind={"selection"}
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                />
            )}
            renderHighlightFloater={(getVisibilityTarget, getTransitionDurationMs) => (
                <PageGlideFloater
                    kind={"highlight"}
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                />
            )}
        />
    </PageListboxSurface>
);
