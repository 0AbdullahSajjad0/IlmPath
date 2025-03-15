import config from "../../config";

export const toggleBookmark = async (userId, userRole, bookmarkedSurah, bookmarkedAyah) => {
  try {
    const response = await fetch(`${config.apiBaseUrl}/toggleBookmark`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        user_role: userRole,
        bookmarked_surah: bookmarkedSurah,
        bookmarked_ayah: bookmarkedAyah,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to toggle bookmark:", error.message);
      return null;
    }

    const result = await response.json();
    console.log("Bookmark toggled:", result);
    return result;
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return null;
  }
};

export const getBookmarks = async (userId, userRole) => {
  try {
    const response = await fetch(`${config.apiBaseUrl}/getBookmarks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        user_role: userRole,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to fetch bookmarks:", error.message);
      return [];
    }

    const result = await response.json();
    console.log("Bookmarks fetched:", result.bookmarks);
    return result.bookmarks || [];
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
};
