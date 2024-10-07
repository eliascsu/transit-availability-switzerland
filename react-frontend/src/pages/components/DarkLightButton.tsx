import sun from '../../svg/sun_icon.svg';
import moon from '../../svg/moon_outline_icon.svg';
import { ThemeContext } from '../../App';
import { useContext } from 'react';
import LightModeTwoToneIcon from '@mui/icons-material/LightModeTwoTone';
import DarkModeTwoToneIcon from '@mui/icons-material/DarkModeTwoTone';

function DarkLightButton() {
    const context = useContext(ThemeContext);

    if (context[0] === "dark") {
        return (
            <a id="switch" onClick={context[1]}>
                <LightModeTwoToneIcon/>
            </a>
        );
    } else {
        return (
            <a id="switch" onClick={context[1]}>
                <DarkModeTwoToneIcon/>
            </a>
        );
    }
}

export default DarkLightButton;
