import { Select, access } from "@thewaver/ss-components";
import type { MaybeAccessor } from "@thewaver/ss-components";

import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectGroupContent } from "../../../StyledComponents/SelectGroupContent/SelectGroupContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES, PLACEHOLDER, renderSelectPopup } from "../SelectPage.const";
import type { SelectExampleProps } from "../SelectPage.types";

type Props = SelectExampleProps & {
    isDisabled?: MaybeAccessor<boolean>;
    hasError?: MaybeAccessor<boolean>;
    hasGroups?: MaybeAccessor<boolean>;
};

export const CountriesExample = (props: Props) => {
    return (
        <Select
            valueSignal={props.valueSignal}
            options={props.options ?? (() => COUNTRIES)}
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            ariaLabel={"Country"}
            renderContent={(getSelectedOption, getFlags) => (
                <PageSelectContent flags={getFlags}>{getSelectedOption()?.value ?? PLACEHOLDER}</PageSelectContent>
            )}
            renderGroup={
                access(props.hasGroups)
                    ? (getGroup) => <PageSelectGroupContent>{getGroup().label}</PageSelectGroupContent>
                    : undefined
            }
            renderOption={(getOption, getFlags) => (
                <PageSelectOptionContent flags={getFlags}>{getOption().value}</PageSelectOptionContent>
            )}
            renderPopup={renderSelectPopup}
        />
    );
};
