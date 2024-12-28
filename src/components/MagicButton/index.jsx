import { Sparkles } from "lucide-react";
import styles from './styles.module.css';
import React, { useRef, useState, useEffect } from "react";
import Panel from "../Panel";
import Label from "../Label";
import { createPortal } from "react-dom";
import { getAnswer } from "../../services/aiService";

const PANEL_OFFSET = 10;
const SPARKLES_COLOR = '#8696a0';
const SPARKLES_SIZE = 20;

const labelItems = [
    { id: 1, text: "Refraze" },
    { id: 2, text: "Check 1" },
    { id: 3, text: "Test one" },
    { id: 4, text: "Magic Button" }
];

export default function MagicButton() {
    const buttonRef = useRef(null);
    const panelRef = useRef(null);
    const [showPanel, setShowPanel] = useState(false);

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

    const selectHandler = async () => {
        const prompt = "what is the meaning of life?";
        const answer = await getAnswer(prompt);
        console.log(answer, 'HELO WORLD')

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
                    id="PANEL"
                    ref={panelRef}
                    className={styles.panel}
                    style={getPanelStyle()}
                >
                    <Panel>
                        {labelItems.map(item => (
                            <Label onClick={() => selectHandler()} key={item.id} text={item.text} />
                        ))}
                    </Panel>
                </div>,
                document.body
            )}
        </>
    );
}