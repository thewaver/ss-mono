import { TextInput } from "@thewaver/ss-components-solid";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import type { TextInputExampleProps } from "../TextInputPage.types";

type Props = TextInputExampleProps;

export const ErroredExample = (props: Props) => (
    <TextInput
        value={props.value}
        padding={() => FIELD_PADDING}
        gap={() => FIELD_GAP}
        type={"email"}
        hasError={() => !props.value[0]().includes("@")}
        ariaLabel={"Email"}
        autoComplete={"email"}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} />}
    />
);
