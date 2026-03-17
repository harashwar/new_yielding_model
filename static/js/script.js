document.getElementById('predictionForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const loader = document.getElementById('loader');
    const resultSection = document.getElementById('resultSection');
    const errorMsg = document.getElementById('errorMsg');

    // Reset UI
    errorMsg.style.display = 'none';
    btnText.style.display = 'none';
    loader.style.display = 'block';
    submitBtn.disabled = true;

    const data = {
        crop: document.getElementById('crop').value,
        rainfall: parseFloat(document.getElementById('rainfall').value),
        temperature: parseFloat(document.getElementById('temperature').value)
    };

    try {
        const response = await fetch('https://new-yielding-model.onrender.com/api/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
            document.getElementById('resValue').textContent = result.predicted_yield.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            document.getElementById('resRange').textContent = `Yielding Range: ${result.yield_range} hg/ha`;
            document.getElementById('resAccuracy').textContent = `Model Accuracy: ${result.model_accuracy_percent}%`;
            
            resultSection.style.display = 'block';
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            throw new Error(result.error || 'Prediction failed');
        }
    } catch (error) {
        errorMsg.textContent = `Error: ${error.message}`;
        errorMsg.style.display = 'block';
        resultSection.style.display = 'none';
    } finally {
        btnText.style.display = 'inline';
        loader.style.display = 'none';
        submitBtn.disabled = false;
    }
});

// Subtle background movement effect
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    document.querySelector('.bg-mesh').style.transform = `translate(${x * 20}px, ${y * 20}px)`;
});
