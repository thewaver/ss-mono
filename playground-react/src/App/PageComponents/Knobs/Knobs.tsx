import { PageCheckField, PageNumberField } from "../Field/Field";
import { PageProp } from "../Prop/Prop";
import type { Knob, PageKnobsProps } from "./Knobs.types";

const toEntries = (knobs: Record<string, Knob | undefined>) =>
    Object.entries(knobs).filter((entry): entry is [string, Knob] => entry[1] !== undefined);

export const PageKnobs = (props: PageKnobsProps) => {
    const getValue = (key: string) => props.values[key] ?? props.defaults[key];

    return (
        <>
            {toEntries(props.knobs).map(([key, knob]) => (
                <PageProp
                    key={key}
                    itemKey={key}
                    label={knob.label}
                    hint={knob.hint}
                    defaultValue={props.defaults[key]}
                >
                    {knob.kind === "number" ? (
                        <PageNumberField
                            value={Number(getValue(key))}
                            min={knob.min}
                            max={knob.max}
                            step={knob.step}
                            width={props.width}
                            ariaLabel={knob.label}
                            onInput={(value) => props.onInput(key, value)}
                        />
                    ) : (
                        <PageCheckField
                            value={Boolean(getValue(key))}
                            ariaLabel={knob.label}
                            onChange={(value) => props.onInput(key, value)}
                        />
                    )}
                </PageProp>
            ))}
        </>
    );
};
