import { useMemo, useState } from "react";

import { Select } from "@thewaver/ss-components-react";
import type { Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { PLACEHOLDER, createStressDeliveries, renderSelectPopup } from "../SelectPageReact.const";
import type { SelectVirtualizedDocsExampleProps } from "../SelectPageReact.types";

const OPTION_HEIGHT = 100;

type Props = SelectVirtualizedDocsExampleProps;

export const VirtualizedDocsExample = (props: Props) => {
    const valueState = useState<Delivery | undefined>();

    const options = useMemo(() => createStressDeliveries(props.count), [props.count]);

    return (
        <Select
            renderHighlightFloater={renderPageHighlightFloater}
            value={valueState}
            visibility={props.visibility}
            options={options}
            ariaLabel={"Route"}
            computeEstimatedOptionHeight={() => OPTION_HEIGHT}
            computeCustomText={(option) => option.value.name}
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
};
