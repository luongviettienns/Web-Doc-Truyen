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

// Danh sách ảnh banner
const bannerImages = [
    "images/banner.png",
    "images/banner2.jpg",
    "images/banner3.jpg",
    "images/banner4.jpg",
    "images/banner5.jpg"
];

let currentIndex = 0;

// DOM các thẻ ảnh
const imgPrev = document.getElementById("banner-prev");
const imgCurrent = document.getElementById("banner-current");
const imgNext = document.getElementById("banner-next");

// Khai báo chung
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

        // Lấy màu sau khi ảnh tải xong
        function setDominantColor() {
            const dominantColor = colorThief.getColor(imgCurrent);
            // Giảm thêm độ đậm của màu (pha thêm nhiều trắng)
            const fadedColor = dominantColor.map(channel => Math.min(channel + 100, 255));
            bannerWrapper.style.backgroundColor = `rgb(${fadedColor.join(',')})`;
        }

        if (imgCurrent.complete) {
            setDominantColor();
        } else {
            imgCurrent.onload = setDominantColor;
        }

    }, 250); // thời gian animation hiện tại của bạn là 250ms
}
 

// Khởi tạo lần đầu khi trang được tải
window.addEventListener('load', updateBanner);



// Sự kiện click ảnh mờ prev/next
imgPrev.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + bannerImages.length) % bannerImages.length;
    updateBanner();
});

imgNext.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % bannerImages.length;
    updateBanner();
});

// Tự động chạy mỗi 5 giây
setInterval(() => {
    currentIndex = (currentIndex + 1) % bannerImages.length;
    updateBanner();
}, 5000);

// Khởi tạo khi load
updateBanner();
