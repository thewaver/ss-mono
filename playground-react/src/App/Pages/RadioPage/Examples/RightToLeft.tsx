import type { RadioOptionalExampleProps } from "../RadioPageReact.types";
import { DefaultExample } from "./Default";

type Props = RadioOptionalExampleProps;

export const RightToLeftExample = (props: Props) => {
    return (
        <div dir={"rtl"}>
            <DefaultExample value={props.value} />
        </div>
    );
};
