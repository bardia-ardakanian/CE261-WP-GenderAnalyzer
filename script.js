const NameGenderApp = (() => {
    const API_ENDPOINT = "https://api.genderize.io/?name=";
    
    const uiElements = {
      nameField: document.querySelector("#nameField"),
      analysisForm: document.querySelector("#nameAnalysisForm"),
      recordButton: document.querySelector("#recordBtn"),
      predictedGender: document.querySelector("#predictedGender"),
      confidenceScore: document.querySelector("#confidenceScore"),
      storedResponses: document.querySelector("#storedResponses"),
      clearStorageButton: document.querySelector("#clearStorage"),
      alertBox: document.querySelector("#alertBox")
    };

    let userData = { name: "", selectedGender: undefined };

    const eventBindings = () => {
      uiElements.nameField.addEventListener("input", handleNameInput);
      uiElements.analysisForm.addEventListener("change", handleGenderSelection);
      uiElements.analysisForm.addEventListener("submit", processForm);
      uiElements.recordButton.addEventListener("click", saveData);
      uiElements.clearStorageButton.addEventListener("click", clearStoredData);
    };

    const handleNameInput = (event) => {
      userData.name = event.target.value.trim();
    };

    const handleGenderSelection = () => {
      userData.selectedGender = document.querySelector('input[name="genderOption"]:checked')?.value;
    };

    const processForm = (event) => {
      event.preventDefault();
      const { name } = userData;

      if (!validateName(name)) return;

      setLoadingText();
      getGenderPrediction(name);
    };

    const validateName = (name) => {
      if (!name) {
        displayAlert("Please enter a name.");
        return false;
      }
    //   Can only have 255 characters which are a-z/A-Z and space
      if (!name.match(/^[a-zA-Z ]{1,255}$/)) { 
        displayAlert("Name should only contain letters (a-z/A-Z) and be less than 255 characters");
        return false;
      }
      return true;
    };

    const setLoadingText = () => {
      uiElements.predictedGender.textContent = "Analyzing...";
      uiElements.confidenceScore.textContent = "";
    };

    const getGenderPrediction = (name) => {
      fetch(`${API_ENDPOINT}${name}`)
        .then(response => {
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          return response.json();
        })
        .then(data => updateUIWithPrediction(data))
        .catch(error => displayAlert(`Error: ${error.message}`));
    };

    const updateUIWithPrediction = (data) => {
      uiElements.predictedGender.textContent = `Gender: ${data.gender || "Unknown"}`;
      uiElements.confidenceScore.textContent = `Confidence: ${(data.probability * 100).toFixed(2)}%`;
      const storedGender = localStorage.getItem(userData.name);
      uiElements.storedResponses.textContent = storedGender ? `Stored: ${storedGender}` : "No stored data";
    };

    const saveData = () => {
      const { name, selectedGender } = userData;
      if (name && selectedGender) {
        localStorage.setItem(name, selectedGender);
        uiElements.storedResponses.textContent = `Stored: ${selectedGender}`;
        displayAlert("");
      } else {
        displayAlert("Please fill in the form and select a gender.");
      }
    };

    const clearStoredData = () => {
      const { name } = userData;
      localStorage.removeItem(name);
      uiElements.storedResponses.textContent = "Stored data cleared";
      displayAlert("");
    };

    const displayAlert = (message) => {
      uiElements.alertBox.textContent = message;
      uiElements.alertBox.style.display = message ? "block" : "none";
    };

    const initApp = () => {
      eventBindings();
    };

    return {
      initApp
    };
})();

window.addEventListener("DOMContentLoaded", NameGenderApp.initApp);
