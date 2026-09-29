import type { TreeExampleProps } from "../TreePage.types";
import { FilesExample } from "./Files";

type Props = TreeExampleProps;

export const RightToLeftExample = (props: Props) => {
    return (
        <div dir={"rtl"}>
            <FilesExample value={props.value} expanded={props.expanded} />
        </div>
    );
};
