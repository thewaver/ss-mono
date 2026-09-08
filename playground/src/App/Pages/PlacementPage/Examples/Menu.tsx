import { Show } from "solid-js";

import { PlacementUtils, WheelMenu } from "@thewaver/ss-components";
import type { PlacementRect, WheelMenuItem } from "@thewaver/ss-components";

import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import type { PlacementExampleProps } from "../PlacementPage.types";

import * as styles from "../PlacementPage.css";

const HALF = 0.5;
const CLOSER_MARK = "✕";
const SUBMENU_MARK = "›";

const ACTIONS: WheelMenuItem<string>[] = [
    { value: "New", items: [{ value: "Project" }, { value: "Sketch" }, { value: "Import" }] },
    { value: "Open" },
    { value: "Share", items: [{ value: "Copy link" }, { value: "Email" }] },
    { value: "Delete" },
];

const toViewBox = (rect: PlacementRect) =>
    `${rect.left - rect.width * HALF} ${rect.top - rect.height * HALF} ${rect.width} ${rect.height}`;

export const MenuExample = (props: PlacementExampleProps) => {
    return (
        <div class={styles.stage}>
            <WheelMenu
                items={() => ACTIONS}
                ariaLabel={"File actions"}
                layoutDefs={props.getLayoutDefs()}
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
                    <PageMenuTriggerContent flags={getFlags}>{"Wheel"}</PageMenuTriggerContent>
                )}
                renderItem={(getItem, getFlags, getPlacement) => (
                    <Show when={getPlacement()?.sector}>
                        {(getSector) => (
                            <>
                                <svg class={styles.canvas} viewBox={toViewBox(getPlacement()!)} aria-hidden={"true"}>
                                    <path
                                        class={styles.wedge}
                                        classList={{ [styles.wedgeHighlighted]: getFlags().isHighlighted }}
                                        d={PlacementUtils.getSectorPath(getSector())}
                                    />
                                </svg>

                                <div
                                    class={styles.label}
                                    classList={{ [styles.labelHighlighted]: getFlags().isHighlighted }}
                                >
                                    <span>{getItem().value}</span>

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
                onActivate={() => undefined}
            />
        </div>
    );
};
