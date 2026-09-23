import { Show, createMemo, createSignal } from "solid-js";

import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import { InteractionTrackerUtils } from "../../Abstracts/InteractionTracker/InteractionTracker.utils";
import { Tooltip } from "../../Essentials/Tooltip/Tooltip";
import { access } from "../../Utils/propUtils";
import { INTERACTION_WRAPPER_DEFAULTS } from "./InteractionWrapper.const";
import type { InteractionWrapperProps } from "./InteractionWrapper.types";

import * as styles from "./InteractionWrapper.css";

export const InteractionWrapper = <TExtra extends object = {}>(props: InteractionWrapperProps<TExtra>) => {
    const [getElementRef, setElementRef] = createSignal<HTMLElement>();

    const getSizing = createMemo(() => access(props.sizing) ?? INTERACTION_WRAPPER_DEFAULTS.sizing);

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getTooltipDefs = createMemo(() => access(props.tooltipDefs));

    const getIsReachable = createMemo(() =>
        InteractionTrackerUtils.computeIsReachable(
            getIsDisabled(),
            access(props.isReachableWhenDisabled) ?? false,
            access(props.isFocusableWhenDisabled) ?? false,
        ),
    );

    const { getFlags: getInternalFlags } = InteractionTrackerUtils.wrapElement(getElementRef, getIsDisabled, {
        getIsReachable,
        getIsTabbable: props.isTabbable === undefined ? undefined : () => access(props.isTabbable)!,
    });

    const getIsActivationUntracked = createMemo(() => getIsDisabled() || props.onActivation === undefined);

    InteractionTrackerUtils.trackActivation(getElementRef, getIsActivationUntracked, (activation) =>
        props.onActivation?.(activation),
    );

    const getFlags = createMemo((): InteractionFlags<TExtra> => ({
        ...getInternalFlags(),
        isDisabled: getIsDisabled(),
        isPressed: access(props.isPressed),
        hasError: access(props.hasError),
        ...(access(props.extraFlags) ?? ({} as TExtra)),
    }));

    return (
        <div
            class={[styles.interactionRoot, styles.interactionSizingVariants[getSizing()]].join(" ")}
            role={access(props.role) ?? INTERACTION_WRAPPER_DEFAULTS.role}
            style={{
                "min-width": access(props.minWidth) ? `${access(props.minWidth)}px` : undefined,
                "min-height": access(props.minHeight) ? `${access(props.minHeight)}px` : undefined,
            }}
            classList={{
                [styles.interactionDisabled]: getIsDisabled(),
                [styles.interactionError]: access(props.hasError),
                [styles.interactionPressed]: access(props.isPressed),
            }}
        >
            {props.renderControl((element) => {
                setElementRef(element);
                props.ref?.(element);
            }, getFlags)}

            {props.renderDecoration && (
                <div class={styles.interactionDecorationWrapper}>{props.renderDecoration(getFlags)}</div>
            )}

            <Show when={getTooltipDefs()}>
                {(getDefs) => (
                    <Tooltip
                        {...getDefs()}
                        renderContent={(getVisibilityTarget, getTransitionDurationMs, getPlacement) =>
                            getDefs().renderContent(
                                getVisibilityTarget,
                                getTransitionDurationMs,
                                getPlacement,
                                getFlags,
                            )
                        }
                        anchorRef={getElementRef}
                    />
                )}
            </Show>
        </div>
    );
};
