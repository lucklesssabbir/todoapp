document.addEventListener('DOMContentLoaded', () => {
  const username = new URLSearchParams(window.location.search).get('username');
  const notice = document.querySelector('.notice');

  if (!username || !/^[a-zA-Z]+$/.test(username)) {
    notice.innerHTML = 'Username not found. Redirecting to home page.';
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  }

  // Handle form submission to create a new task
  const form = document.getElementById('new-task-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const headline = document.getElementById('headline').value;
    const status = document.getElementById('status').checked
      ? 'done'
      : 'not done';
    const details = document.getElementById('details').value;

    fetch('/createnew', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        headline,
        status,
        details,
      }),
    })
      .then((response) => {
        if (response.ok) {
          notice.innerHTML = 'New task created successfully!';
          notice.style.color = 'green';
          alert('new task created wait 1s');
          setTimeout(() => {
            window.location.href = `/tasks?username=${username}`;
          }, 1000);
        } else {
          throw new Error('Failed to create task.');
        }
      })
      .catch((error) => {
        notice.innerHTML = error.message;
        notice.style.color = 'red';
        alert('error');
      });
  });

  // Handle cancel button (back to tasks page)
  document.querySelector('.cancel-btn').addEventListener('click', () => {
    window.location.href = `/tasks?username=${username}`;
  });
});
