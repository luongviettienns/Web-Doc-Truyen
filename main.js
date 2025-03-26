// ==============================
// NÚT LÊN ĐẦU TRANG
// ==============================

window.onscroll = function () {
    const btn = document.getElementById("scrollToTopBtn");
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        btn.style.display = "flex";
    } else {
        btn.style.display = "none";
    }
};

document.getElementById("scrollToTopBtn").addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// ==============================
// CHUYỂN ẢNH BANNER (3 ẢNH: PREV - CURRENT - NEXT)
// ==============================
const bannerImages = [
    "images/banner.png",
    "images/banner2.jpg",
    "images/banner3.jpg",
    "images/banner4.jpg",
    "images/banner5.jpg"
];

let currentIndex = 0;

const imgPrev = document.getElementById("banner-prev");
const imgCurrent = document.getElementById("banner-current");
const imgNext = document.getElementById("banner-next");

const colorThief = new ColorThief();
const bannerWrapper = document.getElementById('banner-wrapper');

function updateBanner() {
    const prevIndex = (currentIndex - 1 + bannerImages.length) % bannerImages.length;
    const nextIndex = (currentIndex + 1) % bannerImages.length;

    imgCurrent.classList.remove("fade-in");
    imgCurrent.classList.add("fade-out");

    setTimeout(() => {
        imgPrev.src = bannerImages[prevIndex];
        imgCurrent.src = bannerImages[currentIndex];
        imgNext.src = bannerImages[nextIndex];

        imgCurrent.classList.remove("fade-out");
        imgCurrent.classList.add("fade-in");

        if (imgCurrent.complete && imgCurrent.naturalHeight !== 0) {
            setDominantColor();
        } else {
            imgCurrent.onload = setDominantColor;
        }
    }, 250);
}

function setDominantColor() {
    try {
        if (document.body.classList.contains("dark-mode")) {
            // Sử dụng đúng màu nền trang ở dark mode
            bannerWrapper.style.backgroundColor = "#121212";
            return;
        }

        const rgb = colorThief.getColor(imgCurrent);
        const finalColor = rgb.map(c => Math.min(c + 100, 255)); // làm sáng

        bannerWrapper.style.backgroundColor = `rgb(${finalColor.join(',')})`;
    } catch (e) {
        console.warn("Không thể lấy màu ảnh banner:", e);
    }
}



// ==============================
// Banner Navigation & Auto-slide
// ==============================

imgPrev.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + bannerImages.length) % bannerImages.length;
    updateBanner();
});

imgNext.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % bannerImages.length;
    updateBanner();
});

setInterval(() => {
    currentIndex = (currentIndex + 1) % bannerImages.length;
    updateBanner();
}, 5000);

window.addEventListener("load", updateBanner);

// ==============================
// GỢI Ý TÌM KIẾM TRUYỆN THEO TỪ KHÓA
// ==============================

const searchInput = document.getElementById("searchInput");
const suggestionList = document.getElementById("searchSuggestions");

// Lấy tất cả tên truyện từ DOM (mục .manga-title trong .manga-info)
const allTitles = Array.from(document.querySelectorAll(".manga-info a")).map(el => el.textContent.trim());

searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.trim().toLowerCase();
    suggestionList.innerHTML = "";

    if (keyword === "") {
        suggestionList.style.display = "none";
        return;
    }

    const matched = Array.from(document.querySelectorAll(".manga-info")).filter(item => {
        const title = item.querySelector("a").textContent.trim().toLowerCase();
        return title.includes(keyword);
    });

    if (matched.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Không tìm thấy truyện phù hợp";
        li.classList.add("no-result");
        suggestionList.appendChild(li);
        suggestionList.style.display = "block";
        return;
    }

    matched.slice(0, 5).forEach((item, index) => {
        const titleText = item.querySelector("a").textContent.trim();
        const imgSrc = item.querySelector("img").src;

        const regex = new RegExp(`(${keyword})`, 'gi');
        const highlightedTitle = titleText.replace(regex, `<mark style="background: #fff176; padding: 0 2px;">$1</mark>`);

        const li = document.createElement("li");
        li.innerHTML = `
            <span class="index">${index + 1}</span>
            <img src="${imgSrc}" alt="ảnh truyện">
            <span class="title">${highlightedTitle}</span>
        `;

        li.addEventListener("click", () => {
            searchInput.value = titleText;
            suggestionList.style.display = "none";
        });

        suggestionList.appendChild(li);
    });

    suggestionList.style.display = "block";
});

// Ẩn dropdown khi click ra ngoài
document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !suggestionList.contains(e.target)) {
        suggestionList.style.display = "none";
    }
});

// ==============================
// DARK MODE TOGGLE SWITCH
// ==============================

const toggle = document.getElementById("darkModeToggle");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    toggle.checked = true;
}

toggle.addEventListener("change", () => {
    if (toggle.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
    } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
    }
});
