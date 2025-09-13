const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateChartData = async (req, res) => {
    const { sqlContent, userPrompt } = req.body;

    if (!sqlContent || !userPrompt) {
        return res.status(400).json({ success: false, error: 'SQL content and user prompt are required.' });
    }

    // A prompt specifically engineered for Gemini to return clean JSON
    const fullPrompt = `
        TASK: Act as a JSON API. Based on the provided SQL schema/data and a user query, generate a valid JSON object for an amCharts 5 chart.

        RULES:
        1. Your entire response must be ONLY a raw, minified, RFC 8259 compliant JSON object.
        2. Do NOT include Markdown formatting.
        3. The JSON object must have "chartType" and "chartData" keys.

        CHART TYPE LOGIC:
        - If the user asks for a distribution, frequency, or histogram AND the data is suitable for grouping into at least 3 bins, use "histogram".
        - **FALLBACK:** If a histogram is requested but the data is too sparse or has too few unique values, generate a "bar" chart of the individual values instead. Do not fail.
        - For other requests, choose "bar", "line", "pie", or "scatter" as appropriate.

        CHART DATA FORMATS:
        - bar/line/pie: [{ "category": "...", "value": ... }]
        - scatter: [{ "x": ..., "y": ... }]
        - histogram: [{ "start": ..., "end": ..., "count": ... }]
        SQL Content:
        ---
        ${sqlContent}
        ---

        User Query: "${userPrompt}"
    `;

    try {
        // Select the Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Generate content
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const jsonText = response.text();

        // The response from the model is a JSON string, so we parse it.
        const generatedJson = JSON.parse(jsonText);

        res.status(200).json({ success: true, data: generatedJson });

    } catch (error) {
        console.error("--- ERROR CALLING GEMINI API ---");
        console.error("Error:", error.message);
        console.error("Full Error Object:", error);
        console.error("---------------------------------");
        res.status(500).json({
            success: false,
            error: 'Server error calling Gemini API. Check terminal logs.',
        });
    }
};

module.exports = { generateChartData };