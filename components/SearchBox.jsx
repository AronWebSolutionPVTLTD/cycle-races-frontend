// components/SearchBox.js
import { useEffect } from 'react';

const SearchBox = () => {
  useEffect(() => {
    // jQuery script
    const suggestions = [
      "pogacar tadej",
      "ottestad mie bjørndal",
      "gudmestad tord",
      "urianstad bugge martin",
      "contador alberto",
      "YouTube Channel",
    ];

    // Getting all required elements
    const searchInput = document.querySelector(".searchInput");
    const input = searchInput.querySelector("input");
    const resultBox = searchInput.querySelector(".resultBox");

    // When the user presses a key and releases
    input.onkeyup = (e) => {
      let userData = e.target.value; // User entered data
      let emptyArray = [];

      if (userData) {
        emptyArray = suggestions.filter((data) => {
          return data.toLocaleLowerCase().includes(userData.toLocaleLowerCase());
        });

        emptyArray = emptyArray.map((data) => {
          return data = '<li>' + data + '</li>';
        });

        searchInput.classList.add("active"); // Show autocomplete box
        showSuggestions(emptyArray);

        let allList = resultBox.querySelectorAll("li");
        for (let i = 0; i < allList.length; i++) {
          // Adding an onclick attribute to each <li> tag
          allList[i].setAttribute("onclick", "select(this)");
        }
      } else {
        searchInput.classList.remove("active"); // Hide autocomplete box
      }

      $(".close").click(function(){
        $(".searchInput").removeClass("active");
      });
    };

    // Show the suggestions in the result box
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

    // Select a suggestion
    window.select = function (element) {
      input.value = element.textContent;
      searchInput.classList.remove("active");
    };

    // SlimNav (if you need it)
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
