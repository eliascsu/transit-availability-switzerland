import { lineColors } from "./colors";

/**
 * Returns the color of the line based on the line type
 * @param lineType Either "Tram", "Bus" or "S_Bahn"
 * @returns Color of the line
 */
function getLineColor (lineType: string) {
    let lineColor: string;
    switch (lineType) {
        case "Tram": { 
            lineColor = lineColors.Tram;
            break;
         } 
         case "Bus": { 
             lineColor = lineColors.Bus;
             break;
         } 
         case "S_Bahn": { 
             lineColor = lineColors.S_Bahn;
             break
         }
         default: { 
            console.log("BAD LINE"); 
            lineColor = "#000000";
            break; 
         }
        }
    return lineColor;
}

export { getLineColor };