const HousingDataZurichString = () => {
    return (
        <div>
            <h1>Heatmap</h1>
            <p>
                The heatmap shows the amount of people living per ha in Switzerland, 
                essentially the housing density. More than 99% of housing units in Switzerland 
                are geocoded and provided here. Households without an address in the province cannot be 
                geocoded, but are included in the center-coordinate of the province. Therefore it might be 
                possible for smaller provinces to have a higher displayed housing
                density than there actually is. For very large datapoints, we cut off the intensity at 
                40 people per ha, to preserve a higher range of colors. Additionally, citizens living in 
                suburbs of the city tend to use their car more often,
                therefore there could be a bigger realized potential and need for high quality public transit. 
                The exact formula for each heatmap intensity point is: <code>(((Actual Population) / 20) ** 2) + 0.5</code>.
            </p>
        </div>
    )
}

export { HousingDataZurichString };