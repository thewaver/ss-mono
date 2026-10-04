import { Listbox } from "@thewaver/ss-components-react";

import { PageGlideFloater, PageGlideLabel } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageListboxSurface } from "../../../StyledComponents/ListboxSurface/ListboxSurface";
import { COUNTRIES_WITH_REACHABLE } from "../../SelectPage/SelectPage.const";
import type { ListboxExampleProps } from "../ListboxPage.types";

type Props = ListboxExampleProps;

export const GlideExample = (props: Props) => (
    <PageListboxSurface>
        <Listbox
            value={props.value}
            options={COUNTRIES_WITH_REACHABLE}
            ariaLabel={"Shipping country, gliding"}
            renderOption={(option, flags) => (
                <PageGlideLabel isSelected={flags.isSelected ?? false}>{option.value}</PageGlideLabel>
            )}
            renderSelectionFloater={(visibilityTarget, transitionDurationMs) => (
                <PageGlideFloater
                    kind={"selection"}
                    visibilityTarget={visibilityTarget}
                    transitionDurationMs={transitionDurationMs}
                />
            )}
            renderHighlightFloater={(visibilityTarget, transitionDurationMs) => (
                <PageGlideFloater
                    kind={"highlight"}
                    visibilityTarget={visibilityTarget}
                    transitionDurationMs={transitionDurationMs}
                />
            )}
        />
    </PageListboxSurface>
);
