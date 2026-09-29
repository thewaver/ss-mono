import { TextInput } from "@thewaver/ss-components-solid";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { TextInputExampleProps } from "../TextInputPage.types";

type Props = TextInputExampleProps;

export const TransformingSetterExample = (props: Props) => (
    <TextInput
        value={props.value}
        padding={() => FIELD_PADDING}
        gap={() => FIELD_GAP}
        ariaLabel={"Coupon code"}
        onInput={(value) => {
            props.value[1](value.toLocaleUpperCase());
        }}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} />}
        renderPlaceholder={(getFlags) => (
            <PageTextFieldPlaceholder flags={getFlags}>Coupon code (upper-cased)</PageTextFieldPlaceholder>
        )}
    />
);
