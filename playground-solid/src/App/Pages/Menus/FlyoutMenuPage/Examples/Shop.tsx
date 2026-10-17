import { FlyoutMenu } from "@thewaver/ss-components-solid";
import { OVERFLOW_CAPTION } from "@thewaver/ss-playground/App/Pages/Menus/FlyoutMenuPage/FlyoutMenuPage.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FlyoutMenuContent/FlyoutMenuContent.css";

import { PageLayer } from "../../../../PageComponents/Layer/Layer";
import {
    PageFlyoutMenuLink,
    PageFlyoutMenuOverflowToggle,
    PageFlyoutMenuToggle,
} from "../../../../StyledComponents/FlyoutMenuContent/FlyoutMenuContent";
import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PagePopoverSurface } from "../../../../StyledComponents/PopoverSurface/PopoverSurface";
import type { FlyoutMenuExampleProps } from "../FlyoutMenuPageSolid.types";

const OFFSET = { x: 0, y: 6 };

type Props = FlyoutMenuExampleProps;

export const ShopExample = (props: Props) => (
    <FlyoutMenu
        entries={props.entries}
        ariaLabel={"Shop"}
        offset={OFFSET}
        hoverShowDelayMs={props.hoverShowDelayMs}
        transitionDurationMs={props.transitionDurationMs}
        computeToggleLabel={(value) => `${value} submenu`}
        renderLink={(getLink, getFlags) => <PageFlyoutMenuLink flags={getFlags}>{getLink().value}</PageFlyoutMenuLink>}
        renderToggle={(_getEntry, getFlags) => <PageFlyoutMenuToggle flags={getFlags} />}
        renderOverflowToggle={(getFlags) => (
            <PageFlyoutMenuOverflowToggle flags={getFlags}>{OVERFLOW_CAPTION}</PageFlyoutMenuOverflowToggle>
        )}
        renderHighlightFloater={renderPageHighlightFloater}
        renderPanel={(renderLinks, getVisibilityTarget, getTransitionDurationMs, getPlacement, getSize) => (
            <PageLayer level={2}>
                <PagePopoverSurface
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                    placement={getPlacement}
                >
                    <div
                        class={styles.flyoutMenuPanelBody}
                        style={{
                            width: getSize() ? `${getSize()!.width}px` : undefined,
                            height: getSize() ? `${getSize()!.height}px` : undefined,
                            transition: `width ${getTransitionDurationMs()}ms ease, height ${getTransitionDurationMs()}ms ease`,
                        }}
                    >
                        {renderLinks()}
                    </div>
                </PagePopoverSurface>
            </PageLayer>
        )}
    />
);
