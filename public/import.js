document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('import-form');
  const fileInput = document.getElementById('file');
  const noticeField = document.getElementById('notice');
  const username = document.getElementById('username').value; // Get username

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    noticeField.textContent = ''; // Clear any previous notices
    noticeField.style.color = ''; // Reset color
    const file = fileInput.files[0];

    if (!file) {
      noticeField.textContent = 'Please upload a file.';
      noticeField.style.color = 'red';
      return;
    }

    if (file.type !== 'application/json') {
      noticeField.textContent =
        'Invalid file format. Only JSON files are allowed.';
      noticeField.style.color = 'red';
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);

        // Validate JSON structure
        if (!Array.isArray(jsonData)) {
          throw new Error('Invalid JSON format. Root should be an array.');
        }

        jsonData.forEach((task, index) => {
          if (
            typeof task.id !== 'string' ||
            typeof task.headline !== 'string' ||
            typeof task.details !== 'string' ||
            !['done', 'not done'].includes(task.status) ||
            typeof task.createdAt !== 'string'
          ) {
            throw new Error(`Invalid task format at index ${index + 1}.`);
          }
        });

        // If validation passes, submit the form
        const formData = new FormData();
        formData.append('file', file);
        formData.append('username', username); // Include username

        fetch(`/upload?username=${username}`, {
          method: 'POST',
          body: formData,
        })
          .then((response) => {
            if (response.ok) {
              noticeField.textContent =
                'File uploaded and processed successfully!';
              noticeField.style.color = 'green';
            } else {
              response.text().then((text) => {
                noticeField.textContent = `Server Error: ${text}`;
                noticeField.style.color = 'red';
              });
            }
          })
          .catch((error) => {
            noticeField.textContent = `Error: ${error.message}`;
            noticeField.style.color = 'red';
          });
      } catch (error) {
        noticeField.textContent = `Error: ${error.message}`;
        noticeField.style.color = 'red';
      }
    };

    reader.readAsText(file);
  });
});
