/**
 * Main application initialization
 */
document.addEventListener('DOMContentLoaded', function() {
    // Load templates
    loadTemplates().then(() => {
        // Initialize UI elements
        initUI();
        
        // Setup event listeners
        setupEventListeners();
    });
});

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Convert button
    document.getElementById('convert-btn').addEventListener('click', function() {
        const inputHtml = document.getElementById('input-html').value;
        const convertedHtml = convertHtmlToTemplate(inputHtml);
        document.getElementById('output-html').value = convertedHtml;
        updatePreview(); // This automatically updates the preview
        updateSchemaMarkup(); // Generate schema after conversion for FAQ template
    });
    
    // Clear input button
    document.getElementById('clear-input-btn').addEventListener('click', function() {
        // Clear the input
        document.getElementById('input-html').value = '';
        
        // Also clear the output
        document.getElementById('output-html').value = '';
        
        // Reset the preview
        document.getElementById('preview-container').innerHTML = '<p>No content to preview</p>';
        
        // Reset the schema display if it exists
        const schemaDisplay = document.getElementById('schema-display');
        if (schemaDisplay) {
            schemaDisplay.textContent = 'No schema generated yet. Convert your FAQ content first.';
        }
    });
    
    // Copy output button
    document.getElementById('copy-output-btn').addEventListener('click', function() {
        copyToClipboard('output-html');
    });
    
    // Copy schema button
    document.getElementById('copy-schema-btn')?.addEventListener('click', function() {
        const schemaDisplay = document.getElementById('schema-display');
        
        // Create a temporary textarea to copy from
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = schemaDisplay.textContent;
        document.body.appendChild(tempTextarea);
        
        // Select and copy
        tempTextarea.select();
        document.execCommand('copy');
        
        // Clean up
        document.body.removeChild(tempTextarea);
        
        // Show feedback
        showFeedback('Schema copied to clipboard!');
    });
    
    // Automatically update the preview when output changes
    document.getElementById('output-html').addEventListener('input', debounce(function() {
        updatePreview();
        updateSchemaMarkup();
    }, 500));
    
    // Color picker events
    document.getElementById('arrow-color').addEventListener('input', function() {
        document.getElementById('arrow-color-text').value = this.value;
        updatePreview();
    });
    
    document.getElementById('arrow-color-text').addEventListener('input', function() {
        if (isValidHexColor(this.value)) {
            document.getElementById('arrow-color').value = this.value;
            updatePreview();
        }
    });
    
    // Template selector change event (if not already handled in template-manager.js)
    document.getElementById('template-select').addEventListener('change', function() {
        const selectedTemplate = this.value;
        templateManager.setCurrentTemplate(selectedTemplate);
        
        // Update the schema section visibility
        toggleTemplateOptions(selectedTemplate);
        
        // Update preview and schema if output exists
        if (document.getElementById('output-html').value.trim()) {
            updatePreview();
            updateSchemaMarkup();
        }
    });
}

/**
 * Toggle visibility of template-specific options
 * @param {string} templateId - ID of the selected template
 */
function toggleTemplateOptions(templateId) {
    // Get the template configuration
    const template = templateManager.getTemplate(templateId);
    if (!template) return;
    
    // Toggle arrow color control for FAQ template
    const colorControl = document.querySelector('.color-control');
    if (colorControl) {
        colorControl.style.display = templateId === 'faq' ? 'flex' : 'none';
    }
    
    // Toggle schema section visibility
    const schemaSection = document.getElementById('schema-section');
    if (schemaSection) {
        schemaSection.style.display = templateId === 'faq' ? 'block' : 'none';
    }
}

/**
 * Update schema markup in the schema display
 */
function updateSchemaMarkup() {
    // Only proceed if FAQ template is selected
    if (templateManager.currentTemplate !== 'faq') return;
    
    const outputHtml = document.getElementById('output-html').value;
    const schemaDisplay = document.getElementById('schema-display');
    
    if (!schemaDisplay) return;
    
    if (!outputHtml.trim()) {
        schemaDisplay.textContent = 'No schema generated yet. Convert your FAQ content first.';
        return;
    }
    
    try {
        // Generate the schema markup
        const schemaMarkup = generateFaqSchema(outputHtml);
        
        // Format and display the schema
        schemaDisplay.textContent = schemaMarkup;
    } catch (error) {
        console.error('Error generating schema:', error);
        schemaDisplay.textContent = 'Error generating schema. Please check the console for details.';
    }
}