import { useState } from "react";

import { SWITCHED_DIRECTION_TABS } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageCheckField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import type { TabsExampleProps } from "../TabsPageReact.types";
import { RowExample } from "./Row";

type Props = TabsExampleProps;

export const SwitchedDirectionExample = (props: Props) => {
    const [isRightToLeft, setIsRightToLeft] = useState(false);

    return (
        <div dir={isRightToLeft ? "rtl" : "ltr"}>
            <RowExample
                selectedValue={props.selectedValue}
                tabs={SWITCHED_DIRECTION_TABS}
                idPrefix={"switchedDirection"}
                onSelectionChange={props.onSelectionChange}
            />

            <PageExampleKnobs>
                <PageProp
                    itemKey={"isRightToLeft"}
                    label={"Right to left"}
                    hint={
                        "Switches the box around the tabs between right-to-left and left-to-right while they are on screen."
                    }
                    controls={"Sets dir on the box around the tabs"}
                >
                    <PageCheckField value={isRightToLeft} ariaLabel={"Right to left"} onChange={setIsRightToLeft} />
                </PageProp>
            </PageExampleKnobs>
        </div>
    );
};
