import { createSignal } from "solid-js";

import { Button, Menu } from "@thewaver/ss-components-solid";

import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const";
import type { MenuDrivenExampleProps } from "../MenuPage.types";

type Props = MenuDrivenExampleProps;

export const DrivenExample = (props: Props) => {
    const [getAnchorRef, setAnchorRef] = createSignal<HTMLElement>();

    return (
        <>
            <Menu
                renderHighlightFloater={renderPageHighlightFloater}
                visibility={props.visibility}
                anchorRef={getAnchorRef}
                items={() => ACTIONS}
                ariaLabel={"Edit actions"}
                renderContent={(getFlags) => <PageMenuTriggerContent flags={getFlags}>Edit</PageMenuTriggerContent>}
                renderItem={renderMenuItem}
                renderPopup={renderMenuPopup}
                onActivate={props.onActivate}
            />

            <Button
                ref={setAnchorRef}
                id={"menuToggle"}
                ariaLabel={"Toggle the menu from outside"}
                renderContent={(getFlags) => (
                    <PageButtonContent flags={getFlags}>
                        {props.visibility[0]() ? "Close it" : "Open it"}
                    </PageButtonContent>
                )}
                onClick={() => {
                    props.visibility[1]((prev) => !prev);
                }}
            />
        </>
    );
};
