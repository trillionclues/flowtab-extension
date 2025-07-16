// // It listens for messages from the popup or other parts of the extension
// // performs actions based on this message

import { BACKRGOUND_ACTIONS } from "./utils/constants";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async () => {
    try {
      switch (request.action) {
        case BACKRGOUND_ACTIONS.SAVE_GROUP: {
          const tabs = await chrome.tabs.query({ currentWindow: true });
          const group = {
            name: request.groupName,
            tabs: tabs.map(({ url, title }) => ({ url, title })),
          };

          const { tabGroups = [] } = await chrome.storage.local.get(
            "tabGroups"
          );
          tabGroups.push(group);
          await chrome.storage.local.set({ tabGroups });
          sendResponse({ success: true });
          break;
        }

        case BACKRGOUND_ACTIONS.GET_GROUPS: {
          const { tabGroups = [] } = await chrome.storage.local.get(
            "tabGroups"
          );
          sendResponse({ groups: tabGroups });
          break;
        }

        case BACKRGOUND_ACTIONS.RESTORE_GROUP: {
          const group = request.group;
          if (!group || !group?.tabs?.length) {
            sendResponse({
              success: false,
              error: "Invalid group data",
            });
            return;
          }

          const urls = group.tabs.map((tab: { url: string }) => tab.url);
          await chrome.windows.create({
            url: urls,
            focused: true,
          });
          sendResponse({ success: true });
          break;
        }
        default:
          sendResponse({ success: false, error: "Unknown action" });
          break;
      }
    } catch (err: any) {
      console.error("Background error:", err);
      sendResponse({ success: false, error: err.message });
    }
  })();
  return true;
});
