import { Spotlight } from "../../../Primitives/Spotlight/Spotlight";
import type { SpotlightPromptProps } from "../../../Primitives/Spotlight/SpotlightSolid.types";

export const SpotlightPrompt = (props: SpotlightPromptProps) => <Spotlight {...props} mode={"prompt"} />;
