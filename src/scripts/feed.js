// lucide.createIcons();

// // Elements
// const currentUser = JSON.parse(localStorage.getItem('currentUser'));
// if (!currentUser) {
//     window.location.href = '/auth.html'; // or auth.html
//     throw new Error("Not logged in");
// }

// document.getElementById('user-name').textContent = currentUser.name;
// document.getElementById('user-avatar').src = currentUser.avatar;
// document.getElementById('create-avatar').src = currentUser.avatar;

// document.getElementById('logout-btn').onclick = () => {
//     localStorage.removeItem('currentUser');
//     showToast('Logged out successfully!', 'info');
//     setTimeout(() => window.location.href = '/auth.html', 800);
// };

// let posts = JSON.parse(localStorage.getItem('posts') || '[]');
// const postsContainer = document.getElementById('posts-container');
// const noPostsMsg = document.getElementById('no-posts');
// const searchBar = document.getElementById('search-bar');
// const sortFilter = document.getElementById('sort-filter');

// function showToast(message, type = 'success') {
//     const toast = document.getElementById('toast');
//     toast.textContent = message;
//     toast.className = `fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-2xl text-white z-50 block transition-all ${type === 'error' ? 'bg-red-500' : type === 'info' ? 'bg-blue-500' : 'bg-green-500'
//         }`;
//     setTimeout(() => toast.classList.add('hidden'), 3000);
// }

// function renderPosts() {
//     let filtered = posts.filter(p =>
//         p.content.toLowerCase().includes(searchBar.value.toLowerCase())
//     );

//     // Sorting
//     if (sortFilter.value === 'latest') {
//         filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
//     } else if (sortFilter.value === 'oldest') {
//         filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
//     } else if (sortFilter.value === 'most-liked') {
//         filtered.sort((a, b) => b.reactions.length - a.reactions.length);
//     }

//     postsContainer.innerHTML = '';
//     if (filtered.length === 0) {
//         noPostsMsg.classList.remove('hidden');
//         return;
//     }
//     noPostsMsg.classList.add('hidden');

//     filtered.forEach(post => {
//         const isOwnPost = post.author.id === currentUser.id;
//         const userReaction = post.reactions.find(r => r.userId === currentUser.id);

//         const postEl = document.createElement('div');
//         postEl.className = 'bg-white rounded-2xl shadow-sm border border-gray-200 p-6';
//         postEl.innerHTML = `
//           <div class="flex items-start justify-between">
//             <div class="flex gap-4">
//               <img src="${post.author.avatar}" class="w-12 h-12 rounded-full" alt="${post.author.name}">
//               <div>
//                 <h3 class="font-semibold">${post.author.name}</h3>
//                 <p class="text-sm text-gray-500">${new Date(post.timestamp).toLocaleString()}</p>
//               </div>
//             </div>
//             ${isOwnPost ? `
//               <div class="flex gap-2">
//                 <button class="edit-btn text-blue-600 text-sm font-medium" data-id="${post.id}">Edit</button>
//                 <button class="delete-btn text-red-600 text-sm font-medium" data-id="${post.id}">Delete</button>
//               </div>
//             ` : ''}
//           </div>

//           <p class="mt-4 text-gray-800">${post.content.replace(/\n/g, '<br>')}</p>

//           ${post.imageUrl ? `<img src="${post.imageUrl}" class="mt-4 max-h-96 rounded-lg mx-auto">` : ''}

//           <div class="flex gap-3 mt-6">
//             <button class="reaction-btn flex items-center gap-2 px-4 py-2 rounded-lg border ${userReaction?.type === 'like' ? 'active' : ''}" data-type="like" data-id="${post.id}">
//               <i data-lucide="thumbs-up"></i> <span>${post.reactions.filter(r => r.type === 'like').length}</span>
//             </button>
//             <button class="reaction-btn flex items-center gap-2 px-4 py-2 rounded-lg border ${userReaction?.type === 'heart' ? 'active' : ''}" data-type="heart" data-id="${post.id}">
//               <i data-lucide="heart"></i> <span>${post.reactions.filter(r => r.type === 'heart').length}</span>
//             </button>
//             <button class="reaction-btn flex items-center gap-2 px-4 py-2 rounded-lg border ${userReaction?.type === 'fire' ? 'active' : ''}" data-type="fire" data-id="${post.id}">
//               <i data-lucide="flame"></i> <span>${post.reactions.filter(r => r.type === 'fire').length}</span>
//             </button>
//             <button class="reaction-btn flex items-center gap-2 px-4 py-2 rounded-lg border ${userReaction?.type === 'celebrate' ? 'active' : ''}" data-type="celebrate" data-id="${post.id}">
//               <i data-lucide="party-popper"></i> <span>${post.reactions.filter(r => r.type === 'celebrate').length}</span>
//             </button>
//           </div>
//         `;
//         postsContainer.appendChild(postEl);
//     });

//     lucide.createIcons();

//     // Attach event listeners
//     document.querySelectorAll('.reaction-btn').forEach(btn => {
//         btn.onclick = () => {
//             const postId = btn.dataset.id;
//             const type = btn.dataset.type;
//             const post = posts.find(p => p.id === postId);
//             const existing = post.reactions.find(r => r.userId === currentUser.id && r.type === type);

//             if (existing) {
//                 post.reactions = post.reactions.filter(r => !(r.userId === currentUser.id && r.type === type));
//             } else {
//                 post.reactions = post.reactions.filter(r => r.userId !== currentUser.id);
//                 post.reactions.push({ userId: currentUser.id, type });
//             }

//             localStorage.setItem('posts', JSON.stringify(posts));
//             renderPosts();
//         };
//     });

//     document.querySelectorAll('.delete-btn').forEach(btn => {
//         btn.onclick = () => {
//             if (confirm('Delete this post?')) {
//                 posts = posts.filter(p => p.id !== btn.dataset.id);
//                 localStorage.setItem('posts', JSON.stringify(posts));
//                 showToast('Post deleted!');
//                 renderPosts();
//             }
//         };
//     });

//     document.querySelectorAll('.edit-btn').forEach(btn => {
//         btn.onclick = () => {
//             const post = posts.find(p => p.id === btn.dataset.id);
//             const newContent = prompt('Edit post:', post.content);
//             if (newContent !== null && newContent.trim()) {
//                 post.content = newContent.trim();
//                 localStorage.setItem('posts', JSON.stringify(posts));
//                 showToast('Post updated!');
//                 renderPosts();
//             }
//         };
//     });
// }

// // Create Post
// const postBtn = document.getElementById('post-btn');
// const postContent = document.getElementById('post-content');
// const imageInput = document.getElementById('image-input');
// const imagePreview = document.getElementById('image-preview').querySelector('img');

// imageInput.onchange = () => {
//     const file = imageInput.files[0];
//     if (file) {
//         imagePreview.src = URL.createObjectURL(file);
//         document.getElementById('image-preview').classList.remove('hidden');
//     }
// };

// postBtn.onclick = () => {
//     const content = postContent.value.trim();
//     if (!content) return showToast('Write something first!', 'error');

//     const imageUrl = imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : '';

//     const newPost = {
//         id: Date.now().toString(),
//         content,
//         imageUrl,
//         author: { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
//         timestamp: new Date().toISOString(),
//         reactions: []
//     };

//     posts.unshift(newPost);
//     localStorage.setItem('posts', JSON.stringify(posts));

//     postContent.value = '';
//     imageInput.value = '';
//     document.getElementById('image-preview').classList.add('hidden');

//     showToast('Post created successfully!');
//     renderPosts();
// };

// // Search & Sort
// searchBar.oninput = () => renderPosts();
// sortFilter.onchange = () => renderPosts();

// // Initial render
// renderPosts();