import { createMemo, createSignal } from "solid-js";

import { Select, access } from "@thewaver/ss-components-solid";
import type { Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { PLACEHOLDER, createStressDeliveries, renderSelectPopup } from "../SelectPageSolid.const";
import type { SelectVirtualizedDocsExampleProps } from "../SelectPageSolid.types";

const OPTION_HEIGHT = 100;

type Props = SelectVirtualizedDocsExampleProps;

export const VirtualizedDocsExample = (props: Props) => {
    const valueSignal = createSignal<Delivery | undefined>();

    const getOptions = createMemo(() => createStressDeliveries(access(props.count)));

    return (
        <Select
            renderHighlightFloater={renderPageHighlightFloater}
            value={valueSignal}
            visibility={props.visibility}
            options={getOptions}
            ariaLabel={"Route"}
            computeEstimatedOptionHeight={() => OPTION_HEIGHT}
            computeCustomText={(option) => option.value.name}
            renderContent={(getSelectedOption, getFlags) => (
                <PageSelectContent flags={getFlags}>{getSelectedOption()?.value.name ?? PLACEHOLDER}</PageSelectContent>
            )}
            renderOption={(getOption, getFlags) => (
                <PageSelectOptionContent isGliding flags={getFlags} description={() => getOption().value.description}>
                    {getOption().value.name}
                </PageSelectOptionContent>
            )}
            renderPopup={renderSelectPopup}
        />
    );
};
