# YouTube-like Video Browser

A responsive web application that lets users explore videos dynamically fetched from the [Acharya Prashant API](https://acharyaprashant.org/api/v2/uni/yt). It supports multi-level filtering and sorting by category, language, year, and view count. Videos are displayed in a responsive grid with thumbnails, titles, tags, formatted view counts, and relative publish time.

🚀 **Live Demo:** [https://Gunj-patel.github.io/](https://Gunj-patel.github.io/)

---

## How It Works

### State Management
- `state` object keeps track of the currently selected language, category, year, sort option, limit, and offset.

### Fetching Data
- `fetchCategories()` fetches categories from `CATEGORY_API` and renders category buttons.
- `fetchVideos()` fetches videos from `VIDEO_API` using filters and sorting.

### Rendering Videos
- `renderVideos()` dynamically creates video cards and appends them to the grid.
- Displays first 2 tags and aggregates the remaining tags as `+N`.

### Filtering
- Language, category, and year filters update `state` and re-fetch videos.
- Sorting buttons update `state.sort` and refresh videos.

# Scroll Buttons
- Scroll left/right buttons allow horizontal scrolling of the category bar.
- Buttons appear on hover and hide when the scroll reaches the edges.

### Helpers
- `formatViews(count)` → formats view counts as K and M.
- `timeAgo(date)` → returns relative publish time like "2 months ago".

---

## Usage

1. Click **language buttons** to filter by language.  
2. Click **sort buttons** to change video order.  
3. Hover over **categories** to reveal scroll buttons and navigate horizontally.  
4. Click **year dropdown** to filter by published year.  
5. Scroll and browse video cards; tags, views, and publish times are dynamically displayed.

---

## Dependencies

- Vanilla JavaScript (no frameworks required)  
- Fetch API for data requests  
- CSS Grid & Flexbox for layout

---

## Future Improvements

- Add pagination / infinite scrolling for more videos  
- Add search bar for keywords  
- Add modal preview or YouTube embed on clicking a video  
- Enhance mobile UI for better responsiveness  
- Lazy load images for performance optimization

---

## Author

**Gunj Patel**  
GitHub: [https://github.com/Gunj-patel](https://github.com/Gunj-patel)
