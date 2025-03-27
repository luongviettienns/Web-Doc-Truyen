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

window.addEventListener("DOMContentLoaded", () => {
    const tailCursor = document.getElementById("tail-cursor");
    const trail1 = document.getElementById("trail-1");
    const trail2 = document.getElementById("trail-2");
    const trail3 = document.getElementById("trail-3");
  
    if (!tailCursor) {
      console.warn("Không tìm thấy #tail-cursor");
      return;
    }
  
    document.addEventListener("mousemove", (e) => {
      const { clientX, clientY } = e;
  
      // Di chuyển tail chính
      tailCursor.style.left = `${clientX}px`;
      tailCursor.style.top = `${clientY}px`;
  
      // Vệt đuôi neon rainbow
      updateTrail(trail1, clientX, clientY, 0);
      updateTrail(trail2, clientX, clientY, 1);
      updateTrail(trail3, clientX, clientY, 2);
  
      // Particle vỡ vụn
      createParticle(clientX, clientY);
    });
  });
  
  // Cập nhật vị trí và màu neon rainbow cho trail
  function updateTrail(el, x, y, index) {
    setTimeout(() => {
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.backgroundColor = getRainbowColor(index);
      el.style.boxShadow = `0 0 12px ${getRainbowColor(index)}`;
    }, index * 40); // delay theo lớp
  }
  
  // Ripple click
  document.addEventListener("click", (e) => {
    const ripple = document.createElement("div");
    ripple.className = "click-ripple";
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
  
    // Áp dụng màu rainbow
    const color = getRandomRainbowColor();
    ripple.style.borderColor = color;
    ripple.style.boxShadow = `0 0 20px ${color}`;
  
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
  // Tạo hạt pixel vỡ vụn
  function createParticle(x, y) {
    const particle = document.createElement("div");
    particle.className = "particle";
  
    const size = Math.floor(Math.random() * 4) + 3;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.backgroundColor = getRandomCyberColor();
  
    document.body.appendChild(particle);
  
    setTimeout(() => {
      const offsetX = (Math.random() - 0.5) * 30;
      const offsetY = (Math.random() - 0.5) * 30;
      particle.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(0.7) rotate(${Math.random() * 90}deg)`;
      particle.style.opacity = "0";
    }, 10);
  
    setTimeout(() => particle.remove(), 400);
  }
  
  // Rainbow color theo thời gian (cho trail)
  function getRandomRainbowColor() {
    const colors = [
      "#ff0000", "#ff8000", "#ffff00",
      "#00ff00", "#00bfff", "#4b0082", "#9400d3"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  function clamp(v) {
    return Math.max(0, Math.min(255, v));
  }
  
  // Màu pixel mạnh mẽ xanh-đen
  function getRandomCyberColor() {
    const colors = [
      "#00ff00", "#00cc00", "#009900",
      "#003300", "#1a1a1a", "#0f0f0f", "#333"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  