import { For, Match, Switch } from "solid-js";

import type { SampleKnob } from "@thewaver/ss-components";

import { PageCheckField, PageNumberField } from "../../StyledComponents/Field/Field";
import { PageProp } from "../Prop/Prop";
import type { PageKnobsProps } from "./Knobs.types";

const toEntries = (knobs: Record<string, SampleKnob | undefined>) =>
    Object.entries(knobs).filter((entry): entry is [string, SampleKnob] => entry[1] !== undefined);

export const PageKnobs = (props: PageKnobsProps) => {
    const getValue = (key: string) => props.values()[key] ?? props.defaults()[key];

    return (
        <For each={toEntries(props.knobs())}>
            {([key, knob]) => (
                <PageProp key={key} label={knob.label}>
                    <Switch>
                        <Match when={knob.kind === "number" ? knob : undefined}>
                            {(getNumberKnob) => (
                                <PageNumberField
                                    value={() => Number(getValue(key))}
                                    min={() => getNumberKnob().min}
                                    max={() => getNumberKnob().max}
                                    step={() => getNumberKnob().step}
                                    width={props.width}
                                    ariaLabel={knob.label}
                                    onInput={(value) => props.onInput(key, value)}
                                />
                            )}
                        </Match>

                        <Match when={knob.kind === "check"}>
                            <PageCheckField
                                value={() => Boolean(getValue(key))}
                                ariaLabel={knob.label}
                                onChange={(value) => props.onInput(key, value)}
                            />
                        </Match>
                    </Switch>
                </PageProp>
            )}
        </For>
    );
};
