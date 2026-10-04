import { Menu } from "@thewaver/ss-components-solid";

import { PageGlideFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuItemContent } from "../../../../StyledComponents/MenuItemContent/MenuItemContent";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { ACTIONS, renderMenuPopup } from "../MenuPage.const";
import type { MenuExampleProps } from "../MenuPage.types";

type Props = MenuExampleProps;

export const GlideExample = (props: Props) => {
    return (
        <Menu
            items={() => ACTIONS}
            ariaLabel={"Edit actions, gliding"}
            renderContent={(getFlags) => <PageMenuTriggerContent flags={getFlags}>{"Edit"}</PageMenuTriggerContent>}
            renderItem={(getItem, getFlags) => (
                <PageMenuItemContent
                    flags={() => ({ ...getFlags(), isHovered: false, isHighlighted: false })}
                    kind={() => getItem().kind}
                    shortcut={() => getItem().value.shortcut ?? ""}
                >
                    {getItem().value.name}
                </PageMenuItemContent>
            )}
            renderHighlightFloater={(getVisibilityTarget, getTransitionDurationMs) => (
                <PageGlideFloater
                    kind={"highlight"}
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                />
            )}
            renderPopup={renderMenuPopup}
            onActivate={props.onActivate}
        />
    );
};
