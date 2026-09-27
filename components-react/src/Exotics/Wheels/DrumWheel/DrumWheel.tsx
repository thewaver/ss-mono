import { Wheel } from "../../../Primitives/Wheel/Wheel";
import type { DrumWheelProps } from "../../../Primitives/Wheel/Wheel.types";

export const DrumWheel = <T,>(props: DrumWheelProps<T>) => <Wheel<T> {...props} variant={"drum"} />;
