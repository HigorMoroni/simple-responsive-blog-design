// IIFE – Immediately Invoked Function Expression (Função Auto-invocavel)

/**
 * Essa função inicia apenas quando a página index é criada,
 * pois esse arquivo só é importado la
 */
(async function created() {
  createLoader(); // cria uma tela de carregamento enquanto as postagens não chegaram
  await getAllPosts();
  mount('index');
})();