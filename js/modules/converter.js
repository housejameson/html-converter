/**
 * Convert HTML content to the template format
 * @param {string} htmlContent - Raw HTML content
 * @return {string} Converted HTML
 */
function convertHtmlToTemplate(htmlContent) {
    if (!htmlContent.trim()) {
        return '';
    }

    try {
        // Get the current template
        const templateId = templateManager.currentTemplate;
        const template = templateManager.templates[templateId];
        
        if (!template) {
            throw new Error(`Template ${templateId} not found`);
        }
        
        // Create a temporary DOM parser
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        
        // Apply the appropriate conversion based on template
        switch (templateId) {
            case 'faq':
                return convertToFaqTemplate(doc, template);
            case 'srp':
                return convertToSrpTemplate(doc, template);
            // Add cases for additional templates here
            default:
                throw new Error(`Conversion not implemented for template ${templateId}`);
        }
    } catch (error) {
        console.error('Error converting HTML:', error);
        return 'Error converting HTML. Please check the console for details.';
    }
}

/**
 * Convert HTML content to FAQ template
 * @param {Document} doc - Parsed HTML document
 * @param {Object} template - Template configuration
 * @return {string} Converted HTML
 */
function convertToFaqTemplate(doc, template) {
    // Extract h2 title if it exists for the template heading
    let titleContent = 'FAQ Section';
    const h2Element = doc.querySelector('h2');
    if (h2Element) {
        titleContent = h2Element.innerHTML;
        h2Element.remove(); // Remove the original h2 from the content
    }
    
    // Find all h3 elements and transform them into summary elements
    const h3Elements = Array.from(doc.querySelectorAll('h3'));
    
    h3Elements.forEach((h3, index) => {
        // Create a new details element
        const details = document.createElement('details');
        
        // Create a new summary element with the content of the h3
        const summary = document.createElement('summary');
        summary.innerHTML = h3.innerHTML;
        
        // Add the summary to the details
        details.appendChild(summary);
        
        // Check if there's a paragraph after the h3
        let nextElement = h3.nextElementSibling;
        let paragraphAdded = false;
        
        // If there's a paragraph after the h3, add it to the details
        if (nextElement && nextElement.tagName.toLowerCase() === 'p') {
            const p = nextElement.cloneNode(true);
            details.appendChild(p);
            nextElement.remove();  // Remove the original paragraph
            paragraphAdded = true;
        } else {
            // Look for text content directly after the h3 or until the next h3
            let textContent = '';
            let currentNode = h3.nextSibling;
            
            // If we're at the last h3, collect all remaining content
            if (index === h3Elements.length - 1) {
                while (currentNode) {
                    if (currentNode.nodeType === Node.TEXT_NODE) {
                        textContent += currentNode.textContent;
                    } else if (currentNode.nodeType === Node.ELEMENT_NODE && 
                              currentNode.tagName.toLowerCase() !== 'h3') {
                        textContent += currentNode.outerHTML;
                    }
                    let nextNode = currentNode.nextSibling;
                    currentNode.parentNode.removeChild(currentNode);
                    currentNode = nextNode;
                }
            } else {
                // For h3s in the middle, collect until the next h3
                const nextH3 = h3Elements[index + 1];
                while (currentNode && currentNode !== nextH3) {
                    if (currentNode.nodeType === Node.TEXT_NODE) {
                        textContent += currentNode.textContent;
                    } else if (currentNode.nodeType === Node.ELEMENT_NODE && 
                              currentNode.tagName.toLowerCase() !== 'h3') {
                        textContent += currentNode.outerHTML;
                    }
                    let nextNode = currentNode.nextSibling;
                    if (currentNode !== nextH3) {
                        currentNode.parentNode.removeChild(currentNode);
                    }
                    currentNode = nextNode;
                }
            }
            
            // If we found any content, create a paragraph for it
            if (textContent.trim()) {
                const p = document.createElement('p');
                p.innerHTML = textContent.trim();
                details.appendChild(p);
                paragraphAdded = true;
            }
        }
        
        // If no paragraph was added, create an empty one to maintain structure
        if (!paragraphAdded) {
            const p = document.createElement('p');
            p.innerHTML = 'No description available.';
            details.appendChild(p);
        }
        
        // Replace the h3 with the details
        h3.parentNode.replaceChild(details, h3);
    });
    
    // Get the template structure
    const templateContainer = document.getElementById(`${template.config.id}-template`);
    let templateHTML = templateContainer.innerHTML;
    
    // Replace the template title with the extracted h2 content
    templateHTML = templateHTML.replace(/<h2><b>.*?<\/b><\/h2>/, `<h2><b>${titleContent}</b></h2>`);
    
    // Insert the converted content
    templateHTML = templateHTML.replace('<!-- Content will be inserted here by the converter -->', doc.body.innerHTML);
    
    return templateHTML;
}

/**
 * Convert HTML content to SRP template
 * @param {Document} doc - Parsed HTML document
 * @param {Object} template - Template configuration
 * @return {string} Converted HTML
 */
function convertToSrpTemplate(doc, template) {
    // Get the template structure
    const templateContainer = document.getElementById(`${template.config.id}-template`);
    let templateHTML = templateContainer.innerHTML;
    
    // For SRP template, we just insert the content as is
    templateHTML = templateHTML.replace('<!-- Content will be inserted here by the converter -->', doc.body.innerHTML);
    
    return templateHTML;
}

/**
 * Set first details element to be open by default
 * @param {string} html - HTML content with details elements
 * @return {string} Modified HTML
 */
function setFirstDetailsOpen(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const firstDetails = doc.querySelector('details');
    if (firstDetails) {
        firstDetails.setAttribute('open', '');
    }
    
    return doc.body.innerHTML;
}