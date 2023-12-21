import { useEffect, useContext, useState } from "react";
import double_down_chevron from "../../svg/double_down_chevron.svg";
import double_up_chevron from "../../svg/double_up_chevron.svg";
import { ThemeContext } from "../../App";

import "../css/bundle.css";

export function ScrollToBottom() {
    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
        });
    };
    return (
        <div className="scroll-to-bottom" onClick={scrollToBottom}>
            <img src={double_down_chevron}></img>
        </div>
    );
}

export function ScrollToTop() {
    const context = useContext(ThemeContext);
    const [theme, setTheme] = useState(context[0]);

    useEffect(() => {
        setTheme(theme === "light" ? "dark" : "light");
    }, [context[1]]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className="scroll-to-top" id={theme} onClick={scrollToTop}>
            <img src={double_up_chevron}></img>
        </div>
    );
}