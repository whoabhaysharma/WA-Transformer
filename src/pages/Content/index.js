import React from 'react';
import ReactDOM from 'react-dom/client';
import MagicButton from '../../components/MagicButton';

const CLASS = 'lexical-rich-text-input';
const INDEX = 1;

function renderComponent(element, root) {
    if (root) {
        root.unmount();
    }

    // Create a new div to render the component
    const siblingDiv = document.createElement('div');
    siblingDiv.style.display = 'flex';
    siblingDiv.style.alignItems = 'end';
    siblingDiv.style.marginBottom = '2px';
    siblingDiv.style.marginRight = '10px'; // Adjust as needed

    // Insert the new div before the target element
    element.parentNode.insertBefore(siblingDiv, element);

    root = ReactDOM.createRoot(siblingDiv);
    root.render(<MagicButton />);
    return root;
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
            byClassName: elements.length,
            byQuerySelector: elementsByQuery.length,
            rawSelector: selector,
            isCurrentlyRendered: isRendered
        });

        const element = elements[index] || elementsByQuery[index];

        if (element && (!isRendered || element !== previousElement)) {
            console.log('✅ Element found! Rendering component...');
            root = renderComponent(element, root);
            isRendered = true;
            previousElement = element;
            callback(element);
        } else if (!element && isRendered) {
            console.log('❌ Element removed, cleaning up render...');
            if (root) {
                root.unmount();
            }
            isRendered = false;
            root = null;
            previousElement = null;
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
