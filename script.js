document.addEventListener("DOMContentLoaded", function () {
  const urlInput = document.getElementById("url");
  const loadingDiv = document.getElementById("loading");
  const resultDiv = document.getElementById("result");
  const errorMessage = document.getElementById("error-message");

  document.getElementById("urlForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let urlValue = urlInput.value.trim();
    errorMessage.textContent = ""; // Clear previous errors
    resultDiv.innerHTML = ""; // Clear previous result

    if (!urlValue) {
      errorMessage.textContent = "Please enter a valid URL.";
      return;
    }

    // Add default https:// if missing
    if (!urlValue.startsWith("http://") && !urlValue.startsWith("https://")) {
      urlValue = `https://${urlValue}`;
    }

    loadingDiv.style.display = "block";

    try {
      const response = await fetch("http://localhost:3000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlValue }),
      });

      const data = await response.json();
      loadingDiv.style.display = "none";

      if (response.ok) {
        const domain = new URL(data.finalUrl).hostname;
        resultDiv.innerHTML = `Final URL: <a href="${data.finalUrl}" target="_blank">${domain}</a>`;

        // Redirect user after a short delay
        setTimeout(() => {
          window.location.href = data.finalUrl;
        }, 2000);
      } else {
        errorMessage.textContent = data.error || "Failed to analyze the URL.";
      }
    } catch (error) {
      loadingDiv.style.display = "none";
      errorMessage.textContent = "Network error. Please try again.";
    }
  });
});
