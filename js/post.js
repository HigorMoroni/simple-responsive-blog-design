// Data
const post = {};

// Methods
async function getPost() {
  try {
    const response = await fetch(`https://dummyjson.com/post/${id}`);
    post = await response.json();
  } catch (error) {
    console.error(error);
  }
};

// On Created - IIFE – Immediately Invoked Function Expression (Função Auto-invocavel)
(async function created() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get(id);

  await getPost(id);
  mount();
})();