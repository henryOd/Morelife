document.querySelector('.form-teams form').addEventListener('submit', function(event) {
    const confirmTeams = confirm('Are you sure you want to form teams?');
    if (!confirmTeams) {
        event.preventDefault();
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const playerNameInput = document.getElementById('playerName');

    // Focus on the input field when the page loads
    playerNameInput.focus();

    // Refocus on the input field after the form is submitted
    document.querySelector('form').addEventListener('submit', function() {
        setTimeout(() => {
            playerNameInput.focus();
        }, 0);
    });
});
