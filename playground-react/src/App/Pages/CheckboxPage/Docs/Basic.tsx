import { useState } from "react";

import { Checkbox } from "@thewaver/ss-components-react";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import type { CheckboxBasicDocsExampleProps } from "../CheckboxPageReact.types";

type Props = CheckboxBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const checkedState = useState(false);

    return (
        <Checkbox
            checked={checkedState}
            hasError={props.hasError}
            isDisabled={props.isDisabled}
            ariaLabel={"Default checkbox"}
            renderContent={(flags) => <PageCheckboxContent flags={flags}>Default checkbox</PageCheckboxContent>}
        />
    );
};
