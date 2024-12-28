import styles from './styles.module.css';
import React from "react";

export default function Label({ text = "" }) {
    return (
        <div className={styles.container}>
            <p>{text}</p>
        </div>
    )
}