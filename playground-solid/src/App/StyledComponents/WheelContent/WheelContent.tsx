import { type ParentProps, Show, createUniqueId } from "solid-js";

import { PlacementUtils, access } from "@thewaver/ss-components-solid";
import type { PlacementSector } from "@thewaver/ss-components-solid";
import {
    FULL_TURN,
    HALF,
    HALF_TURN,
    LABEL_TYPE_RATIO,
    NO_TILT,
    PIP_PATH,
    PIP_SIDE_STYLES,
    QUARTER_TURN,
    UPSIDE_DOWN_FROM,
    UPSIDE_DOWN_TO,
} from "@thewaver/ss-playground/App/StyledComponents/WheelContent/WheelContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/WheelContent/WheelContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type {
    PageWheelCardProps,
    PageWheelPipProps,
    PageWheelSpinProps,
    PageWheelWedgeProps,
} from "./WheelContentSolid.types";

const toLabelTilt = (wedgeAngle: number, sector: PlacementSector | undefined) => {
    if (!sector) return NO_TILT;

    const tilt = (sector.fromAngle + sector.toAngle) * HALF + QUARTER_TURN;
    const painted = (((wedgeAngle + tilt) % FULL_TURN) + FULL_TURN) % FULL_TURN;
    const isUpsideDown = painted > UPSIDE_DOWN_FROM && painted < UPSIDE_DOWN_TO;

    return tilt + (isUpsideDown ? HALF_TURN : NO_TILT);
};

export const PageWheelWedge = (props: ParentProps<PageWheelWedgeProps>) => {
    const getLayerClass = useLayerClass();

    const gradientId = createUniqueId();

    return (
        <Show when={access(props.state).placement}>
            {(getRect) => (
                <div
                    class={styles.wheelWedge}
                    classList={{ [getLayerClass()]: true, [styles.isSelected]: access(props.state).isSelected }}
                >
                    <svg class={styles.wheelWedgeSVG} viewBox={"0 0 1 1"}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                                <stop class={styles.wheelWedgeGradientFrom} offset="0%" />
                                <stop class={styles.wheelWedgeGradientTo} offset="100%" />
                            </linearGradient>
                        </defs>

                        <path
                            class={styles.wheelWedgeShape}
                            style={{ fill: access(props.state).isSelected ? `url(#${gradientId})` : undefined }}
                            d={PlacementUtils.getSectorPath(getRect().sector!)}
                        />
                    </svg>

                    <div
                        class={styles.wheelWedgeLabel}
                        style={{
                            "left": PlacementUtils.toContainerWidth(getRect().leftShare),
                            "top": PlacementUtils.toContainerWidth(getRect().topShare),
                            "width": PlacementUtils.toContainerWidth(getRect().widthShare),
                            "height": PlacementUtils.toContainerWidth(getRect().heightShare),
                            "font-size": PlacementUtils.toContainerWidth(getRect().widthShare * LABEL_TYPE_RATIO),
                            "transform": `translate(-50%, -50%) rotate(${toLabelTilt(access(props.state).angle, getRect().sector)}deg)`,
                        }}
                    >
                        {props.children}
                    </div>
                </div>
            )}
        </Show>
    );
};

export const PageWheelCard = (props: ParentProps<PageWheelCardProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.wheelCard}
            classList={{
                [getLayerClass()]: true,
                [styles.wheelCardBack]: access(props.state).face === "back",
                [styles.isSelected]: access(props.state).isSelected,
            }}
        >
            {access(props.state).face === "front" && (
                <>
                    <div class={styles.wheelCardRank}>{access(props.rank) ?? access(props.state).index + 1}</div>

                    {props.children}
                </>
            )}
        </div>
    );
};

export const PageWheelStack = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.wheelStack, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageWheelMount = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.wheelMount, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageWheelPip = (props: PageWheelPipProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div class={[PIP_SIDE_STYLES[access(props.side)], getLayerClass()].join(" ")} aria-hidden="true">
            <svg class={styles.wheelPipShape} viewBox="0 0 20 20">
                <path d={PIP_PATH} />
            </svg>
        </div>
    );
};

export const PageWheelCenter = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.wheelCenter, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageWheelBar = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.wheelBar, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageWheelSpin = (props: PageWheelSpinProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.wheelSpin}
            classList={{
                [getLayerClass()]: true,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isActive]: access(props.flags).isActive,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
            aria-hidden="true"
        >
            {access(props.phase) === "spinning" || access(props.phase) === "settling" ? "…" : "Spin"}
        </div>
    );
};
