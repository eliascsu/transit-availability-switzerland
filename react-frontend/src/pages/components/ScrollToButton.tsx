import double_down_chevron from "../../svg/double_down_chevron.svg";
import double_up_chevron from "../../svg/double_up_chevron.svg";

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
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    return (
        <div className="scroll-to-top" onClick={scrollToTop}>
            <img src={double_up_chevron}></img>
        </div>
    );
}