const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry);
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
    /*else {
            entry.target.classList.remove('show')
        }*/
  });
});

const hiddenelements = document.querySelectorAll(".hidden");
hiddenelements.forEach((el) => observer.observe(el));

document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".sbutton");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));

      button.classList.add("active");
    });
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const allBtn = document.getElementById("allBtn");
  const gamesBtn = document.getElementById("gamesBtn");
  const merchBtn = document.getElementById("merchBtn");
  const eventBtn = document.getElementById("eventBtn");
  const otherBtn = document.getElementById("otherBtn");
  

  const newsItems = document.querySelectorAll(".newslist a");

  // Add click event listeners to the buttons
  allBtn.addEventListener("click", function () {
    filterNews("all");
    toggleActiveButton(allBtn);
  });

  gamesBtn.addEventListener("click", function () {
    filterNews("game");
    toggleActiveButton(gamesBtn);
  });

  merchBtn.addEventListener("click", function () {
    filterNews("merch");
    toggleActiveButton(merchBtn);
  });

  eventBtn.addEventListener("click", function () {
    filterNews("event");
    toggleActiveButton(eventBtn);
  });

  otherBtn.addEventListener("click", function () {
    filterNews("others");
    toggleActiveButton(otherBtn);
  });

  function filterNews(category) {
    newsItems.forEach(function (item) {
      const genre = item.querySelector(".genre").getAttribute("data-category");
      if (category === "all" || genre === category) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }


  function toggleActiveButton(button) {
    const buttons = document.querySelectorAll(".sbutton");
    buttons.forEach(function (btn) {
      btn.classList.remove("active");
    });
    button.classList.add("active");
  }
});

/*-48vh  330vh */

const footer = document.querySelector('.footernews');
const newsList = document.querySelector('.newslist');
const filterButtons = document.querySelectorAll('.sbutton');

// Function to update the footer margin
function updateFooterMargin() {
  const newsListHeight = newsList.offsetHeight; 
  console.log(newsListHeight);
  const footerMargin = newsListHeight + 300; 
  footer.style.marginTop = `${footerMargin}px`;
}

// Initial update
updateFooterMargin();

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Add a short delay before updating the footer margin
    setTimeout(updateFooterMargin, 10);
  });
});

