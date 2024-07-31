let form = null;
let currentFieldIndex = -1;
let responses = {};
let messages = [];
let uniqueId = '';
let theme = 'Light';
let isFormCompleted = false;

const messagesContainer = document.getElementById('chatBot-messages');
const inputForm = document.getElementById('chatBot-input-form');
const inputContainer = document.getElementById('chatBot-input-container');
const skipButton = document.getElementById('chatBot-skip-button');

async function fetchFormAndUniqueId() {
  try {
    const formResponse = await axios.get(`/api/form/${formId}`);
    form = formResponse.data;
    const uniqueIdResponse = await axios.get(`/api/generate-unique-id/${formId}`);
    uniqueId = uniqueIdResponse.data.uniqueId;

    setTheme(form.background || 'Light');
    addMessage('bot', 'Hello!');
    addMessage('bot', form.title);
    addMessage('bot', form.description);
    askNextQuestion(0);
  } catch (error) {
    console.error('Error fetching form and unique ID:', error);
    addMessage('bot', 'Error loading the form. Please try again later.');
  }
}

function setTheme(newTheme) {
  theme = newTheme;
  document.getElementById('chatBot-wrapper').className = `chatBot-wrapper ${theme.toLowerCase()}`;
}

function addMessage(type, content, fieldType, options) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chatBot-message chatBot-${type}`;

  if (type === 'bot') {
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'chatBot-avatar';
    messageDiv.appendChild(avatarDiv);
  }

  const contentSpan = document.createElement('span');
  contentSpan.className = 'chatBot-content';
  contentSpan.textContent = content;
  messageDiv.appendChild(contentSpan);

  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function askNextQuestion(index) {
  if (form && form.fields && index < form.fields.length) {
    const field = form.fields[index];
    const requiredText = field.required ? ' (Required)' : ' (Optional)';
    addMessage('bot', field.errorMessage + requiredText, field.type, field.options);
    renderInput(field);
    currentFieldIndex = index;
  } else if (form && index === form.fields.length) {
    addMessage('bot', 'Thank you for completing the form!');
    isFormCompleted = true;
    disableInput();
    submitResponses();
  }
}

function renderInput(field) {
  inputContainer.innerHTML = '';
  skipButton.style.display = field && !field.required ? 'inline-block' : 'none';

  switch (field.type) {
    case 'Text':
    case 'Email':
    case 'Phone':
    case 'Number':
      const input = document.createElement('input');
      input.type = field.type.toLowerCase();
      input.className = 'chatBot-input';
      input.placeholder = `Enter ${field.label}`;
      inputContainer.appendChild(input);
      break;
    case 'Date':
      const dateInput = document.createElement('input');
      dateInput.type = 'date';
      dateInput.className = 'chatBot-input';
      inputContainer.appendChild(dateInput);
      break;
    case 'Radio':
      const radioContainer = document.createElement('div');
      radioContainer.className = 'chatBot-radio-container';
      field.options.forEach((option) => {
        const label = document.createElement('label');
        label.className = 'chatBot-radio-label';
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = field.label;
        radio.value = option;
        label.appendChild(radio);
        label.appendChild(document.createTextNode(option));
        radioContainer.appendChild(label);
      });
      inputContainer.appendChild(radioContainer);
      break;
    case 'Checkbox':
      const checkboxContainer = document.createElement('div');
      checkboxContainer.className = 'chatBot-checkbox-container';
      field.options.forEach((option) => {
        const label = document.createElement('label');
        label.className = 'chatBot-checkbox-label';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = field.label;
        checkbox.value = option;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(option));
        checkboxContainer.appendChild(label);
      });
      inputContainer.appendChild(checkboxContainer);
      break;
    case 'StarRating':
      const starRating = document.createElement('div');
      starRating.className = 'chatBot-star-rating';
      for (let i = 1; i <= 5; i++) {
        const starButton = document.createElement('button');
        starButton.type = 'button';
        starButton.textContent = i;
        starButton.addEventListener('click', () => handleStarRating(i));
        starRating.appendChild(starButton);
      }
      inputContainer.appendChild(starRating);
      break;
    case 'WordRating':
    case 'Dropdown':
      const select = document.createElement('select');
      select.className = 'chatBot-select';
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Select an option';
      select.appendChild(defaultOption);
      field.options.forEach((option) => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
      });
      inputContainer.appendChild(select);
      break;
    default:
      const defaultInput = document.createElement('input');
      defaultInput.type = 'text';
      defaultInput.className = 'chatBot-input';
      defaultInput.placeholder = `Enter ${field.label}`;
      inputContainer.appendChild(defaultInput);
  }
}

function handleStarRating(rating) {
  const stars = document.querySelectorAll('.chatBot-star-rating button');
  stars.forEach((star, index) => {
    star.classList.toggle('active', index < rating);
  });
}

async function handleUserResponse(response) {
  addMessage('user', response);

  if (form && form.fields && currentFieldIndex < form.fields.length) {
    const currentField = form.fields[currentFieldIndex];
    responses[currentField._id] = response;
    
    try {
      await submitResponses([{ field: currentField.label, value: response }]);
    } catch (error) {
      console.error("Error during submission:", error);
      addMessage('bot', "There was an error submitting your response. Please try again.");
      return;
    }
    
    currentFieldIndex++;
    askNextQuestion(currentFieldIndex);
  }
}

function handleSkip() {
  if (form && form.fields && currentFieldIndex < form.fields.length) {
    const currentField = form.fields[currentFieldIndex];
    addMessage('user', 'Skipped');
    addMessage('bot', `Okay, I've skipped the "${currentField.label}" field.`);
    currentFieldIndex++;
    askNextQuestion(currentFieldIndex);
  }
}

async function submitResponses(newResponses = []) {
  if (form) {
    try {
      const submissionData = {
        formId: form._id,
        uniqueId: uniqueId,
        responses: newResponses
      };

      const response = await axios.post('/api/submit-response', submissionData);
      console.log("Submission response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error submitting responses:', error);
      throw error;
    }
  } else {
    console.error('Form is not available');
    throw new Error('Form is not available');
  }
}

function disableInput() {
  inputContainer.innerHTML = '';
  skipButton.style.display = 'none';
  const submitButton = document.querySelector('.chatBot-send-button');
  if (submitButton) {
    submitButton.disabled = true;
  }
}

inputForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (isFormCompleted) return;

  let response;
  const currentField = form.fields[currentFieldIndex];

  switch (currentField.type) {
    case 'Radio':
      response = document.querySelector(`input[name="${currentField.label}"]:checked`)?.value;
      break;
    case 'Checkbox':
      response = Array.from(document.querySelectorAll(`input[name="${currentField.label}"]:checked`))
        .map(checkbox => checkbox.value);
      break;
    case 'StarRating':
      response = document.querySelectorAll('.chatBot-star-rating button.active').length;
      break;
    case 'WordRating':
    case 'Dropdown':
      response = document.querySelector('.chatBot-select').value;
      break;
    default:
      response = inputContainer.querySelector('input')?.value;
  }

  if (response) {
    await handleUserResponse(response);
    const input = inputContainer.querySelector('input');
    if (input) {
      input.value = '';
    }
  }
});

skipButton.addEventListener('click', handleSkip);

fetchFormAndUniqueId();