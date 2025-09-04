const togglePhotoBadgesBtn = document.getElementById('togglePhotoBadges');
const badgeToggleText = document.getElementById('badgeToggleText');

// Load state from localStorage or default to true
let showPhotoBadges = localStorage.getItem('showPhotoBadges') === 'false' ? false : true;

// Function to apply the state
function applyPhotoBadgesState() {
    if (showPhotoBadges) {
        document.body.classList.remove('hide-photo-badges');
        togglePhotoBadgesBtn.classList.add('active');
        togglePhotoBadgesBtn.querySelector('i').className = 'fas fa-eye';
    } else {
        document.body.classList.add('hide-photo-badges');
        togglePhotoBadgesBtn.classList.remove('active');
        togglePhotoBadgesBtn.querySelector('i').className = 'fas fa-eye-slash';
    }
}

// Initial setup on page load
applyPhotoBadgesState();

// Toggle on click and save to localStorage
togglePhotoBadgesBtn.addEventListener('click', function () {
    showPhotoBadges = !showPhotoBadges;
    localStorage.setItem('showPhotoBadges', showPhotoBadges);
    applyPhotoBadgesState();
});

