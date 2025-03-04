/**
 * Update the preview container with the current output content
 */
function updatePreview() {
    const outputHtml = document.getElementById('output-html').value;
    const previewContainer = document.getElementById('preview-container');
    
    if (!outputHtml.trim()) {
        previewContainer.innerHTML = '<p>No content to preview</p>';
        return;
    }
    
    // Get the current template
    const templateId = templateManager.currentTemplate;
    const template = templateManager.templates[templateId];
    
    if (!template) {
        previewContainer.innerHTML = '<p>Selected template not found</p>';
        return;
    }
    
    // Get the template CSS
    const templateCssContainer = document.getElementById(`${templateId}-template-css`);
    let cssContent = templateCssContainer.textContent;
    
    // Apply customizations based on template
    switch (templateId) {
        case 'faq':
            cssContent = applyFaqCustomizations(cssContent);
            break;
        case 'srp':
            // No customizations needed for SRP template
            break;
        // Add cases for additional templates here
    }
    
    // Create a wrapper for the preview that can receive dark mode styles
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    previewContainer.innerHTML = `
        <style>
            ${cssContent}
            
            /* Dark mode specific overrides for the preview */
            .dark-mode-preview {
                background-color: var(--bg-color);
                color: var(--text-color);
            }
            
            /* FAQ template-specific dark mode styles */
            .dark-mode-preview #faq-section {
                background-color: var(--section-bg);
            }
            .dark-mode-preview details[open] summary {
                background: var(--highlight-bg);
            }
            
            /* SRP template-specific dark mode styles */
            .dark-mode-preview .container {
                background-color: var(--section-bg);
            }
            .dark-mode-preview a {
                color: #4da6ff;
            }
        </style>
        <div class="${isDarkMode ? 'dark-mode-preview' : ''}">
            ${outputHtml}
        </div>
    `;
}

/**
 * Apply customizations to FAQ template CSS
 * @param {string} cssContent - Original CSS content
 * @return {string} Updated CSS content
 */
function applyFaqCustomizations(cssContent) {
    // Update the arrow color in the CSS
    const arrowColor = document.getElementById('arrow-color-text').value;
    
    // Find the summary::after rule with the color property
    const summaryAfterRegex = /summary::after\s*{[^}]*color:\s*[^;]+;/g;
    const match = cssContent.match(summaryAfterRegex);
    
    if (match && match[0]) {
        // Replace the color value with the new one
        const colorRegex = /#[0-9a-fA-F]{3,6}/;
        const updatedRule = match[0].replace(colorRegex, arrowColor);
        cssContent = cssContent.replace(match[0], updatedRule);
    }
    
    return cssContent;
}/**
 * Update the preview container with the current output content
 */
function updatePreview() {
    const outputHtml = document.getElementById('output-html').value;
    const previewContainer = document.getElementById('preview-container');
    
    if (!outputHtml.trim()) {
        previewContainer.innerHTML = '<p>No content to preview</p>';
        return;
    }
    
    // Get the current template
    const templateId = templateManager.currentTemplate;
    const template = templateManager.templates[templateId];
    
    if (!template) {
        previewContainer.innerHTML = '<p>Selected template not found</p>';
        return;
    }
    
    // Get the template CSS
    const templateCssContainer = document.getElementById(`${templateId}-template-css`);
    let cssContent = templateCssContainer.textContent;
    
    // Apply customizations based on template
    switch (templateId) {
        case 'faq':
            cssContent = applyFaqCustomizations(cssContent);
            break;
        // Add cases for additional templates here
    }
    
    // Create a wrapper for the preview that can receive dark mode styles
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    previewContainer.innerHTML = `
        <style>
            ${cssContent}
            
            /* Dark mode specific overrides for the preview */
            .dark-mode-preview {
                background-color: var(--bg-color);
                color: var(--text-color);
            }
            .dark-mode-preview #faq-section {
                background-color: var(--section-bg);
            }
            .dark-mode-preview details[open] summary {
                background: var(--highlight-bg);
            }
        </style>
        <div class="${isDarkMode ? 'dark-mode-preview' : ''}">
            ${outputHtml}
        </div>
    `;
}

/**
 * Apply customizations to FAQ template CSS
 * @param {string} cssContent - Original CSS content
 * @return {string} Updated CSS content
 */
function applyFaqCustomizations(cssContent) {
    // Update the arrow color in the CSS
    const arrowColor = document.getElementById('arrow-color-text').value;
    
    // Find the summary::after rule with the color property
    const summaryAfterRegex = /summary::after\s*{[^}]*color:\s*[^;]+;/g;
    const match = cssContent.match(summaryAfterRegex);
    
    if (match && match[0]) {
        // Replace the color value with the new one
        const colorRegex = /#[0-9a-fA-F]{3,6}/;
        const updatedRule = match[0].replace(colorRegex, arrowColor);
        cssContent = cssContent.replace(match[0], updatedRule);
    }
    
    return cssContent;
}

/**
 * Update the arrow color in the CSS content
 * @param {string} cssContent - CSS content string
 * @param {string} color - New color in hex format
 * @return {string} Updated CSS content
 */
function updateArrowColor(cssContent, color) {
    // Find the summary::after rule with the color property
    const summaryAfterRegex = /summary::after\s*{[^}]*color:\s*[^;]+;/g;
    const match = cssContent.match(summaryAfterRegex);
    
    if (match && match[0]) {
        // Replace the color value with the new one
        const colorRegex = /#[0-9a-fA-F]{3,6}/;
        const updatedRule = match[0].replace(colorRegex, color);
        cssContent = cssContent.replace(match[0], updatedRule);
    }
    
    return cssContent;
}