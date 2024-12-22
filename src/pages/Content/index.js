import React from 'react';
import ReactDOM from 'react-dom/client';

const CLASS = 'lexical-rich-text-input';
const INDEX = 1;

function MyComponent() {
    return <div>Hello, I'm rendered here!</div>;
}

function waitForElement(selector, index, callback) {
    let root = null;
    let isRendered = false;
    let previousElement = null;

    const checkElement = () => {
        console.log('Checking element...', new Date().toISOString());
        
        const elements = document.getElementsByClassName(CLASS);
        const elementsByQuery = document.querySelectorAll(selector);
        
        console.log('Elements found:', {
            byClassName: Array.from(elements).length,
            byQuerySelector: Array.from(elementsByQuery).length,
            rawSelector: selector,
            isCurrentlyRendered: isRendered
        });

        const element = elements[index] || elementsByQuery[index];

        // Element exists but not rendered
        if (element && !isRendered) {
            console.log('✅ Element found! Rendering component...');
            if (root) {
                root.unmount(); // Cleanup any existing root
            }
            root = ReactDOM.createRoot(element);
            root.render(<MyComponent />);
            isRendered = true;
            previousElement = element;
            callback(element);
        } 
        // Element doesn't exist but was rendered
        else if (!element && isRendered) {
            console.log('❌ Element removed, cleaning up render...');
            if (root) {
                root.unmount();
            }
            isRendered = false;
            root = null;
            previousElement = null;
        }
        // Element exists but changed
        else if (element && isRendered && element !== previousElement) {
            console.log('🔄 Element changed, re-rendering...');
            if (root) {
                root.unmount();
            }
            root = ReactDOM.createRoot(element);
            root.render(<MyComponent />);
            previousElement = element;
            callback(element);
        }
    };

    const observer = new MutationObserver((mutations) => {
        console.log('🔄 DOM mutation detected:', {
            mutationsCount: mutations.length,
            timestamp: new Date().toISOString()
        });
        checkElement();
    });
    
    console.log('Setting up observer...');
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });

    checkElement();
    return observer;
}

waitForElement(`.${CLASS}`, INDEX, (targetElement) => {
    console.log('🎯 Callback executed with element:', targetElement);
});