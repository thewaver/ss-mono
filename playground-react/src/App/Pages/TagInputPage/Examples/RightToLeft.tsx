import type { TagInputExampleProps } from "../TagInputPage.types";
import { DefaultExample } from "./Default";

type Props = TagInputExampleProps;

export const RightToLeftExample = (props: Props) => {
    return (
        <div dir={"rtl"}>
            <DefaultExample
                value={props.value}
                isDisabled={props.isDisabled}
                hasError={props.hasError}
                ariaLabel={"Topics in a right-to-left box"}
            />
        </div>
    );
};
