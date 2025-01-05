document.addEventListener('DOMContentLoaded', () => {
  const username = new URLSearchParams(window.location.search).get('username');
  const notice = document.querySelector('header h1');

  if (!username || !/^[a-zA-Z]+$/.test(username)) {
    notice.textContent = 'Invalid username. Redirecting to the home page...';
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  }

  // Handle checkbox change for task status update
  document
    .querySelectorAll('.task-item input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener('change', (event) => {
        const taskId = event.target.id.split('-')[1]; // Extract task ID from checkbox ID
        const isDone = event.target.checked;

        fetch('/updateTask', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            id: taskId,
            status: isDone ? 'done' : 'not-done',
          }),
        })
          .then((response) => {
            if (response.ok) {
              notice.textContent = 'Task status updated successfully!';
              
            } else {
              throw new Error('Failed to update task.');
            }
          })
          .catch((error) => {
            notice.textContent = error.message;
            // Revert checkbox state on failure
            event.target.checked = !isDone;
          });
      });
    });

  // Toggle tabs for "Done" and "Not Done"
  const doneTab = document.getElementById('done-tab');
  const notDoneTab = document.getElementById('not-done-tab');
  const taskList = document.querySelector('.task-list');

  doneTab.addEventListener('click', () => {
    taskList.querySelectorAll('.task-item').forEach((item) => {
      item.style.display = item.classList.contains('done') ? 'flex' : 'none';
    });
    notice.textContent = 'Showing completed tasks.';
  });

  notDoneTab.addEventListener('click', () => {
    taskList.querySelectorAll('.task-item').forEach((item) => {
      item.style.display = item.classList.contains('not-done')
        ? 'flex'
        : 'none';
    });
    notice.textContent = 'Showing incomplete tasks.';
  });

  // Handle Edit button
  document.querySelectorAll('.edit-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      const taskId = button
        .closest('.task-item')
        .querySelector('input[type="checkbox"]')
        .id.split('-')[1];
      window.location.href = `/getTask?username=${username}&id=${taskId}`;
    });
  });

  // Handle Delete button
  document.querySelectorAll('.delete-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      const taskId = button
        .closest('.task-item')
        .querySelector('input[type="checkbox"]')
        .id.split('-')[1];

      if (confirm('Are you sure you want to delete this task?')) {
        fetch('/deleteTask', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, id: taskId }),
        })
          .then((response) => {
            if (response.ok) {
              notice.textContent = 'Task deleted successfully!';
              location.reload(); // Reload the page to update the task list
            } else {
              throw new Error('Failed to delete task.');
            }
          })
          .catch((error) => {
            notice.textContent = error.message;
          });
      }
    });
  });

  // Handle Export button
  document.querySelector('.btn.export').addEventListener('click', () => {
    window.location.href = `/export?username=${username}`;
  });

  // Handle Import button
  document.querySelector('.btn.import').addEventListener('click', () => {
    window.location.href = `/import?username=${username}`;
  });

  // Handle New Task button
  document.querySelector('.btn.new-task').addEventListener('click', () => {
    window.location.href = `/new?username=${username}`;
  });
});
