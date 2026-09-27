import { Menu } from "@thewaver/ss-components-react";

import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { VIEW_OPTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const";
import type { Action, MenuExampleProps } from "../MenuPage.types";

type Props = MenuExampleProps & { checkedState: readonly [Action[], (checked: Action[]) => void] };

export const StatefulExample = (props: Props) => {
    return (
        <Menu
            items={VIEW_OPTIONS}
            ariaLabel={"View options"}
            checkedState={props.checkedState}
            renderContent={(flags) => <PageMenuTriggerContent flags={flags}>View</PageMenuTriggerContent>}
            renderItem={renderMenuItem}
            renderPopup={renderMenuPopup}
            onActivate={props.onActivate}
        />
    );
};
