import {loadFont} from "@remotion/google-fonts/NotoSansJP";

export const {fontFamily: diagramFontFamily} = loadFont("normal", {
  weights: ["400", "500", "700", "900"],
  subsets: ["latin", "japanese"],
});
