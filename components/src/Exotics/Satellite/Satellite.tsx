import type { ParentProps } from "solid-js";
import { Show, createMemo, createSignal } from "solid-js";

import { CSSUtils, StringUtils } from "@thewaver/ss-utils";

import { ElementObserverUtils } from "../../Abstracts/ElementObserver/ElementObserver.utils";
import { access } from "../../Utils/propUtils";
import { SATELLITE_DEFAULTS } from "./Satellite.const";
import type { SatelliteProps } from "./Satellite.types";
import { SatelliteUtils } from "./Satellite.utils";

import * as styles from "./Satellite.css";

const SUBJECT_Z_INDEX = 0;
const RAISED_SUBJECT_Z_INDEX = 1;

export const Satellite = (props: ParentProps<SatelliteProps>) => {
    const [getSubjectRef, setSubjectRef] = createSignal<HTMLElement>();
    const [getSatelliteRef, setSatelliteRef] = createSignal<HTMLElement>();

    const getSubjectSize = ElementObserverUtils.createBorderBoxSizeObserver(getSubjectRef);

    const getSatelliteSize = ElementObserverUtils.createBorderBoxSizeObserver(getSatelliteRef);

    const getPlacement = createMemo(() => access(props.placement) ?? SATELLITE_DEFAULTS.placement);

    const getOffset = createMemo(() => access(props.offset) ?? SATELLITE_DEFAULTS.offset);

    const getLayout = createMemo(() =>
        SatelliteUtils.computeLayout(getSubjectSize(), getSatelliteSize(), getPlacement(), getOffset()),
    );

    return (
        <Show when={props.renderSatellite} fallback={props.children}>
            <div
                class={styles.satelliteRoot}
                style={CSSUtils.spreadableToStyle(getLayout().padding, StringUtils.camelToKebabCase)}
            >
                <div
                    ref={setSubjectRef}
                    class={styles.satelliteSubject}
                    style={{
                        "z-index": access(props.isBehindSubject) ? RAISED_SUBJECT_Z_INDEX : SUBJECT_Z_INDEX,
                    }}
                >
                    {props.children}
                </div>

                <div
                    ref={setSatelliteRef}
                    class={styles.satelliteBody}
                    style={{
                        left: `${getLayout().satelliteOffset.x}px`,
                        top: `${getLayout().satelliteOffset.y}px`,
                    }}
                >
                    {props.renderSatellite?.()}
                </div>
            </div>
        </Show>
    );
};
