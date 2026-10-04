import { Fragment, type ReactNode } from "react";

import { SPINE_DEFAULTS, type SpineSide, SpineStyles, SpineUtils } from "@thewaver/ss-components";

import type { SpineProps } from "./Spine.types";

const toMs = (value: number | undefined) => (value === undefined ? undefined : `${value}ms`);

export const Spine = <T,>(props: SpineProps<T>) => {
    const axis = props.axis ?? SPINE_DEFAULTS.axis;
    const faceCount = props.faces.length;
    const hasBacks = props.hasBacks ?? SPINE_DEFAULTS.hasBacks;
    const perspectivePx = props.perspectivePx ?? SPINE_DEFAULTS.perspectivePx;

    const renderSpineFace = (item: T, index: number, side: SpineSide): ReactNode => {
        const distance = SpineUtils.getDistance(index, props.position);
        const angle = props.computeFaceAngle({ distance, index, count: faceCount });
        const defs = props.computeFaceDefs(index, side, angle);

        return (
            <div
                key={side}
                className={SpineStyles.spineFace}
                style={{
                    transform: SpineUtils.getFaceTransform(
                        axis,
                        side,
                        angle,
                        SpineUtils.getStackOffset(distance, faceCount),
                    ),
                    transitionDuration: toMs(props.transitionDurationMs),
                    transitionDelay: toMs(props.transitionDelayMs),
                }}
                role="group"
                aria-roledescription={props.faceRoleDescription}
                aria-label={defs.ariaLabel}
                aria-hidden={defs.isHidden ? "true" : undefined}
                inert={defs.isHidden}
            >
                {props.renderFace(item, index, side)}
            </div>
        );
    };

    return (
        <div
            className={SpineStyles.spineRoot}
            style={{
                width: props.faceSize === undefined ? undefined : `${props.faceSize.width}px`,
                height: props.faceSize === undefined ? undefined : `${props.faceSize.height}px`,
                perspective: `${perspectivePx}px`,
            }}
        >
            <div className={SpineStyles.spineBody}>
                {props.faces.map((item, index) => (
                    <Fragment key={index}>
                        {renderSpineFace(item, index, "front")}

                        {hasBacks && renderSpineFace(item, index, "back")}
                    </Fragment>
                ))}
            </div>
        </div>
    );
};
