import { FanMenu } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.css";

import { PageLayer } from "../../../../PageComponents/Layer/Layer";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import type { FanMenuExampleProps } from "../FanMenuPage.types";

const BACK_MARK = "‹";
const SUBMENU_MARK = "›";

export const FanExample = (props: FanMenuExampleProps) => {
    return (
        <div className={styles.stage}>
            <FanMenu
                layoutSize={"192px"}
                layoutDefs={{ curveHeightRatio: 1, itemWidthRatio: 0.5, itemHeightRatio: 0.2381 }}
                items={props.items}
                ariaLabel={"Edit actions"}
                placement={{ x: "center", y: "center" }}
                renderContent={(flags) => (
                    <PageMenuTriggerContent flags={flags}>{props.caption}</PageMenuTriggerContent>
                )}
                renderItem={(item, flags) => {
                    const shortcut = !flags.isBack && item.value.shortcut;

                    return (
                        <div
                            className={[
                                styles.item,
                                flags.isBack && styles.itemBack,
                                flags.isHighlighted && styles.itemHighlighted,
                                flags.isDisabled && styles.itemDisabled,
                            ]
                                .filter(Boolean)
                                .join(" ")}
                        >
                            {flags.isBack && <span aria-hidden={"true"}>{BACK_MARK}</span>}

                            <span>{item.value.name}</span>

                            {shortcut && <span className={styles.shortcut}>{shortcut}</span>}

                            {flags.hasSubmenu && <span aria-hidden={"true"}>{SUBMENU_MARK}</span>}
                        </div>
                    );
                }}
                renderHighlightFloater={(visibilityTarget, transitionDurationMs) => (
                    <div
                        className={[styles.itemFloater, visibilityTarget === 1 && styles.itemFloaterVisible]
                            .filter(Boolean)
                            .join(" ")}
                        style={{ transitionDuration: `${transitionDurationMs}ms` }}
                        data-floater={"highlight"}
                    />
                )}
                renderPopup={(renderItems, visibilityTarget, transitionDurationMs) => (
                    <div
                        className={[styles.layer, visibilityTarget === 1 && styles.layerVisible]
                            .filter(Boolean)
                            .join(" ")}
                        style={{
                            transition: `opacity ${transitionDurationMs}ms, transform ${transitionDurationMs}ms`,
                        }}
                    >
                        <PageLayer level={2}>{renderItems()}</PageLayer>
                    </div>
                )}
                onActivate={props.onActivate}
            />
        </div>
    );
};
