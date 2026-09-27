import { TextInput } from "@thewaver/ss-components-solid";
import { PIN_LENGTH } from "@thewaver/ss-playground-core/App/Pages/TextInputPage/TextInputPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground-core/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { TextInputExampleProps } from "../TextInputPage.types";

type Props = TextInputExampleProps;

export const RefusingSetterExample = (props: Props) => (
    <TextInput
        valueSignal={props.valueSignal}
        padding={() => FIELD_PADDING}
        gap={() => FIELD_GAP}
        ariaLabel={"PIN"}
        inputMode={"numeric"}
        hasError={() => props.valueSignal[0]().length > 0 && props.valueSignal[0]().length < PIN_LENGTH}
        onInput={(value) => {
            props.valueSignal[1](value.replace(/\D/g, "").slice(0, PIN_LENGTH));
        }}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} />}
        renderPlaceholder={(getFlags) => (
            <PageTextFieldPlaceholder flags={getFlags}>Digits only</PageTextFieldPlaceholder>
        )}
    />
);
