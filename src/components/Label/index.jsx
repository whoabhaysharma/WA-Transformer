import styles from './styles.module.css';
import React from "react";

export default function Label({ text = "", onClick = () => { } }) {
    return (
        <div onClick={onClick} className={styles.container}>
            <p>{text}</p>
        </div>
    )
}