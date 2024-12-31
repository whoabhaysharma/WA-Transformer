import { Pencil, Sparkles } from "lucide-react";
import styles from './styles.module.css';
import React, { useRef, useState, useEffect } from "react";
import Panel from "../Panel";
import Label from "../Label";
import { createPortal } from "react-dom";
import { getAnswer } from "../../services/aiService";
import { getInputContent, setInputContent } from "../../../utils/Whatsapp";
import KeySimulator from "../../../utils/KeySimulator";
import { CONVERTERS, WA_MANIPULATOR_CONFIG } from "../../constant/Keys";
import Storage from "../../../utils/Storage";
import Modal from "../Modal";
import { CONVERTER_PROMPT_TEMPLATE } from "../../constant/Prompts";
import { INPUT_PHRASE, INSTRUCTION } from "../../constant/Macros";

const PANEL_OFFSET = 10;
const SPARKLES_COLOR = '#8696a0';
const SPARKLES_SIZE = 20;

export default function MagicButton() {
    const buttonRef = useRef(null);
    const panelRef = useRef(null);
    const [showPanel, setShowPanel] = useState(false);
    const [converters, setConverters] = useState([])
    const [selectedConverter, setSelectedConverter] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

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

    const selectHandler = async (promptPrefix) => {
        setShowPanel(false)
        try {
            setLoading(true)
            const prompt = CONVERTER_PROMPT_TEMPLATE.replace(INSTRUCTION, promptPrefix).replace(INPUT_PHRASE, getInputContent());
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
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false)
        }

    }

    const onEdit = (item) => {
        setSelectedConverter(item);
    }

    const handleInputChange = (field, value) => {
        setSelectedConverter(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <>
            {createPortal(
                <Modal active={selectedConverter !== null}>
                    <Panel>
                        <div style={{ minWidth: "550px" }}>
                            <div style={{ width: "100%" }}>
                                <input
                                    type="text"
                                    value={selectedConverter?.label}
                                    class={styles.input}
                                    onChange={(e) => handleInputChange('label', e.target.value)}
                                />
                                <textarea
                                    value={selectedConverter?.prefixPrompt}
                                    class={styles.textarea}
                                    onChange={(e) => handleInputChange('prefixPrompt', e.target.value)}
                                ></textarea>
                            </div>
                            <div style={{ width: "100%" }}>
                                <button
                                    onClick={() => setSelectedConverter(null)}
                                    class={`${styles.button} ${styles.cancel}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    class={styles.button}
                                    onClick={() => {
                                        const config = Storage.get(WA_MANIPULATOR_CONFIG) || {};
                                        const updatedConverters = (config[CONVERTERS] || []).map(conv =>
                                            conv.id === selectedConverter.id ? selectedConverter : conv
                                        );
                                        Storage.set(WA_MANIPULATOR_CONFIG, {
                                            ...config,
                                            [CONVERTERS]: updatedConverters
                                        });
                                        setConverters(updatedConverters);
                                        setSelectedConverter(null);
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </Panel>
                </Modal>,
                document.body
            )}
            <div
                ref={buttonRef}
                className={styles.container}
                onClick={togglePanel}
            >
                {loading ? (
                    <div className={styles.loader}>
                        <div className={styles.spinner} />
                    </div>
                ) : (
                        <Sparkles
                            color={error ? "#ff0000" : SPARKLES_COLOR}
                            size={SPARKLES_SIZE}
                        />  

                )
                }
            </div>
            {createPortal(
                <div
                    ref={panelRef}
                    className={styles.panel}
                    style={getPanelStyle()}
                >
                    <Panel>
                        {converters.map(item => (
                            <Label
                                onClick={() => selectHandler(item.prefixPrompt)}
                                key={item.id}
                                text={item.label}
                            >
                                <div style={{ cursor: "pointer" }} onClick={() => onEdit(item)}>
                                    <Pencil
                                        color={SPARKLES_COLOR}
                                        size={15}
                                    />
                                </div>
                            </Label>
                        ))}
                    </Panel>
                </div>,
                document.body
            )}
        </>
    );
}


// div[aria - placeholder= "Type a message"] span