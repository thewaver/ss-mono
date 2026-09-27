import { useMemo, useState } from "react";

import { TextInput } from "../../src";
import { OptionContent, PopupSurface } from "./ListboxFixtures";

type City = { name: string; country: string };

const CITIES: City[] = [
    { name: "Aarhus", country: "Denmark" },
    { name: "Amsterdam", country: "Netherlands" },
    { name: "Antwerp", country: "Belgium" },
    { name: "Bergen", country: "Norway" },
    { name: "Braga", country: "Portugal" },
    { name: "Bruges", country: "Belgium" },
    { name: "Copenhagen", country: "Denmark" },
    { name: "Gothenburg", country: "Sweden" },
    { name: "Helsinki", country: "Finland" },
    { name: "Lisbon", country: "Portugal" },
    { name: "Malmö", country: "Sweden" },
    { name: "Oslo", country: "Norway" },
    { name: "Porto", country: "Portugal" },
    { name: "Rotterdam", country: "Netherlands" },
    { name: "Stockholm", country: "Sweden" },
    { name: "Tallinn", country: "Estonia" },
    { name: "Tampere", country: "Finland" },
    { name: "Tartu", country: "Estonia" },
];

const FIELD_PADDING = 6;

type CitiesProps = { initial?: string; hasCustomText?: boolean; isDisabled?: boolean; isReadOnly?: boolean };

export const Cities = ({ initial = "", hasCustomText = true, isDisabled = false, isReadOnly = false }: CitiesProps) => {
    const valueState = useState(initial);
    const [picks, setPicks] = useState<string[]>([]);

    const suggestions = useMemo(() => {
        const query = valueState[0].trim().toLocaleLowerCase();

        if (!query) return [];

        return CITIES.filter((city) => city.name.toLocaleLowerCase().startsWith(query));
    }, [valueState[0]]);

    return (
        <>
            <div style={{ width: 240, border: "1px solid gray" }}>
                <TextInput
                    id="field"
                    valueState={valueState}
                    padding={FIELD_PADDING}
                    ariaLabel={"City"}
                    isDisabled={isDisabled}
                    isReadOnly={isReadOnly}
                    suggestions={suggestions}
                    suggestionsAriaLabel={"Cities"}
                    computeCustomSuggestionText={hasCustomText ? (city) => city.name : undefined}
                    renderContent={() => <div style={{ height: 30 }} />}
                    renderSuggestion={(city, flags) => (
                        <OptionContent flags={flags}>
                            {city.name}
                            <span aria-hidden="true">{` — ${city.country}`}</span>
                        </OptionContent>
                    )}
                    renderSuggestionPopup={(renderSuggestions, visibilityTarget, durationMs) => (
                        <PopupSurface visibilityTarget={visibilityTarget} durationMs={durationMs}>
                            {renderSuggestions()}
                        </PopupSurface>
                    )}
                    onSuggestionPick={(city) => setPicks((previous) => [...previous, city.name])}
                />
            </div>
            <output data-readout="value">{`value: "${valueState[0]}"`}</output>
            <output data-readout="picks">{picks.join(",")}</output>
        </>
    );
};

export const Plain = () => {
    const valueState = useState("");

    return (
        <div style={{ width: 240, border: "1px solid gray" }}>
            <TextInput
                id="field"
                valueState={valueState}
                padding={FIELD_PADDING}
                ariaLabel={"Name"}
                renderContent={() => <div style={{ height: 30 }} />}
            />
        </div>
    );
};
