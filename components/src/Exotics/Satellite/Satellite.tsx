import type { ParentProps } from "solid-js";
import { Index, Show, createMemo, createSignal, onCleanup } from "solid-js";

import { CSSUtils, StringUtils } from "@thewaver/ss-utils";

import { ElementObserverUtils } from "../../Abstracts/ElementObserver/ElementObserver.utils";
import { access } from "../../Utils/propUtils";
import { SATELLITE_DEFAULTS } from "./Satellite.const";
import type { SatelliteProps } from "./Satellite.types";
import { SatelliteUtils } from "./Satellite.utils";

import * as styles from "./Satellite.css";

const BEHIND_Z_INDEX = 0;
const SUBJECT_Z_INDEX = 1;
const FRONT_Z_INDEX = 2;
const NOTHING = 0;
const UNMEASURED = { width: 0, height: 0 };
const UNPLACED = { x: 0, y: 0 };

export const Satellite = (props: ParentProps<SatelliteProps>) => {
    const [getSubjectRef, setSubjectRef] = createSignal<HTMLElement>();
    const [getSatelliteRefs, setSatelliteRefs] = createSignal<Array<HTMLElement | undefined>>([]);

    const getSatellites = createMemo(() => access(props.satellites) ?? SATELLITE_DEFAULTS.satellites);

    const getSubjectSize = ElementObserverUtils.createBorderBoxSizeObserver(getSubjectRef);

    const getSatelliteSizes = ElementObserverUtils.createBorderBoxSizeListObserver(() =>
        getSatellites().map((_unused, index) => getSatelliteRefs()[index]),
    );

    const getLayout = createMemo(() =>
        SatelliteUtils.computeLayout(
            getSubjectSize(),
            getSatellites().map((satellite, index) => ({
                size: getSatelliteSizes()[index] ?? UNMEASURED,
                placement: access(satellite.placement) ?? SATELLITE_DEFAULTS.placement,
                offset: access(satellite.offset) ?? SATELLITE_DEFAULTS.offset,
            })),
        ),
    );

    const writeSatelliteRef = (index: number, element: HTMLElement | undefined) => {
        setSatelliteRefs((previous) => {
            const next = [...previous];

            next[index] = element;

            return next;
        });
    };

    const setSatelliteRef = (index: number, element: HTMLElement) => {
        writeSatelliteRef(index, element);

        onCleanup(() => {
            writeSatelliteRef(index, undefined);
        });
    };

    return (
        <Show when={getSatellites().length > NOTHING} fallback={props.children}>
            <div
                class={styles.satelliteRoot}
                style={CSSUtils.spreadableToStyle(getLayout().padding, StringUtils.camelToKebabCase)}
            >
                <div ref={setSubjectRef} class={styles.satelliteSubject} style={{ "z-index": SUBJECT_Z_INDEX }}>
                    {props.children}
                </div>

                <Index each={getSatellites()}>
                    {(getSatellite, index) => {
                        const getOffset = () => getLayout().satelliteOffsets[index] ?? UNPLACED;

                        return (
                            <div
                                ref={(element) => setSatelliteRef(index, element)}
                                class={styles.satelliteBody}
                                style={{
                                    "left": `${getOffset().x}px`,
                                    "top": `${getOffset().y}px`,
                                    "z-index":
                                        (access(getSatellite().isBehindSubject) ?? SATELLITE_DEFAULTS.isBehindSubject)
                                            ? BEHIND_Z_INDEX
                                            : FRONT_Z_INDEX,
                                }}
                            >
                                {getSatellite().renderSatellite()}
                            </div>
                        );
                    }}
                </Index>
            </div>
        </Show>
    );
};
