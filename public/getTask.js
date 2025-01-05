document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('edit-task-form');
  const statusCheckbox = document.getElementById('status');
  const headlineInput = document.getElementById('headline');
  const detailsTextarea = document.getElementById('details');
  const saveButton = form.querySelector('.save-btn');
  const cancelButton = form.querySelector('.cancel-btn');
  const noticeField = document.createElement('p');
  noticeField.classList.add('notice');
  form.insertBefore(noticeField, form.firstChild); // Add notice field at the top

  // Extract username from the form or query
  const username = new URLSearchParams(window.location.search).get('username');

  // Handle form submission
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    const taskData = {
      id: form.querySelector('input[name="id"]').value,
      username: username, // Include the username
      headline: headlineInput.value.trim(),
      details: detailsTextarea.value.trim(),
      status: statusCheckbox.checked ? 'done' : 'not done',
    };

    // Clear the notice field
    noticeField.textContent = '';

    // Send POST request to /editsave
    fetch('/editsave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    })
      .then((response) => {
        if (response.ok) {
          noticeField.textContent = 'Task updated successfully!';
          noticeField.style.color = 'green';
          // Reload the page to reflect updates
          setTimeout(() => {
            location.reload();
          }, 1000);
        } else {
          throw new Error('Failed to update the task.');
        }
      })
      .catch((error) => {
        noticeField.textContent = error.message;
        noticeField.style.color = 'red';
      });
  });

  // Cancel button handler
  cancelButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to discard changes?')) {
      window.location.href = `/tasks?username=${username}`;
    }
  });

  // Validate inputs
  const validateInputs = () => {
    if (!headlineInput.value.trim() || !detailsTextarea.value.trim()) {
      saveButton.disabled = true;
    } else {
      saveButton.disabled = false;
    }
  };

  headlineInput.addEventListener('input', validateInputs);
  detailsTextarea.addEventListener('input', validateInputs);

  // Initial validation check
  validateInputs();
});
