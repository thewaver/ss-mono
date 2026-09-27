import { useState } from "react";

import { SVGFilterDefs, SVGFilterDefsFactory } from "@thewaver/ss-components-react";
import type { SVGDisplacementChannel } from "@thewaver/ss-components-react";
import { SVGFilterKnobs } from "@thewaver/ss-playground-core/App/Knobs/SVGFilters.const";

import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageNumberField, PageSelectField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PageFilterStage } from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent";
import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersTurbulence";

type Props = SVGFiltersExampleProps;

export const TurbulenceExample = (props: Props) => {
    const [frequencyX, setFrequencyX] = useState(SVGFilterKnobs.Turbulence.STARTING_FREQUENCY_X);
    const [frequencyY, setFrequencyY] = useState(SVGFilterKnobs.Turbulence.STARTING_FREQUENCY_Y);
    const [scale, setScale] = useState(SVGFilterKnobs.Turbulence.STARTING_SCALE);
    const [type, setType] = useState(SVGFilterKnobs.Turbulence.STARTING_TYPE);
    const [octaves, setOctaves] = useState(SVGFilterKnobs.Turbulence.STARTING_OCTAVES);
    const [seed, setSeed] = useState(SVGFilterKnobs.Turbulence.STARTING_SEED);
    const [xChannel, setXChannel] = useState<SVGDisplacementChannel>(SVGFilterKnobs.Turbulence.STARTING_X_CHANNEL);
    const [yChannel, setYChannel] = useState<SVGDisplacementChannel>(SVGFilterKnobs.Turbulence.STARTING_Y_CHANNEL);

    return (
        <>
            <PageFilterStage
                filterId={FILTER_ID}
                label={"bend"}
                renderDefs={() =>
                    new SVGFilterDefsFactory(FILTER_ID)
                        .addTurbulenceFilter({
                            baseFrequency: { x: frequencyX, y: frequencyY },
                            scale,
                            type,
                            numOctaves: octaves,
                            seed,
                            xChannelSelector: xChannel,
                            yChannelSelector: yChannel,
                        })
                        .computeFilterPrimitives({
                            method: props.method,
                            elementSize: props.elementSize,
                        })
                }
            />

            <PageExampleKnobs>
                <PageProp
                    itemKey={"type"}
                    label={"Type"}
                    hint={
                        "Which noise is generated: fractal noise is soft and cloudy, turbulence is sharper and more veined."
                    }
                >
                    <PageSelectField
                        value={type}
                        values={SVGFilterDefs.TURBULENCE_TYPES}
                        ariaLabel={"Type"}
                        onChange={setType}
                    />
                </PageProp>

                <PageProp
                    itemKey={"baseFrequencyX"}
                    label={"Base frequency x"}
                    hint={"How fine the noise is across. Higher numbers make a tighter grain."}
                >
                    <PageNumberField
                        value={frequencyX}
                        min={SVGFilterKnobs.Turbulence.MIN_FREQUENCY}
                        max={SVGFilterKnobs.Turbulence.MAX_FREQUENCY}
                        step={SVGFilterKnobs.Turbulence.FREQUENCY_STEP}
                        ariaLabel={"Base frequency x"}
                        onInput={setFrequencyX}
                    />
                </PageProp>

                <PageProp
                    itemKey={"baseFrequencyY"}
                    label={"Base frequency y"}
                    hint={"How fine the noise is down. Set it apart from the across value to stretch the grain."}
                >
                    <PageNumberField
                        value={frequencyY}
                        min={SVGFilterKnobs.Turbulence.MIN_FREQUENCY}
                        max={SVGFilterKnobs.Turbulence.MAX_FREQUENCY}
                        step={SVGFilterKnobs.Turbulence.FREQUENCY_STEP}
                        ariaLabel={"Base frequency y"}
                        onInput={setFrequencyY}
                    />
                </PageProp>

                <PageProp
                    itemKey={"scale"}
                    label={"Scale"}
                    hint={"How far the noise pushes the picture about. 0 leaves the picture where it was."}
                >
                    <PageNumberField
                        value={scale}
                        min={SVGFilterKnobs.Turbulence.MIN_SCALE}
                        max={SVGFilterKnobs.Turbulence.MAX_SCALE}
                        ariaLabel={"Scale"}
                        onInput={setScale}
                    />
                </PageProp>

                <PageProp
                    itemKey={"numOctaves"}
                    label={"Octaves"}
                    hint={"How many layers of noise are piled up. More layers add fine detail and cost more to draw."}
                >
                    <PageNumberField
                        value={octaves}
                        min={SVGFilterKnobs.Turbulence.MIN_OCTAVES}
                        max={SVGFilterKnobs.Turbulence.MAX_OCTAVES}
                        ariaLabel={"Octaves"}
                        onInput={setOctaves}
                    />
                </PageProp>

                <PageProp
                    itemKey={"seed"}
                    label={"Seed"}
                    hint={
                        "The number the random noise is grown from. Change it for a different pattern at the same settings."
                    }
                >
                    <PageNumberField
                        value={seed}
                        min={SVGFilterKnobs.Turbulence.MIN_SEED}
                        max={SVGFilterKnobs.Turbulence.MAX_SEED}
                        ariaLabel={"Seed"}
                        onInput={setSeed}
                    />
                </PageProp>

                <PageProp
                    itemKey={"xChannelSelector"}
                    label={"X channel"}
                    hint={"Which channel of the noise decides how far each point moves sideways."}
                >
                    <PageSelectField
                        value={xChannel}
                        values={SVGFilterDefs.DISPLACEMENT_CHANNELS}
                        ariaLabel={"X channel"}
                        onChange={setXChannel}
                    />
                </PageProp>

                <PageProp
                    itemKey={"yChannelSelector"}
                    label={"Y channel"}
                    hint={"Which channel of the noise decides how far each point moves up or down."}
                >
                    <PageSelectField
                        value={yChannel}
                        values={SVGFilterDefs.DISPLACEMENT_CHANNELS}
                        ariaLabel={"Y channel"}
                        onChange={setYChannel}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};
