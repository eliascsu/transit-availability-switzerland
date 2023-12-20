export default function CustomDesc() {
    return (
        <div id ="custom-map-description" className="reveal">
            <h2 id="title1">Custom</h2>
            <p id="info1">
                On the following page you can try to improve the transit connectivity of Switzerland. To start drawing a new line, press the button on the right and 
                add as many points as you'd like. To finish creating a line, you need to select the type of transportation
                and the interval in which the line runs. The number of people you have connected to public transit will then be displayed on the right, 
                and the public transit availability map will be updated accordingly.

                You can add as many lines as you'd like, and as many stops as you want. Just be aware
                that it might not be feasible to build a train station in the middle of a forest, or create a bus line that is 
                hundreds of kilometers long ;).
            </p>
            <h2 id="title2">Unserved population</h2>
            <p id="info2">
                This layer should serve as an aid to help you identify areas that are not connected to public transit. 
                Consider adding lines that connect people from these areas to bigger
                transit hubs to improve the likelihood of people using public transit.
            </p>
        </div>
    )
}