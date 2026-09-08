import { Show } from "solid-js";

import { Menu, access } from "@thewaver/ss-components";
import type { MaybeAccessor, MenuLayoutFn } from "@thewaver/ss-components";

import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { ACTIONS } from "../MenuPage.const";
import type { MenuExampleProps } from "../MenuPage.types";

import * as styles from "../MenuPage.css";

type Props = MenuExampleProps & { computeLayout: MaybeAccessor<MenuLayoutFn>; caption: MaybeAccessor<string> };

export const LaidOutExample = (props: Props) => {
    return (
        <div class={styles.laidOutStage}>
            <Menu
                items={() => ACTIONS}
                ariaLabel={"Edit actions"}
                computeLayout={(itemCount) => access(props.computeLayout)(itemCount)}
                placement={() => ({ x: "center", y: "center" })}
                renderContent={(getFlags) => (
                    <PageMenuTriggerContent flags={getFlags}>{access(props.caption)}</PageMenuTriggerContent>
                )}
                renderItem={(getItem, getFlags) => (
                    <div
                        class={styles.laidOutItem}
                        classList={{
                            [styles.laidOutItemHighlighted]: getFlags().isHighlighted,
                            [styles.laidOutItemDisabled]: getFlags().isDisabled,
                        }}
                    >
                        <span>{getItem().value.name}</span>

                        <Show when={getItem().value.shortcut}>
                            {(getShortcut) => <span class={styles.laidOutShortcut}>{getShortcut()}</span>}
                        </Show>
                    </div>
                )}
                renderPopup={(renderItems, getVisibilityTarget, getTransitionDurationMs) => (
                    <div
                        class={styles.laidOutLayer}
                        classList={{ [styles.laidOutLayerVisible]: getVisibilityTarget() === 1 }}
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
