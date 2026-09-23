import { RIGHT_TO_LEFT_TABS } from "../TabsPage.const";
import type { TabsExampleProps } from "../TabsPage.types";
import { RowExample } from "./Row";

type Props = TabsExampleProps;

export const RightToLeftExample = (props: Props) => {
    return (
        <div dir={"rtl"}>
            <RowExample
                selectedValue={props.selectedValue}
                tabs={() => RIGHT_TO_LEFT_TABS}
                idPrefix={"rtl"}
                onSelectionChange={props.onSelectionChange}
            />
        </div>
    );
};
