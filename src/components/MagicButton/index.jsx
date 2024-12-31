import { Sparkles } from "lucide-react";
import styles from './styles.module.css';
import React, { useRef, useState, useEffect } from "react";
import Panel from "../Panel";
import Label from "../Label";
import { createPortal } from "react-dom";
import { getAnswer } from "../../services/aiService";
import { getInputContent, setInputContent } from "../../../utils/Whatsapp";
import KeySimulator from "../../../utils/KeySimulator";
import { CONVERTERS } from "../../constant/Keys";

const PANEL_OFFSET = 10;
const SPARKLES_COLOR = '#8696a0';
const SPARKLES_SIZE = 20;

export default function MagicButton() {
    const buttonRef = useRef(null);
    const panelRef = useRef(null);
    const [showPanel, setShowPanel] = useState(false);
    const [converters, setConverters] = useState([])

    useEffect(() => {
        const config = Storage.get(WA_MANIPULATOR_CONFIG);
        setConverters(config?.[CONVERTERS] || []);
    }, [])

    const togglePanel = () => {
        setShowPanel(prev => !prev);
    };

    const handleClickOutside = (event) => {
        if (panelRef.current && !panelRef.current.contains(event.target) &&
            buttonRef.current && !buttonRef.current.contains(event.target)) {
            setShowPanel(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getPanelStyle = () => {
        if (!buttonRef.current) return {};

        const buttonRect = buttonRef.current.getBoundingClientRect();

        return {
            bottom: (window.innerHeight - buttonRect.top) + PANEL_OFFSET,
            left: buttonRect.left,
            transform: `scale(${showPanel ? 1 : 0})`
        };
    };

    const selectHandler = async (prompt) => {
        setShowPanel(false)
        const prompt = `${prompt} - ${getInputContent()}`;
        const answer = await getAnswer(prompt);
        const inputContent = getInputContent();

        if (inputContent) {
            for (let i = 0; i < inputContent.length; i++) {
                setTimeout(() => {
                    KeySimulator.simulate("Backspace");
                }, i * 1);
            }
            setTimeout(() => {
                setInputContent(answer);
            }, inputContent.length * 1);
        } else {
            setInputContent(answer);
        }
    }

    return (
        <>
            <div
                ref={buttonRef}
                className={styles.container}
                onClick={togglePanel}
            >
                <Sparkles
                    color={SPARKLES_COLOR}
                    size={SPARKLES_SIZE}
                />
            </div>
            {createPortal(
                <div
                    ref={panelRef}
                    className={styles.panel}
                    style={getPanelStyle()}
                >
                    <Panel>
                        {converters.map(item => (
                            <Label onClick={() => selectHandler(item.prefixPrompt)} key={item.id} text={item.text} />
                        ))}
                    </Panel>
                </div>,
                document.body
            )}
        </>
    );
}


// div[aria - placeholder= "Type a message"] span