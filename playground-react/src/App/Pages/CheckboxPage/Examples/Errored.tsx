import { Checkbox } from "@thewaver/ss-components-react";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import type { CheckboxExampleProps } from "../CheckboxPage.types";

type Props = CheckboxExampleProps;

export const ErroredExample = (props: Props) => (
    <Checkbox
        checkedState={props.checkedState}
        ariaLabel={"Errored checkbox"}
        hasError={!props.checkedState[0]}
        renderContent={(flags) => <PageCheckboxContent flags={flags} />}
    />
);
