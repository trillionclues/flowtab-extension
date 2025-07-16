document.addEventListener("DOMContentLoaded", () => {
  const groupNameInput = document.getElementById(
    "groupName"
  ) as HTMLInputElement;
  const saveGroupBtn = document.getElementById("saveGroup");
  const groupsList = document.getElementById("groupsList")!;
  const tabCountPill = document.getElementById("ft-tab-count")!;
  const saveCountSpan = document.getElementById("ft-save-count")!;
  const savedCountSpan = document.getElementById("ft-saved-count")!;

  // Set tab count in pill and save button
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    tabCountPill.textContent = `${tabs.length} tabs open`;
    saveCountSpan.textContent = `Save ${tabs.length} Tabs`;
  });

  function renderGroups(
    groups: {
      name: string;
      tabs: { url: string; title: string }[];
    }[]
  ) {
    groupsList.innerHTML = "";
    savedCountSpan.textContent = groups.length.toString();
    (groups || []).forEach((group) => {
      const li = document.createElement("li");
      li.className = "ft-session-card";
      // Header
      const header = document.createElement("div");
      header.className = "ft-session-header";
      const title = document.createElement("div");
      title.className = "ft-session-title";
      title.textContent = group.name;
      const actions = document.createElement("div");
      actions.className = "ft-session-actions";
      // Restore icon
      const restoreBtn = document.createElement("button");
      restoreBtn.className = "ft-session-action";
      restoreBtn.title = "Restore";
      restoreBtn.innerHTML = `<svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="#7b3aed" d="M12 5v6h6m-6 8a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"/></svg>`;
      restoreBtn.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "restoreGroup", group }, () => {});
      });
      // Delete icon (logic to be added next)
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "ft-session-action";
      deleteBtn.title = "Delete";
      deleteBtn.innerHTML = `<svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="#f87171" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12ZM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4Z"/></svg>`;
      // Placeholder: delete logic to be implemented
      actions.appendChild(restoreBtn);
      actions.appendChild(deleteBtn);
      header.appendChild(title);
      header.appendChild(actions);
      li.appendChild(header);
      // Meta info
      const meta = document.createElement("div");
      meta.className = "ft-session-meta";
      meta.textContent = `${group.tabs.length} tabs • just now`;
      li.appendChild(meta);
      // Tags (placeholder)
      const tags = document.createElement("div");
      tags.className = "ft-tags";
      ["design", "research", "ui"].forEach((tag) => {
        const tagEl = document.createElement("span");
        tagEl.className = "ft-tag";
        tagEl.textContent = tag;
        tags.appendChild(tagEl);
      });
      li.appendChild(tags);
      // Domains (placeholder)
      const domains = document.createElement("div");
      domains.className = "ft-domains";
      domains.textContent = "dribbble.com, behance.net +1 more";
      li.appendChild(domains);
      groupsList.appendChild(li);
    });
  }

  function fetchGroups() {
    chrome.runtime.sendMessage({ action: "getGroups" }, (response) => {
      renderGroups(response.groups || []);
    });
  }

  saveGroupBtn?.addEventListener("click", () => {
    const groupName = groupNameInput.value.trim();
    if (!groupName) return;
    chrome.runtime.sendMessage(
      { action: "saveGroup", groupName },
      (response) => {
        if (response && response.success) {
          groupNameInput.value = "";
          fetchGroups();
        }
      }
    );
  });

  fetchGroups();
});
