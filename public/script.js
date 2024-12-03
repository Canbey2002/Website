document.addEventListener("DOMContentLoaded", () => {
    let systemArmed = false; // Initial state: system disarmed
    let previousLightLevel = null; // Track changes in light level
    let previousUltrasonicDistance = null; 
    const lightChangeThreshold = 50; 
    const ultrasonicChangeThreshold = 10; 

    // Fetch sensor data from server
    async function fetchSensorData() {
        try {
            const response = await fetch('/api/sensors');
            const data = await response.json();

            // Update sensor readings on the UI
            document.getElementById("light-level").textContent = data.lightLevel || "N/A";
            document.getElementById("temperature").textContent = data.temperature || "N/A";
            document.getElementById("humidity-level").textContent = data.humidity || "N/A";
            document.getElementById("ultrasonic-distance").textContent = data.ultrasonicDistance || "N/A";

            
            if (systemArmed) {
                detectIntruder(data.lightLevel, data.ultrasonicDistance);
            }
        } catch (error) {
            console.error("Error fetching sensor data:", error);
        }
    }

   
    function detectIntruder(currentLightLevel, currentUltrasonicDistance) {
        let lightChanged = false;
        let distanceChanged = false;

        
        if (previousLightLevel !== null) {
            lightChanged = Math.abs(currentLightLevel - previousLightLevel) > lightChangeThreshold;
        }
        previousLightLevel = currentLightLevel;

        // Check for significant distance change
        if (previousUltrasonicDistance !== null) {
            distanceChanged = Math.abs(currentUltrasonicDistance - previousUltrasonicDistance) > ultrasonicChangeThreshold;
        }
        previousUltrasonicDistance = currentUltrasonicDistance;

        // If either condition is true, an intruder is detected
        const intruderDetected = lightChanged || distanceChanged;
        const intruderStatus = document.getElementById("intruder-status");

        if (intruderDetected) {
            intruderStatus.textContent = "Yes";
            intruderStatus.className = "status active";

            // Confirmation dialog for intruder action
            const userChoice = confirm("Intruder detected! Would you like to DISARM the system? (Click 'Cancel' to call the police)");
            if (userChoice) {
                toggleArmedStatus(); // Disarm the system
            } else {
                alert("Police called!");
            }
        } else {
            intruderStatus.textContent = "No";
            intruderStatus.className = "status inactive";
        }
    }

    // Toggle armed/disarmed state
    function toggleArmedStatus() {
        systemArmed = !systemArmed;
        const armedStatus = document.getElementById("armed-status");

        if (systemArmed) {
            armedStatus.textContent = "Yes";
            armedStatus.className = "status active";
            document.getElementById("arm-disarm-button").textContent = "Disarm System";
        } else {
            armedStatus.textContent = "No";
            armedStatus.className = "status inactive";
            document.getElementById("arm-disarm-button").textContent = "Arm System";
        }
    }

    // Reset baseline values
    function resetBaseline() {
        alert("Baseline reset.");
        previousLightLevel = null;
        previousUltrasonicDistance = null;
    }

    
    document.getElementById("arm-disarm-button").addEventListener("click", toggleArmedStatus);
    document.getElementById("reset-baseline-button").addEventListener("click", resetBaseline);

    
    setInterval(fetchSensorData, 1000); // Fetch every second
});
