import { useLayerContext } from "../LayerContext";

export function Score() {
    const {
        score
    } = useLayerContext();
    console.log("score: " + score);
    
    return (
        <div id="info_text">
            <h2>{score}</h2>
        </div>
    );
}