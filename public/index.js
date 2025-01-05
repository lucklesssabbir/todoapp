document
  .querySelector('.sync form')
  .addEventListener('submit', async (event) => {
    event.preventDefault();

    const usernameInput = document.querySelector('#username');
    const notice = document.querySelector('.notice p');
    const username = usernameInput.value.trim();

    if (!username) {
      notice.innerHTML = 'Please enter a username!';
      return;
    }

    try {
      const response = await fetch('/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        notice.innerHTML = 'Sync successful! Redirecting...';
        window.location.href = `/tasks?username=${username}`;
      } else {
        const errorData = await response.json();
        notice.innerHTML = `Error: ${errorData.message || 'Unable to sync.'}`;
      }
    } catch (error) {
      notice.innerHTML = 'An error occurred. Please try again.';
      console.error('Error:', error);
    }
  });
