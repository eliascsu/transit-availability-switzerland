import double_down_chevron from "../../svg/double_down_chevron.svg";
import double_up_chevron from "../../svg/double_up_chevron.svg";

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
    let mediaQueryObj = window.matchMedia('(prefers-color-scheme: dark)');
    let isDarkMode = mediaQueryObj.matches;

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (isDarkMode) {
        return (
            <div className="scroll-to-top" onClick={scrollToTop}>
                <img src={double_up_chevron}></img>
            </div>
        );
    } else {
        return (
            <div className="scroll-to-top invert-img" onClick={scrollToTop}>
                <img src={double_up_chevron}></img>
            </div>
        );
    }
}