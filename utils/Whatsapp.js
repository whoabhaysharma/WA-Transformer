/**
 * WhatsApp Web Utility Module
 * Provides functions to interact with the input field on WhatsApp Web.
 * 
 * Functions:
 * - getInputContent(): Gets the current content of the input field.
 * - setInputContent(message): Updates the content of the input field.
 */

/**
 * Private function to get the message input field on WhatsApp Web.
 * This is used internally by the other functions in this module.
 * 
 * @returns {HTMLElement | null} The input field element or null if not found.
 */
function getInputFieldElement() {
    // Locate the input field using its attributes
    return document.querySelector("div[contenteditable='true'][data-tab='10']");
}

/**
 * Get the current content of the input field.
 * 
 * @returns {string | null} The content of the input field or null if not found.
 */
function getInputContent() {
    const inputField = getInputFieldElement();
    if (inputField) {
        return inputField.textContent; // Get the current text from the input field
    } else {
        console.error("Input field not found. Ensure you are on an active chat screen.");
        return null;
    }
}

/**
 * Set the content of the input field.
 * 
 * @param {string} message - The message to set in the input field.
 */
function setInputContent(message) {
    const inputField = getInputFieldElement();
    if (inputField) {
        // Focus the input field to simulate user interaction
        inputField.focus();

        // Simulate a paste action to set the input content
        const dataTransfer = new DataTransfer();
        dataTransfer.setData('text/plain', message);

        const pasteEvent = new ClipboardEvent('paste', {
            bubbles: true,
            cancelable: true,
            dataType: 'text/plain',
            clipboardData: dataTransfer
        });

        // Dispatch the paste event to simulate user input
        inputField.dispatchEvent(pasteEvent);

        console.log("Message set successfully!");
    } else {
        console.error("Input field not found. Ensure you are on an active chat screen.");
    }
}

// Exporting functions for external use
export { getInputContent, setInputContent, getInputFieldElement };