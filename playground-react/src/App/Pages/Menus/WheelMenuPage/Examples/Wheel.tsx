import { useId } from "react";

import { PlacementUtils, WheelMenu } from "@thewaver/ss-components-react";
import type { PlacementRect } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.css";

import { PageLayer } from "../../../../PageComponents/Layer/Layer";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import type { WheelMenuExampleProps } from "../WheelMenuPage.types";

const HALF = 0.5;
const SUBMENU_MARK = "›";
const CLOSER_MARK = "✕";

const toViewBox = (rect: PlacementRect) =>
    `${rect.leftShare - rect.widthShare * HALF} ${rect.topShare - rect.heightShare * HALF} ${rect.widthShare} ${rect.heightShare}`;

type WedgeDefsProps = {
    gradientId: string;
};

const WedgeDefs = (props: WedgeDefsProps) => (
    <svg className={styles.wedgeDefs} aria-hidden={"true"}>
        <defs>
            <linearGradient id={props.gradientId} x1={"0"} y1={"1"} x2={"1"} y2={"0"}>
                <stop className={styles.wedgeGradientFrom} offset={"0%"} />
                <stop className={styles.wedgeGradientTo} offset={"100%"} />
            </linearGradient>
        </defs>
    </svg>
);

const WHEEL_HOLE_RADIUS = 64;
const WHEEL_BAND_WIDTH = 84;
const WHEEL_LEVEL_GAP = 8;

export const WheelExample = (props: WheelMenuExampleProps) => {
    const gradientId = useId();

    return (
        <div className={styles.stage}>
            <WedgeDefs gradientId={gradientId} />

            <WheelMenu
                layoutSize={"368px"}
                items={props.items}
                ariaLabel={"Edit actions"}
                spreadDegrees={props.spreadDegrees}
                opensOnHold={props.opensOnHold}
                layoutDefs={props.layoutDefs}
                holeRadius={props.holeRadius ?? WHEEL_HOLE_RADIUS}
                bandWidth={props.bandWidth ?? WHEEL_BAND_WIDTH}
                levelGap={WHEEL_LEVEL_GAP}
                placement={{ x: "center", y: "center" }}
                closerDefs={{
                    ariaLabel: "Close the wheel",
                    renderContent: (flags) => (
                        <div
                            className={[styles.closer, flags.isHighlighted && styles.closerHighlighted]
                                .filter(Boolean)
                                .join(" ")}
                            aria-hidden={"true"}
                        >
                            {CLOSER_MARK}
                        </div>
                    ),
                }}
                renderContent={(flags) => (
                    <PageMenuTriggerContent flags={flags}>{props.caption}</PageMenuTriggerContent>
                )}
                renderItem={(item, flags, placement) => {
                    const sector = placement?.sector;

                    if (!sector) return null;

                    return (
                        <>
                            <svg className={styles.canvas} viewBox={toViewBox(placement)} aria-hidden={"true"}>
                                <path
                                    className={[styles.wedge, flags.isDisabled && styles.wedgeDisabled]
                                        .filter(Boolean)
                                        .join(" ")}
                                    style={{ fill: flags.isHighlighted ? `url(#${gradientId})` : undefined }}
                                    d={PlacementUtils.getSectorPath(sector)}
                                />
                            </svg>

                            <div
                                className={[styles.label, flags.isHighlighted && styles.labelHighlighted]
                                    .filter(Boolean)
                                    .join(" ")}
                            >
                                <span>{item.value.name}</span>

                                {item.value.shortcut && <span className={styles.shortcut}>{item.value.shortcut}</span>}

                                {flags.hasSubmenu && <span aria-hidden={"true"}>{SUBMENU_MARK}</span>}
                            </div>
                        </>
                    );
                }}
                renderPopup={(renderItems, visibilityTarget, transitionDurationMs) => (
                    <div
                        className={[styles.layer, visibilityTarget === 1 && styles.layerVisible]
                            .filter(Boolean)
                            .join(" ")}
                        style={{
                            transition: `opacity ${transitionDurationMs}ms, transform ${transitionDurationMs}ms`,
                        }}
                    >
                        <PageLayer level={2}>{renderItems()}</PageLayer>
                    </div>
                )}
                onActivate={props.onActivate}
            />
        </div>
    );
};
