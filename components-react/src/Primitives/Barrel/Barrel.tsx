import { Fragment, type ReactNode } from "react";

import { BARREL_DEFAULTS, type BarrelFace, BarrelStyles, BarrelUtils } from "@thewaver/ss-components";

import type { BarrelProps } from "./Barrel.types";

const toMs = (value: number | undefined) => (value === undefined ? undefined : `${value}ms`);

export const Barrel = <T,>(props: BarrelProps<T>) => {
    const axis = props.axis ?? BARREL_DEFAULTS.axis;
    const faceSize = props.faceSize ?? BARREL_DEFAULTS.faceSize;
    const faceCount = props.faces.length;

    const faceExtent = BarrelUtils.getFaceExtent(faceSize, axis);
    const apothem = BarrelUtils.getApothem(faceExtent, faceCount);
    const girth = BarrelUtils.getGirth(faceExtent, faceCount);
    const rootSize = BarrelUtils.getRootSize(faceSize, axis, girth);
    const hasBacks = props.hasBacks ?? BarrelUtils.getHasBacks(faceCount);

    const renderBarrelFace = (item: T, index: number, face: BarrelFace): ReactNode => {
        const defs = props.computeFaceDefs(index, face);

        return (
            <div
                key={face}
                className={BarrelStyles.barrelFace}
                style={{
                    transform: BarrelUtils.getFaceTransform(axis, face, props.angle, index, faceCount, apothem),
                    transitionDuration: toMs(props.transitionDurationMs),
                    transitionDelay: toMs(props.transitionDelayMs),
                }}
                role="group"
                aria-roledescription={props.faceRoleDescription}
                aria-label={defs.ariaLabel}
                aria-hidden={defs.isHidden ? "true" : undefined}
                inert={defs.isHidden}
            >
                {props.renderFace(item, index, face)}
            </div>
        );
    };

    return (
        <div
            className={BarrelStyles.barrelRoot}
            style={{ width: `${rootSize.width}px`, height: `${rootSize.height}px` }}
        >
            <div
                className={BarrelStyles.barrelPerspective}
                style={{
                    width: `${faceSize.width}px`,
                    height: `${faceSize.height}px`,
                    perspective: `${BarrelUtils.PERSPECTIVE_PX}px`,
                }}
            >
                <div className={BarrelStyles.barrelBody} style={{ transform: `translateZ(${-apothem}px)` }}>
                    {props.faces.map((item, index) => (
                        <Fragment key={index}>
                            {renderBarrelFace(item, index, "front")}

                            {hasBacks && renderBarrelFace(item, index, "back")}
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};
