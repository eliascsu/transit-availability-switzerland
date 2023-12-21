import { useLayerContext } from "../ctx/LayerContext";

export function Score() {
    const {
        score
    } = useLayerContext();
    console.log("score: " + score);
    
    return (
        <div id="info_text">
            <h2>{score} people now served</h2>
        </div>
    );
}