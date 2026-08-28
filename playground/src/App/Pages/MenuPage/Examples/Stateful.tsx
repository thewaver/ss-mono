import type { Signal } from "solid-js";

import { Menu } from "@thewaver/ss-components";

import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { VIEW_OPTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const";
import type { Action, MenuExampleProps } from "../MenuPage.types";

type Props = MenuExampleProps & { checkedSignal: Signal<Action[]> };

export const StatefulExample = (props: Props) => {
    return (
        <Menu
            items={() => VIEW_OPTIONS}
            ariaLabel={"View options"}
            checkedSignal={props.checkedSignal}
            renderContent={(getFlags) => <PageMenuTriggerContent flags={getFlags}>View</PageMenuTriggerContent>}
            renderItem={renderMenuItem}
            renderPopup={renderMenuPopup}
            onActivate={props.onActivate}
        />
    );
};
