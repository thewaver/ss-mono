import { useColorExtractor } from "../../src";

export const Default = () => {
    const { colors, error } = useColorExtractor({ src: "/crimson.png" });

    return (
        <>
            <output data-readout="colors">{colors.map((color) => color.hex()).join(",")}</output>
            <output data-readout="error">{error ? "error" : "none"}</output>
        </>
    );
};
