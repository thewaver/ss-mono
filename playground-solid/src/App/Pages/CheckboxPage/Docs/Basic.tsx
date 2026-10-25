import { createSignal } from "solid-js";

import { Checkbox } from "@thewaver/ss-components-solid";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import type { CheckboxBasicDocsExampleProps } from "../CheckboxPageSolid.types";

type Props = CheckboxBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const checkedSignal = createSignal(false);

    return (
        <Checkbox
            checked={checkedSignal}
            hasError={props.hasError}
            isDisabled={props.isDisabled}
            ariaLabel={"Default checkbox"}
            renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
        />
    );
};
