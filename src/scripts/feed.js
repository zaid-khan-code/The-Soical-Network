// Global variables for app state
let currentUser = null;
let posts = [];
let filteredPosts = [];
let searchQuery = '';
let sortBy = 'latest';

// Initialize the feed when page loads
function init() {
  // Check if user is logged in
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = '../pages/auth.html';
    return;
  }

  // Load posts from LocalStorage
  posts = JSON.parse(localStorage.getItem('posts') || '[]');
  filteredPosts = [...posts];

  // Set user info in header
  document.getElementById('header-avatar').src = currentUser.avatar;
  document.getElementById('header-name').textContent = currentUser.name;
  document.getElementById('create-avatar').src = currentUser.avatar;

  updatePostButton();
  filterAndSortPosts();
  renderPosts();
}

// Toggle image URL input visibility
function toggleImageInput() {
  const imageInput = document.getElementById('post-image');
  imageInput.style.display = imageInput.style.display === 'none' ? 'block' : 'none';
}

// Enable/disable post button based on content
function updatePostButton() {
  const content = document.getElementById('post-content').value;
  const postBtn = document.getElementById('post-btn');
  postBtn.disabled = !content.trim();
}

document.getElementById('post-content')?.addEventListener('input', updatePostButton);

// Create a new post
function createPost() {
  const content = document.getElementById('post-content').value.trim();
  if (!content) return;

  const imageUrl = document.getElementById('post-image').value.trim();

  // Create new post object with simple likes array
  const newPost = {
    id: Date.now().toString(),
    content,
    imageUrl: imageUrl || undefined,
    author: {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
    },
    timestamp: new Date().toISOString(),
    likes: [], // Simple array of user IDs who liked
  };

  // Add to beginning of posts array
  posts.unshift(newPost);
  savePosts();

  // Clear form
  document.getElementById('post-content').value = '';
  document.getElementById('post-image').value = '';
  document.getElementById('post-image').style.display = 'none';

  showToast('Post created successfully!');
  filterAndSortPosts();
  renderPosts();
  updatePostButton();
}

// Save posts to LocalStorage
function savePosts() {
  localStorage.setItem('posts', JSON.stringify(posts));
}

// Filter posts based on search query
function handleSearch() {
  searchQuery = document.getElementById('search-input').value.toLowerCase();
  filterAndSortPosts();
  renderPosts();
}

// Sort posts by selected criteria
function handleSort(sort) {
  sortBy = sort;

  // Update active button styling
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-sort="${sort}"]`).classList.add('active');

  filterAndSortPosts();
  renderPosts();
}

// Filter and sort posts based on current settings
function filterAndSortPosts() {
  // Filter by search query
  filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchQuery)
  );

  // Sort based on selected option
  if (sortBy === 'latest') {
    filteredPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } else if (sortBy === 'oldest') {
    filteredPosts.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  } else if (sortBy === 'most-liked') {
    // Use likes.length for sorting (updated from reactions)
    filteredPosts.sort((a, b) => {
      const aLikes = (a.likes || a.reactions || []).length;
      const bLikes = (b.likes || b.reactions || []).length;
      return bLikes - aLikes;
    });
  }
}

// Format timestamp to relative time (e.g., "2 hours ago")
function formatTimeAgo(timestamp) {
  const now = new Date();
  const postDate = new Date(timestamp);
  const seconds = Math.floor((now - postDate) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
}

// Render all posts to the DOM
function renderPosts() {
  const container = document.getElementById('posts-container');

  // Show empty state if no posts
  if (filteredPosts.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p class="empty-text">
          ${searchQuery ? 'No posts found matching your search.' : 'No posts yet. Be the first to share something!'}
        </p>
      </div>
    `;
    return;
  }

  // Render each post
  container.innerHTML = filteredPosts.map(post => {
    // Support both old reactions format and new likes format
    const likes = post.likes || post.reactions || [];
    const userLiked = likes.some(id => id === currentUser.id || id.userId === currentUser.id);
    const likeCount = likes.length;
    const isOwnPost = post.author.id === currentUser.id;

    return `
      <div class="content-section post-card">
        <div class="card">
          <div class="post-header">
            <img class="post-avatar" src="${post.author.avatar}" alt="${post.author.name}">
            <div class="post-content-wrapper">
              <div class="post-meta">
                <div>
                  <div class="post-author">${post.author.name}</div>
                  <div class="post-time">${formatTimeAgo(post.timestamp)}</div>
                </div>
                ${isOwnPost ? `
                  <button class="menu-btn" onclick="deletePost('${post.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                ` : ''}
              </div>
              
              <p class="post-text">${post.content}</p>
              ${post.imageUrl ? `<img class="post-image" src="${post.imageUrl}" alt="Post content">` : ''}
              
              <div class="post-reactions">
                <button class="reaction-btn ${userLiked ? 'active' : ''}" onclick="toggleLike('${post.id}')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  ${likeCount > 0 ? likeCount : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Toggle like on a post
function toggleLike(postId) {
  const postIndex = posts.findIndex(p => p.id === postId);
  if (postIndex === -1) return;

  const post = posts[postIndex];

  // Migrate old reactions format to new likes format
  if (post.reactions && !post.likes) {
    post.likes = post.reactions.map(r => r.userId || r);
    delete post.reactions;
  }

  // Ensure likes array exists
  if (!post.likes) {
    post.likes = [];
  }

  // Toggle like
  const likeIndex = post.likes.indexOf(currentUser.id);
  if (likeIndex !== -1) {
    // Unlike
    post.likes.splice(likeIndex, 1);
  } else {
    // Like
    post.likes.push(currentUser.id);
  }

  savePosts();
  filterAndSortPosts();
  renderPosts();
}

// Delete a post with confirmation
function deletePost(postId) {
  // Show browser confirm dialog
  if (confirm('Delete this post? This action cannot be undone.')) {
    posts = posts.filter(p => p.id !== postId);
    savePosts();
    showToast('Post deleted successfully!');
    filterAndSortPosts();
    renderPosts();
  }
}

// Handle user logout
function handleLogout() {
  localStorage.removeItem('currentUser');
  showToast('Logged out successfully!');
  setTimeout(() => {
    window.location.href = '../pages/auth.html';
  }, 1000);
}

// Show success toast message
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast success show';

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Initialize app on page load
init();
