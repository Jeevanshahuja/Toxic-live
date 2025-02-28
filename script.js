document.getElementById("analyzeBtn").addEventListener("click", async function () {
    let text = document.getElementById("textInput").value.trim();
    let resultBox = document.getElementById("result");
    let statusText = document.getElementById("statusText");

    if (text === "") {
        alert("Please enter a sentence.");
        return;
    }

    resultBox.classList.remove("hidden");
    resultBox.classList.add("loading");
    statusText.innerText = "Checking...";

    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyA40oa3Rt25udBUBRUTCSR8xeLDduSWba0", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Classify this caption as a toxic or clean situation and reply in one word at any cost either toxic or clean: "${text}"` }]
                }]
            }),
        });

        const data = await response.json();
        console.log("Gemini API Response:", data);

        if (data && data.candidates && data.candidates.length > 0) {
            const result = data.candidates[0].content.parts[0].text.trim().toLowerCase();

            if (result === "clean" || result === "toxic") {
                resultBox.classList.remove("loading", "clean", "toxic");
                resultBox.classList.add(result);
                statusText.innerText = result === "toxic" ? "Toxic ⚠️" : "Clean ✅";
            } else {
                statusText.innerText = "Error in response";
            }
        } else {
            statusText.innerText = "Error in response";
        }
    } catch (error) {
        console.error("Error:", error);
        statusText.innerText = "API Error";
    }
});
