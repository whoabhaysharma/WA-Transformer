import React from "react";
import styles from "./styles.module.css";

export default function Modal({active = false, children}) { 
    return (
        <div className={`${styles.modal} ${active ? styles.active : ''}`}>
            {children}
        </div>
    )
}