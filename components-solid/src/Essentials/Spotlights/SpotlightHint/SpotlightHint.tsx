import { Spotlight } from "../../../Primitives/Spotlight/Spotlight";
import type { SpotlightHintProps } from "../../../Primitives/Spotlight/SpotlightSolid.types";

export const SpotlightHint = (props: SpotlightHintProps) => <Spotlight {...props} mode={"hint"} />;
