class KeySimulator {
    /**
     * Enum-like object for commonly used keys and their key codes.
     */
    static Keys = {
        Backspace: 8,
        Tab: 9,
        Enter: 13,
        Shift: 16,
        Ctrl: 17,
        Alt: 18,
        Escape: 27,
        Space: 32,
        ArrowLeft: 37,
        ArrowUp: 38,
        ArrowRight: 39,
        ArrowDown: 40,
        Delete: 46
    };

    /**
     * Simulates a key press.
     * @param {string} key - The key to simulate (e.g., 'Backspace', 'Enter', 'Tab').
     * @param {HTMLElement} [elementToFocus] - The element to focus on before simulating the key press (optional).
     */
    static simulate(key, elementToFocus) {
        // Focus on the specified element if provided
        if (elementToFocus) {
            elementToFocus.focus();
        }

        // Create and dispatch the key event
        const event = new KeyboardEvent('keydown', {
            key: key,
            code: key, // Usually the same as the key
            keyCode: this.getKeyCode(key), // Get the key code from the enum
            which: this.getKeyCode(key), // Same as keyCode
            bubbles: true,
            cancelable: true
        });

        // Dispatch the event on the currently focused element
        const focusedElement = document.activeElement;
        if (focusedElement) {
            focusedElement.dispatchEvent(event);
        } else {
            console.warn('No element is currently focused.');
        }
    }

    /**
     * Helper function to get the key code from the Keys enum.
     * @param {string} key - The key to look up.
     * @returns {number} The key code.
     */
    static getKeyCode(key) {
        return this.Keys[key] || 0; // Return 0 if the key is not found
    }
}

export default KeySimulator