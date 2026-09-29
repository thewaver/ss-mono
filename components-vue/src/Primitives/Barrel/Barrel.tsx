import { Fragment, type SlotsType, type VNodeChild, defineComponent } from "vue";

import { BARREL_DEFAULTS, type BarrelFace, BarrelStyles, BarrelUtils } from "@thewaver/ss-components";

import { callSlot, declareProps } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { BarrelProps, BarrelSlots } from "./Barrel.types";

const toMs = (value: number | undefined) => (value === undefined ? undefined : `${value}ms`);

export const Barrel = defineComponent(
    <T,>(props: BarrelProps<T>, { slots }: SlotsContext<BarrelSlots<T>>) =>
        () => {
            const axis = props.axis ?? BARREL_DEFAULTS.axis;
            const faceSize = props.faceSize ?? BARREL_DEFAULTS.faceSize;
            const faceCount = props.faces.length;

            const faceExtent = BarrelUtils.getFaceExtent(faceSize, axis);
            const apothem = BarrelUtils.getApothem(faceExtent, faceCount);
            const girth = BarrelUtils.getGirth(faceExtent, faceCount);
            const rootSize = BarrelUtils.getRootSize(faceSize, axis, girth);
            const hasBacks = props.hasBacks ?? BarrelUtils.getHasBacks(faceCount);

            const renderBarrelFace = (item: T, index: number, face: BarrelFace): VNodeChild => {
                const defs = props.computeFaceDefs(index, face);

                return (
                    <div
                        key={face}
                        class={BarrelStyles.barrelFace}
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
                        {callSlot(slots.renderFace, { item, index, face })}
                    </div>
                );
            };

            return (
                <div
                    class={BarrelStyles.barrelRoot}
                    style={{ width: `${rootSize.width}px`, height: `${rootSize.height}px` }}
                >
                    <div
                        class={BarrelStyles.barrelPerspective}
                        style={{
                            width: `${faceSize.width}px`,
                            height: `${faceSize.height}px`,
                            perspective: `${BarrelUtils.PERSPECTIVE_PX}px`,
                        }}
                    >
                        <div class={BarrelStyles.barrelBody} style={{ transform: `translateZ(${-apothem}px)` }}>
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
        },
    {
        name: "Barrel",
        slots: Object as SlotsType<BarrelSlots<any>>,
        props: declareProps<BarrelProps<unknown>>({
            angle: null,
            axis: null,
            faceSize: null,
            hasBacks: Boolean,
            transitionDurationMs: null,
            transitionDelayMs: null,
            faceRoleDescription: null,
            computeFaceDefs: null,
            faces: null,
        }),
    },
);
