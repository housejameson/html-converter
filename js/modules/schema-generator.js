/**
 * FAQ Schema Generator Module
 * Generates JSON-LD schema markup for FAQ content
 */

/**
 * Generate schema markup for FAQ content
 * @param {string} htmlContent - The HTML content of the FAQ
 * @return {string} JSON-LD schema markup
 */
function generateFaqSchema(htmlContent) {
    // Create a parser to work with the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Base schema structure
    const schemaObject = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": []
    };
    
    // Find all details elements (which contain our questions and answers)
    const detailsElements = doc.querySelectorAll('details');
    
    // Process each details element
    detailsElements.forEach(details => {
        const summaryElement = details.querySelector('summary');
        
        // Skip if no summary (question) is found
        if (!summaryElement) return;
        
        // Get the question text
        const questionText = summaryElement.textContent.trim();
        
        // Find the answer content - this could be a <p> or other elements
        let answerContent = '';
        
        // Collect all content after the summary
        let currentNode = summaryElement.nextElementSibling;
        while (currentNode) {
            // Extract text content to strip HTML tags
            answerContent += currentNode.textContent + ' ';
            currentNode = currentNode.nextElementSibling;
        }
        
        // Create a question-answer pair
        const qaPair = {
            "@type": "Question",
            "name": questionText,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": answerContent.trim()
            }
        };
        
        // Add to the schema object
        schemaObject.mainEntity.push(qaPair);
    });
    
    // Convert the schema object to formatted JSON-LD script tag
    const jsonSchema = JSON.stringify(schemaObject, null, 2);
    return `<script type="application/ld+json">\n${jsonSchema}\n</script>`;
}

/**
 * Format the schema to display in UI
 * @param {string} schemaMarkup - The JSON-LD schema markup
 * @return {string} HTML-escaped schema markup for display
 */
function formatSchemaForDisplay(schemaMarkup) {
    // Replace < and > with their HTML entities
    return schemaMarkup
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}