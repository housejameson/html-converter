/**
 * Convert HTML content to the template format with CSS included
 * @param {string} htmlContent - Raw HTML content
 * @return {string} Converted HTML with CSS
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
        let convertedHtml;
        switch (templateId) {
            case 'faq':
                convertedHtml = convertToFaqTemplate(doc, template);
                break;
            case 'srp':
                convertedHtml = convertToSrpTemplate(doc, template);
                break;
            // Add cases for additional templates here
            default:
                throw new Error(`Conversion not implemented for template ${templateId}`);
        }
        
        // Get the template CSS
        const templateCssContainer = document.getElementById(`${templateId}-template-css`);
        if (!templateCssContainer) {
            throw new Error(`CSS for template ${templateId} not found`);
        }
        
        let cssContent = templateCssContainer.textContent;
        
        // Apply any customizations to the CSS
        switch (templateId) {
            case 'faq':
                cssContent = applyFaqCustomizations(cssContent);
                break;
            case 'srp':
                // No customizations needed for SRP template yet
                break;
            // Add cases for additional templates here
        }
        
        // Combine CSS and HTML, but only include style tag for FAQ template
        let output;
        if (templateId === 'srp') {
            // For SRP template, return only the HTML without style tags
            output = convertedHtml;
        } else {
            // For all other templates (including FAQ), include the style tags
            output = `<style>\n${cssContent}\n</style>\n\n${convertedHtml}`;
        }
        
        return output;
        
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
        
        // Determine if this is the last h3
        const isLastH3 = index === h3Elements.length - 1;
        
        // Find the next h3 element (if any)
        const nextH3 = isLastH3 ? null : h3Elements[index + 1];
        
        // Collect all content between this h3 and the next h3 (or end of document)
        let currentNode = h3.nextSibling;
        let contentAdded = false;
        
        while (currentNode && currentNode !== nextH3) {
            // Create a clone of the current node to add to details
            let nodeToAdd = null;
            
            if (currentNode.nodeType === Node.TEXT_NODE) {
                // If it's a text node with non-whitespace content, wrap it in a paragraph
                if (currentNode.textContent.trim()) {
                    const p = document.createElement('p');
                    p.textContent = currentNode.textContent.trim();
                    nodeToAdd = p;
                }
            } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
                // For element nodes, clone them
                nodeToAdd = currentNode.cloneNode(true);
            }
            
            // Add the node to details if it exists
            if (nodeToAdd) {
                details.appendChild(nodeToAdd);
                contentAdded = true;
            }
            
            // Get the next sibling before removing this node
            let nextNode = currentNode.nextSibling;
            
            // Remove the current node from the original document
            if (currentNode.parentNode) {
                currentNode.parentNode.removeChild(currentNode);
            }
            
            currentNode = nextNode;
        }
        
        // If no content was added, create an empty paragraph
        if (!contentAdded) {
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