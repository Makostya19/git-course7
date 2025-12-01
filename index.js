const input = document.getElementById("search");
const suggestions = document.getElementById("suggestions");
const repoList = document.getElementById("repoList");

function debounce(fn, delay = 600) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

async function loadRepos(query) {
  if (!query.trim()) {
    suggestions.innerHTML = "";
    return;
  }

  try {
    const res = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=5`
    );
    const data = await res.json();

    suggestions.innerHTML = "";
    if (!data.items) return;

    data.items.forEach(repo => {
      const option = document.createElement("div");
      option.className = "suggestion-item";
      option.textContent = repo.full_name;

      option.addEventListener("click", () => {
        addRepoToList(repo);
        suggestions.innerHTML = "";
        input.value = "";
      });

      suggestions.appendChild(option);
    });

  } catch (err) {
    console.warn("Ошибка API:", err);
  }
}

function addRepoToList(repo) {
  const card = document.createElement("div");
  card.className = "repo-card";

  card.innerHTML = `
    <div class="repo-info">
      <p><b>Name:</b> ${repo.name}</p>
      <p><b>Owner:</b> ${repo.owner.login}</p>
      <p><b>Stars:</b> ⭐ ${repo.stargazers_count}</p>
    </div>
    <button class="delete-btn">&times;</button>
  `;

  card.querySelector(".delete-btn").addEventListener("click", () => {
    card.remove();
  });

  repoList.appendChild(card);
}

input.addEventListener("input", debounce(() => loadRepos(input.value), 600));
