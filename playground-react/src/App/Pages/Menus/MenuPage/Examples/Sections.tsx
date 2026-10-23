import { Menu } from "@thewaver/ss-components-react";
import { SECTIONED_VIEW_OPTIONS } from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuActions.const";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuGroupBox } from "../../../../StyledComponents/MenuItemContent/MenuItemContent";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { PageSelectGroupContent } from "../../../../StyledComponents/SelectGroupContent/SelectGroupContent";
import { renderMenuItem, renderMenuPopup } from "../MenuPageReact.const";
import type { Action, MenuExampleProps } from "../MenuPageReact.types";

type Props = MenuExampleProps & { checked: readonly [Action[], (checked: Action[]) => void] };

export const SectionsExample = (props: Props) => {
    return (
        <Menu
            renderHighlightFloater={renderPageHighlightFloater}
            items={SECTIONED_VIEW_OPTIONS}
            ariaLabel={"View options"}
            checked={props.checked}
            renderContent={(flags) => <PageMenuTriggerContent flags={flags}>View</PageMenuTriggerContent>}
            renderItem={renderMenuItem}
            renderGroupHeader={(group) => <PageSelectGroupContent>{group.label}</PageSelectGroupContent>}
            renderGroupBox={(renderContent) => <PageMenuGroupBox>{renderContent()}</PageMenuGroupBox>}
            renderPopup={renderMenuPopup}
            onActivate={props.onActivate}
        />
    );
};
