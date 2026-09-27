import type { PropsWithChildren } from "react";
import { useId } from "react";

import type { PlacementSector } from "@thewaver/ss-components-react";
import { PlacementUtils } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/WheelContent/WheelContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type {
    PageWheelCardProps,
    PageWheelPipProps,
    PageWheelPipSide,
    PageWheelSpinProps,
    PageWheelWedgeProps,
} from "./WheelContent.types";

const LABEL_TYPE_RATIO = 0.14;
const NO_TILT = 0;
const HALF = 0.5;
const QUARTER_TURN = 90;
const UPSIDE_DOWN_FROM = 90;
const UPSIDE_DOWN_TO = 270;
const HALF_TURN = 180;
const FULL_TURN = 360;
const PIP_PATH = "M 2 2 H 18 L 10 18 Z";

const PIP_SIDE_STYLES: Record<PageWheelPipSide, string> = {
    top: styles.wheelPipTop,
    left: styles.wheelPipLeft,
};

const toLabelTilt = (wedgeAngle: number, sector: PlacementSector | undefined) => {
    if (!sector) return NO_TILT;

    const tilt = (sector.fromAngle + sector.toAngle) * HALF + QUARTER_TURN;
    const painted = (((wedgeAngle + tilt) % FULL_TURN) + FULL_TURN) % FULL_TURN;
    const isUpsideDown = painted > UPSIDE_DOWN_FROM && painted < UPSIDE_DOWN_TO;

    return tilt + (isUpsideDown ? HALF_TURN : NO_TILT);
};

export const PageWheelWedge = (props: PropsWithChildren<PageWheelWedgeProps>) => {
    const layerClass = useLayerClass();

    const gradientId = useId();

    const rect = props.state.placement;

    return rect ? (
        <div
            className={[styles.wheelWedge, layerClass, props.state.isSelected && styles.isSelected]
                .filter(Boolean)
                .join(" ")}
        >
            <svg className={styles.wheelWedgeSVG} viewBox={"0 0 1 1"}>
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                        <stop className={styles.wheelWedgeGradientFrom} offset="0%" />
                        <stop className={styles.wheelWedgeGradientTo} offset="100%" />
                    </linearGradient>
                </defs>

                <path
                    className={styles.wheelWedgeShape}
                    style={{ fill: props.state.isSelected ? `url(#${gradientId})` : undefined }}
                    d={PlacementUtils.getSectorPath(rect.sector!)}
                />
            </svg>

            <div
                className={styles.wheelWedgeLabel}
                style={{
                    left: PlacementUtils.toContainerWidth(rect.leftShare),
                    top: PlacementUtils.toContainerWidth(rect.topShare),
                    width: PlacementUtils.toContainerWidth(rect.widthShare),
                    height: PlacementUtils.toContainerWidth(rect.heightShare),
                    fontSize: PlacementUtils.toContainerWidth(rect.widthShare * LABEL_TYPE_RATIO),
                    transform: `translate(-50%, -50%) rotate(${toLabelTilt(props.state.angle, rect.sector)}deg)`,
                }}
            >
                {props.children}
            </div>
        </div>
    ) : null;
};

export const PageWheelCard = (props: PropsWithChildren<PageWheelCardProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.wheelCard,
                layerClass,
                props.state.face === "back" && styles.wheelCardBack,
                props.state.isSelected && styles.isSelected,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {props.state.face === "front" && (
                <>
                    <div className={styles.wheelCardRank}>{props.rank ?? props.state.index + 1}</div>

                    {props.children}
                </>
            )}
        </div>
    );
};

export const PageWheelStack = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.wheelStack, layerClass].join(" ")}>{props.children}</div>;
};

export const PageWheelMount = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.wheelMount, layerClass].join(" ")}>{props.children}</div>;
};

export const PageWheelPip = (props: PageWheelPipProps) => {
    const layerClass = useLayerClass();

    return (
        <div className={[PIP_SIDE_STYLES[props.side], layerClass].join(" ")} aria-hidden="true">
            <svg className={styles.wheelPipShape} viewBox="0 0 20 20">
                <path d={PIP_PATH} />
            </svg>
        </div>
    );
};

export const PageWheelCenter = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.wheelCenter, layerClass].join(" ")}>{props.children}</div>;
};

export const PageWheelBar = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.wheelBar, layerClass].join(" ")}>{props.children}</div>;
};

export const PageWheelSpin = (props: PageWheelSpinProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.wheelSpin,
                layerClass,
                props.flags.isHovered && styles.isHovered,
                props.flags.isActive && styles.isActive,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
            aria-hidden="true"
        >
            {props.phase === "spinning" || props.phase === "settling" ? "…" : "Spin"}
        </div>
    );
};
