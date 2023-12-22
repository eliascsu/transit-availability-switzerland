import sun from '../../svg/sun_icon.svg';
import moon from '../../svg/moon_outline_icon.svg';
import { ThemeContext } from '../../App';
import { useContext } from 'react';

function DarkLightButton() {
    const context = useContext(ThemeContext);

    if (context[0] === "dark") {
        return (
            <a id="switch" onClick={context[1]}>
                <img src={sun}/>
            </a>
        );
    } else {
        return (
            <a id="switch" onClick={context[1]}>
                <img src={moon}/>
            </a>
        );
    }
}

export default DarkLightButton;