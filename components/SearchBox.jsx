import { useEffect } from 'react';

const SearchBox = () => {
  useEffect(() => {
    const suggestions = [
      "pogacar tadej",
      "ottestad mie bjørndal",
      "gudmestad tord",
      "urianstad bugge martin",
      "contador alberto",
      "YouTube Channel",
    ];

    const searchInput = document.querySelector(".searchInput");
    const input = searchInput.querySelector("input");
    const resultBox = searchInput.querySelector(".resultBox");
    input.onkeyup = (e) => {
      let userData = e.target.value;
      let emptyArray = [];

      if (userData) {
        emptyArray = suggestions.filter((data) => {
          return data.toLocaleLowerCase().includes(userData.toLocaleLowerCase());
        });

        emptyArray = emptyArray.map((data) => {
          return data = '<li>' + data + '</li>';
        });

        searchInput.classList.add("active");
        showSuggestions(emptyArray);

        let allList = resultBox.querySelectorAll("li");
        for (let i = 0; i < allList.length; i++) {
          allList[i].setAttribute("onclick", "select(this)");
        }
      } else {
        searchInput.classList.remove("active");
      }

      $(".close").click(function () {
        $(".searchInput").removeClass("active");
      });
    };

    function showSuggestions(list) {
      let listData;

      if (!list.length) {
        let userValue = input.value;
        listData = '<li>' + userValue + '</li>';
      } else {
        listData = list.join('');
      }

      resultBox.innerHTML = listData;
    }

    window.select = function (element) {
      input.value = element.textContent;
      searchInput.classList.remove("active");
    };

    if (typeof $ !== "undefined") {
      $('#navigation nav').slimNav_sk78();
    }
  }, []);

  return (
    <div className="searchInput 111">
      <input type="text" placeholder="Search..." />
      <ul className="resultBox"></ul>
    </div>
  );
};

export default SearchBox;
