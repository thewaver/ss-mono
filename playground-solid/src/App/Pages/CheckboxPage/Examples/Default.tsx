import { Checkbox } from "@thewaver/ss-components-solid";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import type { CheckboxExampleProps } from "../CheckboxPage.types";

type Props = CheckboxExampleProps;

export const DefaultExample = (props: Props) => (
    <Checkbox
        checked={props.checked}
        ariaLabel={"Default checkbox"}
        renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
    />
);
