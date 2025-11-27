const search = document.getElementById("search");
const list = document.getElementById("autocomplete");
const repoList = document.getElementById("repoList");

function debounce(fn, delay = 500) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

async function fetchRepos(query) {
  const res = await fetch(
    `https://api.github.com/search/repositories?q=${query}&per_page=5`
  );
  const data = await res.json();
  return data.items || [];
}

const updateList = debounce(async () => {
  const q = search.value.trim();
  list.innerHTML = "";

  if (!q) return;

  const repos = await fetchRepos(q);

  repos.forEach(repo => {
    const li = document.createElement("li");
    li.textContent = repo.full_name;
    li.onclick = () => addRepo(repo);
    list.append(li);
  });
}, 400);

search.addEventListener("input", updateList);

function addRepo(repo) {
  list.innerHTML = "";
  search.value = "";

  const box = document.createElement("div");
  box.className = "repo";

  box.innerHTML = `
    <p><b>Name:</b> ${repo.name}</p>
    <p><b>Owner:</b> ${repo.owner.login}</p>
    <p><b>Stars:</b> ${repo.stargazers_count}</p>
    <span class="remove">X</span>
  `;

  box.querySelector(".remove").onclick = () => box.remove();

  repoList.append(box);
}
