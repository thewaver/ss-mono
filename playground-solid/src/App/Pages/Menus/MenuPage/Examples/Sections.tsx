import type { Signal } from "solid-js";

import { Menu } from "@thewaver/ss-components-solid";
import { SECTIONED_VIEW_OPTIONS } from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuActions.const";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuGroupBox } from "../../../../StyledComponents/MenuItemContent/MenuItemContent";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { PageSelectGroupContent } from "../../../../StyledComponents/SelectGroupContent/SelectGroupContent";
import { renderMenuItem, renderMenuPopup } from "../MenuPageSolid.const";
import type { Action, MenuExampleProps } from "../MenuPageSolid.types";

type Props = MenuExampleProps & { checked: Signal<Action[]> };

export const SectionsExample = (props: Props) => {
    return (
        <Menu
            renderHighlightFloater={renderPageHighlightFloater}
            items={SECTIONED_VIEW_OPTIONS}
            ariaLabel={"View options"}
            checked={props.checked}
            renderContent={(getFlags) => <PageMenuTriggerContent flags={getFlags}>View</PageMenuTriggerContent>}
            renderItem={renderMenuItem}
            renderGroupHeader={(getGroup) => <PageSelectGroupContent>{getGroup().label}</PageSelectGroupContent>}
            renderGroupBox={(renderContent) => <PageMenuGroupBox>{renderContent()}</PageMenuGroupBox>}
            renderPopup={renderMenuPopup}
            onActivate={props.onActivate}
        />
    );
};
