import { Checkbox } from "@thewaver/ss-components-solid";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import type { CheckboxExampleProps } from "../CheckboxPage.types";

type Props = CheckboxExampleProps;

export const ErroredExample = (props: Props) => (
    <Checkbox
        checked={props.checked}
        ariaLabel={"Errored checkbox"}
        hasError={() => !props.checked[0]()}
        renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
    />
);
