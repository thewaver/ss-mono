import { Select } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { DELIVERIES, PLACEHOLDER, renderSelectPopup } from "../SelectPage.const";
import type { SelectDeliveryExampleProps } from "../SelectPage.types";

type Props = SelectDeliveryExampleProps;

export const DeliveriesExample = (props: Props) => (
    <Select
        renderHighlightFloater={renderPageHighlightFloater}
        value={props.value}
        options={DELIVERIES}
        ariaLabel={"Delivery"}
        renderContent={(selectedOption, flags) => (
            <PageSelectContent flags={flags}>{selectedOption?.value.name ?? PLACEHOLDER}</PageSelectContent>
        )}
        renderOption={(option, flags) => (
            <PageSelectOptionContent isGliding flags={flags} description={option.value.description}>
                {option.value.name}
            </PageSelectOptionContent>
        )}
        renderPopup={renderSelectPopup}
    />
);
