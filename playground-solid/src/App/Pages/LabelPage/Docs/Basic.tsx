import { createSignal } from "solid-js";

import { Checkbox, Label } from "@thewaver/ss-components-solid";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import type { LabelBasicDocsExampleProps } from "../LabelPageSolid.types";

type Props = LabelBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const checkedSignal = createSignal(false);

    return (
        <Label orientation={props.orientation}>
            <Checkbox
                checked={checkedSignal}
                isDisabled={props.isDisabled}
                renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
            />

            <PageLabelCaption id={"rememberCaption"}>Remember me</PageLabelCaption>
        </Label>
    );
};
