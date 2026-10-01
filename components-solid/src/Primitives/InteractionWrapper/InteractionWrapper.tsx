import { Show, createMemo, createSignal } from "solid-js";

import {
    INTERACTION_WRAPPER_DEFAULTS,
    type InteractionFlags,
    InteractionTrackerUtils,
    InteractionWrapperStyles as styles,
} from "@thewaver/ss-components";

import { InteractionTrackerSolidUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerSolid.utils";
import { Tooltip } from "../../Essentials/Overlays/Tooltip/Tooltip";
import { access } from "../../Utils/propUtils";
import type { InteractionWrapperProps } from "./InteractionWrapperSolid.types";

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

    const { getFlags: getInternalFlags } = InteractionTrackerSolidUtils.wrapElement(getElementRef, getIsDisabled, {
        getIsReachable,
        getIsTabbable: props.isTabbable === undefined ? undefined : () => access(props.isTabbable)!,
    });

    const getIsActivationUntracked = createMemo(() => getIsDisabled() || props.onActivation === undefined);

    InteractionTrackerSolidUtils.trackActivation(getElementRef, getIsActivationUntracked, (activation) =>
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
