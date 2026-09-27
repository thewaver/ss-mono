import type { RadioOptionalExampleProps } from "../RadioPage.types";
import { DefaultExample } from "./Default";

type Props = RadioOptionalExampleProps;

export const RightToLeftExample = (props: Props) => {
    return (
        <div dir={"rtl"}>
            <DefaultExample valueSignal={props.valueSignal} />
        </div>
    );
};
