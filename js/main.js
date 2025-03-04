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

// The loadTemplates function is now in the template-manager.js file

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
    });
    
    // Clear input button
document.getElementById('clear-input-btn').addEventListener('click', function() {
    // Clear the input
    document.getElementById('input-html').value = '';
    
    // Also clear the output
    document.getElementById('output-html').value = '';
    
    // Reset the preview
    document.getElementById('preview-container').innerHTML = '<p>No content to preview</p>';
});
    
    // Copy output button
    document.getElementById('copy-output-btn').addEventListener('click', function() {
        copyToClipboard('output-html');
    });
    
    // Automatically update the preview when output changes
    document.getElementById('output-html').addEventListener('input', debounce(updatePreview, 500));
    
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
}