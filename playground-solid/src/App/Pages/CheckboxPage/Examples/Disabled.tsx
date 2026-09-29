import { Checkbox } from "@thewaver/ss-components-solid";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import type { CheckboxExampleProps } from "../CheckboxPage.types";

type Props = CheckboxExampleProps;

export const DisabledExample = (props: Props) => (
    <Checkbox
        checked={props.checked}
        ariaLabel={"Disabled checkbox"}
        isDisabled={true}
        renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
    />
);
