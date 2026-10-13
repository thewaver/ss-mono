import type { MenuExampleProps } from "../MenuPageSolid.types";
import { SubmenusExample } from "./Submenus";

type Props = MenuExampleProps;

export const RightToLeftExample = (props: Props) => {
    return (
        <div dir={"rtl"}>
            <SubmenusExample onActivate={props.onActivate} />
        </div>
    );
};
