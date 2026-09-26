import { Show } from "solid-js";

import { FanMenu, access } from "@thewaver/ss-components";

import { PageLayer } from "../../../../PageComponents/Layer/Layer";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import type { FanMenuExampleProps } from "../FanMenuPage.types";

import * as styles from "../FanMenuPage.css";

const BACK_MARK = "‹";
const SUBMENU_MARK = "›";

export const FanExample = (props: FanMenuExampleProps) => {
    return (
        <div class={styles.stage}>
            <FanMenu
                layoutSize={"192px"}
                layoutDefs={{ curveHeightRatio: 1, itemWidthRatio: 0.5, itemHeightRatio: 0.2381 }}
                items={() => props.items}
                ariaLabel={"Edit actions"}
                placement={() => ({ x: "center", y: "center" })}
                renderContent={(getFlags) => (
                    <PageMenuTriggerContent flags={getFlags}>{access(props.caption)}</PageMenuTriggerContent>
                )}
                renderItem={(getItem, getFlags) => (
                    <div
                        class={styles.item}
                        classList={{
                            [styles.itemBack]: getFlags().isBack,
                            [styles.itemHighlighted]: getFlags().isHighlighted,
                            [styles.itemDisabled]: getFlags().isDisabled,
                        }}
                    >
                        <div class={styles.itemFill} aria-hidden={"true"} />

                        <Show when={getFlags().isBack}>
                            <span aria-hidden={"true"}>{BACK_MARK}</span>
                        </Show>

                        <span>{getItem().value.name}</span>

                        <Show when={getItem().value.shortcut && !getFlags().isBack}>
                            {(getShortcut) => <span class={styles.shortcut}>{getShortcut()}</span>}
                        </Show>

                        <Show when={getFlags().hasSubmenu}>
                            <span aria-hidden={"true"}>{SUBMENU_MARK}</span>
                        </Show>
                    </div>
                )}
                renderPopup={(renderItems, getVisibilityTarget, getTransitionDurationMs) => (
                    <div
                        class={styles.layer}
                        classList={{ [styles.layerVisible]: getVisibilityTarget() === 1 }}
                        style={{
                            transition: `opacity ${getTransitionDurationMs()}ms, transform ${getTransitionDurationMs()}ms`,
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
