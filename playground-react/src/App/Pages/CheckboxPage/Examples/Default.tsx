import { Checkbox } from "@thewaver/ss-components-react";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import type { CheckboxExampleProps } from "../CheckboxPage.types";

type Props = CheckboxExampleProps;

export const DefaultExample = (props: Props) => (
    <Checkbox
        checked={props.checked}
        ariaLabel={"Default checkbox"}
        renderContent={(flags) => <PageCheckboxContent flags={flags} />}
    />
);
