import { createSignal } from "solid-js";

import { SVGFilterDefs, SVGFilterDefsFactory, access } from "@thewaver/ss-components";
import type { SVGDisplacementChannel } from "@thewaver/ss-components";

import { SVGFilterKnobs } from "../../../Knobs/SVGFilters.const";
import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageNumberField, PageSelectField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PageFilterStage } from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent";
import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersTurbulence";

type Props = SVGFiltersExampleProps;

export const TurbulenceExample = (props: Props) => {
    const [getFrequencyX, setFrequencyX] = createSignal(SVGFilterKnobs.Turbulence.STARTING_FREQUENCY_X);
    const [getFrequencyY, setFrequencyY] = createSignal(SVGFilterKnobs.Turbulence.STARTING_FREQUENCY_Y);
    const [getScale, setScale] = createSignal(SVGFilterKnobs.Turbulence.STARTING_SCALE);
    const [getType, setType] = createSignal(SVGFilterKnobs.Turbulence.STARTING_TYPE);
    const [getOctaves, setOctaves] = createSignal(SVGFilterKnobs.Turbulence.STARTING_OCTAVES);
    const [getSeed, setSeed] = createSignal(SVGFilterKnobs.Turbulence.STARTING_SEED);
    const [getXChannel, setXChannel] = createSignal<SVGDisplacementChannel>(
        SVGFilterKnobs.Turbulence.STARTING_X_CHANNEL,
    );
    const [getYChannel, setYChannel] = createSignal<SVGDisplacementChannel>(
        SVGFilterKnobs.Turbulence.STARTING_Y_CHANNEL,
    );

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

            <PageExampleKnobs>
                <PageProp
                    key={"type"}
                    label={"Type"}
                    hint={
                        "Which noise is generated: fractal noise is soft and cloudy, turbulence is sharper and more veined."
                    }
                >
                    <PageSelectField
                        value={getType}
                        values={() => SVGFilterDefs.TURBULENCE_TYPES}
                        ariaLabel={"Type"}
                        onChange={(type) => setType(() => type)}
                    />
                </PageProp>

                <PageProp
                    key={"baseFrequencyX"}
                    label={"Base frequency x"}
                    hint={"How fine the noise is across. Higher numbers make a tighter grain."}
                >
                    <PageNumberField
                        value={getFrequencyX}
                        min={() => SVGFilterKnobs.Turbulence.MIN_FREQUENCY}
                        max={() => SVGFilterKnobs.Turbulence.MAX_FREQUENCY}
                        step={() => SVGFilterKnobs.Turbulence.FREQUENCY_STEP}
                        ariaLabel={"Base frequency x"}
                        onInput={setFrequencyX}
                    />
                </PageProp>

                <PageProp
                    key={"baseFrequencyY"}
                    label={"Base frequency y"}
                    hint={"How fine the noise is down. Set it apart from the across value to stretch the grain."}
                >
                    <PageNumberField
                        value={getFrequencyY}
                        min={() => SVGFilterKnobs.Turbulence.MIN_FREQUENCY}
                        max={() => SVGFilterKnobs.Turbulence.MAX_FREQUENCY}
                        step={() => SVGFilterKnobs.Turbulence.FREQUENCY_STEP}
                        ariaLabel={"Base frequency y"}
                        onInput={setFrequencyY}
                    />
                </PageProp>

                <PageProp
                    key={"scale"}
                    label={"Scale"}
                    hint={"How far the noise pushes the picture about. 0 leaves the picture where it was."}
                >
                    <PageNumberField
                        value={getScale}
                        min={() => SVGFilterKnobs.Turbulence.MIN_SCALE}
                        max={() => SVGFilterKnobs.Turbulence.MAX_SCALE}
                        ariaLabel={"Scale"}
                        onInput={setScale}
                    />
                </PageProp>

                <PageProp
                    key={"numOctaves"}
                    label={"Octaves"}
                    hint={"How many layers of noise are piled up. More layers add fine detail and cost more to draw."}
                >
                    <PageNumberField
                        value={getOctaves}
                        min={() => SVGFilterKnobs.Turbulence.MIN_OCTAVES}
                        max={() => SVGFilterKnobs.Turbulence.MAX_OCTAVES}
                        ariaLabel={"Octaves"}
                        onInput={setOctaves}
                    />
                </PageProp>

                <PageProp
                    key={"seed"}
                    label={"Seed"}
                    hint={
                        "The number the random noise is grown from. Change it for a different pattern at the same settings."
                    }
                >
                    <PageNumberField
                        value={getSeed}
                        min={() => SVGFilterKnobs.Turbulence.MIN_SEED}
                        max={() => SVGFilterKnobs.Turbulence.MAX_SEED}
                        ariaLabel={"Seed"}
                        onInput={setSeed}
                    />
                </PageProp>

                <PageProp
                    key={"xChannelSelector"}
                    label={"X channel"}
                    hint={"Which channel of the noise decides how far each point moves sideways."}
                >
                    <PageSelectField
                        value={getXChannel}
                        values={() => SVGFilterDefs.DISPLACEMENT_CHANNELS}
                        ariaLabel={"X channel"}
                        onChange={(channel) => setXChannel(() => channel)}
                    />
                </PageProp>

                <PageProp
                    key={"yChannelSelector"}
                    label={"Y channel"}
                    hint={"Which channel of the noise decides how far each point moves up or down."}
                >
                    <PageSelectField
                        value={getYChannel}
                        values={() => SVGFilterDefs.DISPLACEMENT_CHANNELS}
                        ariaLabel={"Y channel"}
                        onChange={(channel) => setYChannel(() => channel)}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};
