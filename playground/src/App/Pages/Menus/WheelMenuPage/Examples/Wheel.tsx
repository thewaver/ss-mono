import { Show } from "solid-js";

import { PlacementUtils, WheelMenu, access } from "@thewaver/ss-components";
import type { PlacementRect } from "@thewaver/ss-components";

import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import type { WheelMenuExampleProps } from "../WheelMenuPage.types";

import * as styles from "../WheelMenuPage.css";

const HALF = 0.5;
const SUBMENU_MARK = "›";
const CLOSER_MARK = "✕";

const toViewBox = (rect: PlacementRect) =>
    `${rect.left - rect.width * HALF} ${rect.top - rect.height * HALF} ${rect.width} ${rect.height}`;

export const WheelExample = (props: WheelMenuExampleProps) => {
    return (
        <div class={styles.stage}>
            <WheelMenu
                items={() => props.items}
                ariaLabel={"Edit actions"}
                spreadDegrees={props.spreadDegrees}
                layoutDefs={props.layoutDefs}
                placement={() => ({ x: "center", y: "center" })}
                closerDefs={{
                    ariaLabel: "Close the wheel",
                    renderContent: (getFlags) => (
                        <div
                            class={styles.closer}
                            classList={{ [styles.closerHighlighted]: getFlags().isHighlighted }}
                            aria-hidden={"true"}
                        >
                            {CLOSER_MARK}
                        </div>
                    ),
                }}
                renderContent={(getFlags) => (
                    <PageMenuTriggerContent flags={getFlags}>{access(props.caption)}</PageMenuTriggerContent>
                )}
                renderItem={(getItem, getFlags, getPlacement) => (
                    <Show when={getPlacement()?.sector}>
                        {(getSector) => (
                            <>
                                <svg class={styles.canvas} viewBox={toViewBox(getPlacement()!)} aria-hidden={"true"}>
                                    <path
                                        class={styles.wedge}
                                        classList={{
                                            [styles.wedgeHighlighted]: getFlags().isHighlighted,
                                            [styles.wedgeDisabled]: getFlags().isDisabled,
                                        }}
                                        d={PlacementUtils.getSectorPath(getSector())}
                                    />
                                </svg>

                                <div
                                    class={styles.label}
                                    classList={{ [styles.labelHighlighted]: getFlags().isHighlighted }}
                                >
                                    <span>{getItem().value.name}</span>

                                    <Show when={getItem().value.shortcut}>
                                        {(getShortcut) => <span class={styles.shortcut}>{getShortcut()}</span>}
                                    </Show>

                                    <Show when={getFlags().hasSubmenu}>
                                        <span aria-hidden={"true"}>{SUBMENU_MARK}</span>
                                    </Show>
                                </div>
                            </>
                        )}
                    </Show>
                )}
                renderPopup={(renderItems, getVisibilityTarget, getTransitionDurationMs) => (
                    <div
                        class={styles.layer}
                        classList={{ [styles.layerVisible]: getVisibilityTarget() === 1 }}
                        style={{
                            transition: `opacity ${getTransitionDurationMs()}ms, transform ${getTransitionDurationMs()}ms`,
                        }}
                    >
                        {renderItems()}
                    </div>
                )}
                onActivate={props.onActivate}
            />
        </div>
    );
};
