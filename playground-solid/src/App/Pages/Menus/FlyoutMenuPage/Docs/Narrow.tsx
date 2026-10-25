import { createMemo } from "solid-js";

import { useLocation } from "@solidjs/router";
import { FlyoutMenu } from "@thewaver/ss-components-solid";
import type { FlyoutMenuEntryRecord } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    NOTHING_FOLLOWED,
    OVERFLOW_CAPTION,
    SHOP_ENTRIES,
} from "@thewaver/ss-playground/App/Pages/Menus/FlyoutMenuPage/FlyoutMenuPage.const";
import * as pageStyles from "@thewaver/ss-playground/App/Pages/Menus/FlyoutMenuPage/FlyoutMenuPage.css";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FlyoutMenuContent/FlyoutMenuContent.css";

import { PageLayer } from "../../../../PageComponents/Layer/Layer";
import {
    PageFlyoutMenuLink,
    PageFlyoutMenuOverflowToggle,
    PageFlyoutMenuToggle,
} from "../../../../StyledComponents/FlyoutMenuContent/FlyoutMenuContent";
import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PagePopoverSurface } from "../../../../StyledComponents/PopoverSurface/PopoverSurface";

const OFFSET = { x: 0, y: 6 };

export const NarrowDocsExample = () => {
    const location = useLocation();

    const getEntries = createMemo((): FlyoutMenuEntryRecord<string>[] =>
        SHOP_ENTRIES.map((entry) => ({
            ...entry,
            isCurrent: entry.href === location.hash,
            links: entry.links?.map((link) => ({ ...link, isCurrent: link.href === location.hash })),
        })),
    );

    return (
        <>
            <div class={pageStyles.narrowFrame}>
                <FlyoutMenu
                    entries={getEntries}
                    ariaLabel={"Narrow shop"}
                    offset={OFFSET}
                    computeToggleLabel={(value) => `${value} submenu`}
                    renderLink={(getLink, getFlags) => (
                        <PageFlyoutMenuLink flags={getFlags}>{getLink().value}</PageFlyoutMenuLink>
                    )}
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
            </div>

            <div
                class={exampleStyles.exampleReadout}
                data-readout
            >{`Followed: ${location.hash || NOTHING_FOLLOWED}`}</div>
        </>
    );
};
