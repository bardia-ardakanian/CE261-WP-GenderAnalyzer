const NameGenderApp = (() => {
  // API Endpoint for gender prediction
  const API_ENDPOINT = "https://api.genderize.io/?name=";
  
  // UI elements that we need to interact with
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

  // User data object to store name and selected gender
  let userData = { name: "", selectedGender: undefined };

  // Function to bind event listeners
  const eventBindings = () => {
    // Event listener for name input
    uiElements.nameField.addEventListener("input", handleNameInput);
    // Event listener for gender selection
    uiElements.analysisForm.addEventListener("change", handleGenderSelection);
    // Event listener for form submission
    uiElements.analysisForm.addEventListener("submit", processForm);
    // Event listener for record button click
    uiElements.recordButton.addEventListener("click", saveData);
    // Event listener for clear storage button click
    uiElements.clearStorageButton.addEventListener("click", clearStoredData);
  };

  // Function to handle name input
  const handleNameInput = (event) => {
    userData.name = event.target.value.trim();
  };

  // Function to handle gender selection
  const handleGenderSelection = () => {
    userData.selectedGender = document.querySelector('input[name="genderOption"]:checked')?.value;
  };

  // Function to process form submission
  const processForm = (event) => {
    event.preventDefault();
    const { name } = userData;

    if (!validateName(name)) return;

    setLoadingText();
    getGenderPrediction(name);
  };

  // Function to validate name input
  const validateName = (name) => {
    if (!name) {
      displayAlert("Please enter a name.");
      return false;
    }
    // Validate name format (letters and spaces)
    if (!name.match(/^[a-zA-Z ]{1,255}$/)) { 
      displayAlert("Name should only contain letters (a-z/A-Z) and be less than 255 characters");
      return false;
    }
    return true;
  };

  // Function to set loading text
  const setLoadingText = () => {
    uiElements.predictedGender.textContent = "Analyzing...";
    uiElements.confidenceScore.textContent = "";
  };

  // Function to get gender prediction from the API
  const getGenderPrediction = (name) => {
    fetch(`${API_ENDPOINT}${name}`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(data => updateUIWithPrediction(data))
      .catch(error => displayAlert(`Error: ${error.message}`));
  };

  // Function to update UI with gender prediction
  const updateUIWithPrediction = (data) => {
    uiElements.predictedGender.textContent = `Gender: ${data.gender || "Unknown"}`;
    uiElements.confidenceScore.textContent = `Confidence: ${(data.probability * 100).toFixed(2)}%`;
    const storedGender = localStorage.getItem(userData.name);
    uiElements.storedResponses.textContent = storedGender ? `Stored: ${storedGender}` : "No stored data";
  };

  // Function to save user data to local storage
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

  // Function to clear stored data
  const clearStoredData = () => {
    const { name } = userData;
    localStorage.removeItem(name);
    uiElements.storedResponses.textContent = "Stored data cleared";
    displayAlert("");
  };

  // Function to display alert message
  const displayAlert = (message) => {
    uiElements.alertBox.textContent = message;
    uiElements.alertBox.style.display = message ? "block" : "none";
  };

  // Initialize the application
  const initApp = () => {
    eventBindings();
  };

  return {
    initApp
  };
})();

// Initialize the application when the DOM is loaded
window.addEventListener("DOMContentLoaded", NameGenderApp.initApp);
