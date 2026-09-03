import { createSignal } from "solid-js";

import { SVGFilterDefsFactory, access } from "@thewaver/ss-components";
import type { SVGDisplacementChannel, SVGTurbulenceFilterDefs } from "@thewaver/ss-components";

import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField, PageSelectField } from "../../../StyledComponents/Field/Field";
import { PageFilterStage } from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent";
import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersTurbulence";

const TYPES: NonNullable<SVGTurbulenceFilterDefs["type"]>[] = ["fractalNoise", "turbulence"];
const CHANNELS: SVGDisplacementChannel[] = ["R", "G", "B", "A"];

const MIN_FREQUENCY = 0.001;
const MAX_FREQUENCY = 0.2;
const FREQUENCY_STEP = 0.001;
const MIN_SCALE = 0;
const MAX_SCALE = 200;
const MIN_OCTAVES = 1;
const MAX_OCTAVES = 6;
const MIN_SEED = 0;
const MAX_SEED = 60;

const STARTING_FREQUENCY_X = 0.015;
const STARTING_FREQUENCY_Y = 0.015;
const STARTING_SCALE = 30;
const STARTING_OCTAVES = 2;
const STARTING_SEED = 5;

type Props = SVGFiltersExampleProps;

export const TurbulenceExample = (props: Props) => {
    const [getFrequencyX, setFrequencyX] = createSignal(STARTING_FREQUENCY_X);
    const [getFrequencyY, setFrequencyY] = createSignal(STARTING_FREQUENCY_Y);
    const [getScale, setScale] = createSignal(STARTING_SCALE);
    const [getType, setType] = createSignal(TYPES[0]);
    const [getOctaves, setOctaves] = createSignal(STARTING_OCTAVES);
    const [getSeed, setSeed] = createSignal(STARTING_SEED);
    const [getXChannel, setXChannel] = createSignal<SVGDisplacementChannel>("R");
    const [getYChannel, setYChannel] = createSignal<SVGDisplacementChannel>("G");

    return (
        <>
            <PageFilterStage
                filterId={FILTER_ID}
                label={"bend"}
                renderDefs={() =>
                    new SVGFilterDefsFactory(FILTER_ID)
                        .addTurbulenceFilter({
                            baseFrequency: { x: getFrequencyX(), y: getFrequencyY() },
                            scale: getScale(),
                            type: getType(),
                            numOctaves: getOctaves(),
                            seed: getSeed(),
                            xChannelSelector: getXChannel(),
                            yChannelSelector: getYChannel(),
                        })
                        .computeFilterPrimitives({
                            method: access(props.method),
                            elementSize: access(props.elementSize),
                        })
                }
            />

            <PagePropsPanel scope={"local"}>
                <PageProp key={"type"} label={"Type"}>
                    <PageSelectField
                        value={getType}
                        values={() => TYPES}
                        ariaLabel={"Type"}
                        onChange={(type) => setType(() => type)}
                    />
                </PageProp>

                <PageProp key={"baseFrequencyX"} label={"Base frequency x"}>
                    <PageNumberField
                        value={getFrequencyX}
                        min={() => MIN_FREQUENCY}
                        max={() => MAX_FREQUENCY}
                        step={() => FREQUENCY_STEP}
                        ariaLabel={"Base frequency x"}
                        onInput={setFrequencyX}
                    />
                </PageProp>

                <PageProp key={"baseFrequencyY"} label={"Base frequency y"}>
                    <PageNumberField
                        value={getFrequencyY}
                        min={() => MIN_FREQUENCY}
                        max={() => MAX_FREQUENCY}
                        step={() => FREQUENCY_STEP}
                        ariaLabel={"Base frequency y"}
                        onInput={setFrequencyY}
                    />
                </PageProp>

                <PageProp key={"scale"} label={"Scale"}>
                    <PageNumberField
                        value={getScale}
                        min={() => MIN_SCALE}
                        max={() => MAX_SCALE}
                        ariaLabel={"Scale"}
                        onInput={setScale}
                    />
                </PageProp>

                <PageProp key={"numOctaves"} label={"Octaves"}>
                    <PageNumberField
                        value={getOctaves}
                        min={() => MIN_OCTAVES}
                        max={() => MAX_OCTAVES}
                        ariaLabel={"Octaves"}
                        onInput={setOctaves}
                    />
                </PageProp>

                <PageProp key={"seed"} label={"Seed"}>
                    <PageNumberField
                        value={getSeed}
                        min={() => MIN_SEED}
                        max={() => MAX_SEED}
                        ariaLabel={"Seed"}
                        onInput={setSeed}
                    />
                </PageProp>

                <PageProp key={"xChannelSelector"} label={"X channel"}>
                    <PageSelectField
                        value={getXChannel}
                        values={() => CHANNELS}
                        ariaLabel={"X channel"}
                        onChange={(channel) => setXChannel(() => channel)}
                    />
                </PageProp>

                <PageProp key={"yChannelSelector"} label={"Y channel"}>
                    <PageSelectField
                        value={getYChannel}
                        values={() => CHANNELS}
                        ariaLabel={"Y channel"}
                        onChange={(channel) => setYChannel(() => channel)}
                    />
                </PageProp>
            </PagePropsPanel>
        </>
    );
};
