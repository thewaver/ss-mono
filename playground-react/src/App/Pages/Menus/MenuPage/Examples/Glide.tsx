import { Menu } from "@thewaver/ss-components-react";

import { PageGlideFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuItemContent } from "../../../../StyledComponents/MenuItemContent/MenuItemContent";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { ACTIONS, renderMenuPopup } from "../MenuPage.const";
import type { MenuExampleProps } from "../MenuPage.types";

type Props = MenuExampleProps;

export const GlideExample = (props: Props) => {
    return (
        <Menu
            items={ACTIONS}
            ariaLabel={"Edit actions, gliding"}
            renderContent={(flags) => <PageMenuTriggerContent flags={flags}>{"Edit"}</PageMenuTriggerContent>}
            renderItem={(item, flags) => (
                <PageMenuItemContent
                    flags={{ ...flags, isHovered: false, isHighlighted: false }}
                    kind={item.kind}
                    shortcut={item.value.shortcut ?? ""}
                >
                    {item.value.name}
                </PageMenuItemContent>
            )}
            renderHighlightFloater={(visibilityTarget, transitionDurationMs) => (
                <PageGlideFloater
                    kind={"highlight"}
                    visibilityTarget={visibilityTarget}
                    transitionDurationMs={transitionDurationMs}
                />
            )}
            renderPopup={renderMenuPopup}
            onActivate={props.onActivate}
        />
    );
};
