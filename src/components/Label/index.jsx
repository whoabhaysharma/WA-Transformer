import styles from './styles.module.css';
import React from "react";

export default function Label({ text = "", onClick = () => { }, children }) {
    return (
        <div className={styles.container}>
            <p style={{ cursor: "pointer" }} onClick={onClick}>{text}</p>
            {children}
        </div>
    )
}