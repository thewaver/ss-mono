import { Menu, access } from "@thewaver/ss-components";
import type { MaybeAccessor, MenuItem } from "@thewaver/ss-components";

import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const";
import type { Action, MenuExampleProps } from "../MenuPage.types";

type Props = MenuExampleProps & { items?: MaybeAccessor<MenuItem<Action>[]>; caption?: MaybeAccessor<string> };

export const DefaultExample = (props: Props) => {
    return (
        <Menu
            items={props.items ?? (() => ACTIONS)}
            ariaLabel={"Edit actions"}
            renderContent={(getFlags) => (
                <PageMenuTriggerContent flags={getFlags}>{access(props.caption) ?? "Edit"}</PageMenuTriggerContent>
            )}
            renderItem={renderMenuItem}
            renderPopup={renderMenuPopup}
            onActivate={props.onActivate}
        />
    );
};
