import { type ComponentPublicInstance, type SlotsType, defineComponent, shallowRef } from "vue";

import { SATELLITE_DEFAULTS, SatelliteStyles, SatelliteUtils } from "@thewaver/ss-components";

import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { declareProps } from "../../../Utils/propUtils";
import { toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { SatelliteDefs, SatelliteProps, SatelliteSlots } from "./Satellite.types";

const BEHIND_Z_INDEX = 0;
const SUBJECT_Z_INDEX = 1;
const FRONT_Z_INDEX = 2;
const NOTHING = 0;
const UNMEASURED = { width: 0, height: 0 };
const UNPLACED = { x: 0, y: 0 };
const NO_SATELLITES: SatelliteDefs[] = [];

const toPixels = (values: object) =>
    Object.fromEntries(Object.entries(values).map(([key, value]) => [key, `${value}px`]));

export const Satellite = defineComponent(
    (props: SatelliteProps, { slots }: SlotsContext<SatelliteSlots>) => {
        const subjectRef = shallowRef<HTMLDivElement>();
        const satelliteRefs = shallowRef<Array<HTMLElement | undefined>>([]);

        const getSatellites = () => props.satellites ?? NO_SATELLITES;
        const getHasSatellites = () => getSatellites().length > NOTHING;

        const subjectSize = ElementObserverVueUtils.useBorderBoxSize(subjectRef, () => !getHasSatellites());

        const satelliteSizes = ElementObserverVueUtils.useBorderBoxSizes(
            () => getSatellites().map((_unused, index) => satelliteRefs.value[index]),
            () => !getHasSatellites(),
        );

        const refSetters = new Map<number, (target: Element | ComponentPublicInstance | null) => void>();

        const getRefSetter = (index: number) => {
            const known = refSetters.get(index);

            if (known) return known;

            const setter = (target: Element | ComponentPublicInstance | null) => {
                const element = toElement(target);

                if (satelliteRefs.value[index] === element) return;

                const next = [...satelliteRefs.value];

                next[index] = element;

                satelliteRefs.value = next;
            };

            refSetters.set(index, setter);

            return setter;
        };

        return () => {
            const satellites = getSatellites();

            if (!getHasSatellites()) return slots.default?.();

            const layout = SatelliteUtils.computeLayout(
                subjectSize.value,
                satellites.map((satellite, index) => ({
                    size: satelliteSizes.value[index] ?? UNMEASURED,
                    placement: satellite.placement ?? SATELLITE_DEFAULTS.placement,
                    offset: satellite.offset ?? SATELLITE_DEFAULTS.offset,
                })),
            );

            return (
                <div class={SatelliteStyles.satelliteRoot} style={toPixels(layout.padding)}>
                    <div ref={subjectRef} class={SatelliteStyles.satelliteSubject} style={{ zIndex: SUBJECT_Z_INDEX }}>
                        {slots.default?.()}
                    </div>

                    {satellites.map((satellite, index) => {
                        const offset = layout.satelliteOffsets[index] ?? UNPLACED;

                        return (
                            <div
                                key={index}
                                ref={getRefSetter(index)}
                                class={SatelliteStyles.satelliteBody}
                                style={{
                                    left: `${offset.x}px`,
                                    top: `${offset.y}px`,
                                    zIndex:
                                        (satellite.isBehindSubject ?? SATELLITE_DEFAULTS.isBehindSubject)
                                            ? BEHIND_Z_INDEX
                                            : FRONT_Z_INDEX,
                                }}
                            >
                                {satellite.renderSatellite()}
                            </div>
                        );
                    })}
                </div>
            );
        };
    },
    {
        name: "Satellite",
        slots: Object as SlotsType<SatelliteSlots>,
        props: declareProps<SatelliteProps>({ satellites: null }),
    },
);
