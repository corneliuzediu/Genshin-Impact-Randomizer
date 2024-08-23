/*** Constants ***/
const dataURL = "./scripts/data.json";

/*** Array          ***/
let bosses_list = []
let weekly_list = []
let characters_list = [];
let accounts = [];
let teams = [];
let elementRestrictions = [];
let selectedProfiles = [];
let selectedAccounts = []
let selectedElements = [];
let selectedStars = [];
let selectedWeapons = [];
let selectedGenders = [];
let selectedHeights = [];
let selectedLocations = [];
let selectedCharacters = [];
let previousCharacters = [];
let previousCharacters2 = [];
let previousBoss = [];



/*** Variables      ****/
let numberOfChampions;
let firstBoss = true;
let firstWeeklyBoss = true;
let allChecked = true;


/*** Functions      ***/

const init = async () => {
    getLocal();
}


document.addEventListener('DOMContentLoaded', () => {
    team_randomizerHTML = document.getElementById("team_randomizer");
    criteria_randomizerHTML = document.getElementById("criteria_randomizer");
    boss_randomizerHTML = document.getElementById("boss_randomizer");
    boss_randomizer_boardHTML = document.getElementById("boss_randomizer-board");
    weekly_randomizerHTML = document.getElementById("weekly_randomizer");
    weekly_boss_randomizer_boardHTML = document.getElementById("weekly_boss_randomizer-board");
    accounts_managerHTML = document.getElementById("accounts-manager");
    teams_managerHTML = document.getElementById("teams-manager");
    new_profile_wrapperHTML = document.getElementById("new-profile_wrapper");
    new_team_wrapperHTML = document.getElementById("new-team_wrapper");
    existing_profile_wrapperHTML = document.getElementById("existing-profile_wrapper")
    selected_team_wrapperHTML = document.getElementById("existing-team_wrapper")
    characters_boardHTML = document.getElementById("characters_board");
    teamCreator_wrapperHTML = document.getElementById("teamCreator_wrapper")
    teamCreator_boardHTML = document.getElementById("teamCreator_board");
    teamsPreview_boardHTML = document.getElementById("teams_board");
    random_team_boardHTML = document.getElementById("show-random-team");
    /** Checkbox Connector **/
    const elementsCheckboxes = document.querySelectorAll('.wrap-criterias input[type="checkbox"]');
    const starsCheckboxes = document.querySelectorAll('.wrap-stars input[type="checkbox"]');
    const weaponsCheckboxes = document.querySelectorAll('.wrap-weapons input[type="checkbox"]');
    const genderCheckboxes = document.querySelectorAll('.wrap-genders input[type="checkbox"]');
    const heightCheckboxes = document.querySelectorAll('.wrap-height input[type="checkbox"]');
    const locationCheckboxes = document.querySelectorAll('.wrap-locations input[type="checkbox"]');
    const numberTeamRadioBtn = document.querySelectorAll('input[name="team-2-or-4"]');
    const allCheckAll = document.getElementById('allCheckAll-checked');

    updateAllCheckbox(elementsCheckboxes, starsCheckboxes, weaponsCheckboxes, genderCheckboxes, heightCheckboxes, locationCheckboxes, numberTeamRadioBtn)
    connectAllCheckbox(elementsCheckboxes, starsCheckboxes, weaponsCheckboxes, genderCheckboxes, heightCheckboxes, locationCheckboxes, numberTeamRadioBtn, allCheckAll)

    /** Form of team selector **/
    const formTeamCriteria = document.getElementById("form-criteria");

    formTeamCriteria.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        hideHeader();
        // Retrieve the number of champions selected
        const selectedRadioButton = document.querySelector('input[name="team-2-or-4-restriction"]:checked');

        if (selectedProfiles.length == 1) {
            numberOfChampions = 4;
        } else if (selectedProfiles.length == 0) {
            numberOfChampions = selectedRadioButton ? parseInt(selectedRadioButton.value) : 2;
            accounts.forEach(account => {
                selectedProfiles.push(account.name.toLowerCase())
            })
        } else {
            numberOfChampions = selectedRadioButton ? parseInt(selectedRadioButton.value) : 2;
        }

        // Retrieve the selected element 
        elementRestrictions = Array.from(document.querySelectorAll('.wrap-elements input[type="checkbox"]'))
            .filter(input => input.checked)
            .map(input => input.id);

        // from the list of selected characters, get an array of characters available for randomizer
        if (elementRestrictions.length > 0) {
            createTempCharListAcc(elementRestrictions, numberOfChampions);
        } else {
            alert("Please select a criteria")
        }

        // Reset the form
        formTeamCriteria.reset();
        selectedAccounts = [];
        selectedProfiles = [];
    });


    /** Form of team Profile saver */
    const formProfile = document.getElementById("new-profile");
    formProfile.addEventListener("submit", function (event) {
        event.preventDefault();
        //Retrieve profile name
        const nameTeam = document.getElementById("name-profile").value;
        saveProfile(nameTeam, selectedCharacters);
        formProfile.reset();
        selectedCharacters = [];
        characters_list = [];
        characters_boardHTML.innerHTML = "";
        openNewProfileArea();
    });


    /** Form of team Profile saver */
    const formTeam = document.getElementById("new-team");
    formTeam.addEventListener("submit", function (event) {
        event.preventDefault();
        //Retrieve profile name
        const nameTeam = document.getElementById("name-team").value;
        if (selectedCharacters.length != 4) {
            alert("Please select 4 characters")
        } else {
            saveTeam(nameTeam, selectedCharacters);
            selectedCharacters = [];
            formProfile.reset();
            document.getElementById("name-team").value = "";
            openTeamCreator();
        }
    });
});

function connectAllCheckbox(elementsCheckboxes, starsCheckboxes, weaponsCheckboxes, genderCheckboxes, heightCheckboxes, locationCheckboxes, numberTeamRadioBtn, allCheckAll) {
    //Profiles
    // on getProfiles

    //Number of Characters per Team
    numberTeamRadioBtn.forEach(button => {
        button.addEventListener('change', function (event) {
            numberOfChampions = event.target.value;
        })
    })

    //Elements Event Listener
    elementsCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.id === "all-elements") {
                elementsCheckboxes.forEach(cb => {
                    cb.checked = this.checked;
                });
                updateSelectedCheckbox(elementsCheckboxes, "all-elements")
            } else {
                if (this.checked) {
                    selectedElements.push(this.id);
                } else {
                    updateSelectedCheckbox(elementsCheckboxes, "all-elements")
                }
                const allCheckbox = document.getElementById("all-elements");
                allCheckbox.checked = elementsCheckboxes.length === selectedElements.length + 1;
            }
        });
    });

    //Starts Event Listener
    starsCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.id === "all-stars") {
                starsCheckboxes.forEach(cb => {
                    cb.checked = this.checked;
                });
                updateSelectedCheckbox(starsCheckboxes, "all-stars")
            } else {
                if (this.checked) {
                    selectedStars.push(this.value);
                } else {
                    updateSelectedCheckbox(starsCheckboxes, "all-stars")
                }
                const allCheckbox = document.getElementById("all-stars");
                allCheckbox.checked = starsCheckboxes.length === selectedStars.length + 1;
            }
        });
    });

    //Weapons Event Listener
    weaponsCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.id === "all-weapons") {
                weaponsCheckboxes.forEach(cb => {
                    cb.checked = this.checked;
                });
                updateSelectedCheckbox(weaponsCheckboxes, "all-weapons")
            } else {
                if (this.checked) {
                    selectedWeapons.push(this.id);
                } else {
                    updateSelectedCheckbox(weaponsCheckboxes, "all-weapons")
                }
                const allCheckbox = document.getElementById("all-weapons");
                allCheckbox.checked = weaponsCheckboxes.length === selectedWeapons.length + 1;
            }
        });
    });

    //Gender Event Listener
    genderCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.id === "all-genders") {
                genderCheckboxes.forEach(cb => {
                    cb.checked = this.checked;
                });
                updateSelectedCheckbox(genderCheckboxes, "all-genders")
            } else {
                if (this.checked) {
                    selectedGenders.push(this.id);
                } else {
                    updateSelectedCheckbox(genderCheckboxes, "all-genders")
                }
                const allCheckbox = document.getElementById("all-genders");
                allCheckbox.checked = genderCheckboxes.length === selectedGenders.length + 1;
            }
        });
    });

    //Height Event Listener
    heightCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.id === "all-heights") {
                heightCheckboxes.forEach(cb => {
                    cb.checked = this.checked;
                });
                updateSelectedCheckbox(heightCheckboxes, "all-heights")
            } else {
                if (this.checked) {
                    selectedHeights.push(this.id);
                } else {
                    updateSelectedCheckbox(heightCheckboxes, "all-heights")
                }
                const allCheckbox = document.getElementById("all-heights");
                allCheckbox.checked = heightCheckboxes.length === selectedHeights.length + 1;
            }
        });
    });

    //Location Event Listener
    locationCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.id === "all-locations") {
                locationCheckboxes.forEach(cb => {
                    cb.checked = this.checked;
                });
                updateSelectedCheckbox(locationCheckboxes, "all-locations")
            } else {
                if (this.checked) {
                    selectedLocations.push(this.id);
                } else {
                    updateSelectedCheckbox(locationCheckboxes, "all-locations")
                }
                const allCheckbox = document.getElementById("all-locations");
                allCheckbox.checked = locationCheckboxes.length === selectedLocations.length + 1;
            }
        });
    });
}

function updateSelectedCheckbox(checkboxes, typeID) {
    switch (typeID) {
        case "all-elements":
            selectedElements = Array.from(checkboxes)
                .filter(cb => cb.id !== typeID && cb.checked)
                .map(cb => cb.id);
            break;
        case "all-stars":
            selectedStars = Array.from(checkboxes)
                .filter(cb => cb.id !== typeID && cb.checked)
                .map(cb => cb.value);
            break;
        case "all-weapons":
            selectedWeapons = Array.from(checkboxes)
                .filter(cb => cb.id !== typeID && cb.checked)
                .map(cb => cb.id);
            break;
        case "all-genders":
            selectedGenders = Array.from(checkboxes)
                .filter(cb => cb.id !== typeID && cb.checked)
                .map(cb => cb.id);
            break;
        case "all-heights":
            selectedHeights = Array.from(checkboxes)
                .filter(cb => cb.id !== typeID && cb.checked)
                .map(cb => cb.id);
            break;
        case "all-locations":
            selectedLocations = Array.from(checkboxes)
                .filter(cb => cb.id !== typeID && cb.checked)
                .map(cb => cb.value);
            break;
        case "team-2-or-4":
            numberOfChampions = checkboxes[0].value
            break
        default:
            // Handle any other cases or do nothing
            break;
    }
}

function updateAllCheckbox(cb0, cb1, cb2, cb3, cb4, cb5, rb1) {
    updateSelectedCheckbox(cb0, "all-elements")
    updateSelectedCheckbox(cb1, "all-stars")
    updateSelectedCheckbox(cb2, "all-weapons")
    updateSelectedCheckbox(cb3, "all-genders")
    updateSelectedCheckbox(cb4, "all-heights")
    updateSelectedCheckbox(cb5, "all-locations")
    updateSelectedCheckbox(rb1, "team-2-or-4")
}

function togleChecks() {
    const criteriaRandomizerDiv = document.getElementById('criteria_randomizer');
    const allCheckboxes = criteriaRandomizerDiv.querySelectorAll('input[type="checkbox"]');
    if (allChecked) {
        allCheckboxes.removeAttribute(checked)
    } else {
        allCheckboxes.checked = true
        allCheckboxes.setAttribute(checked, true)
    }
    allChecked = !allChecked
}


const showRandomTeam = () => {
    random_team_boardHTML.innerHTML = "";
    random_team_boardHTML.classList.add("d-none");
    selectedCharacters.forEach(account => {
        let divAccount = document.createElement("div")
        divAccount.innerHTML += `
            <div class="d-flex flex-column align-items-center">
                <h2>${account.name}</h2>
                <div>`
        let div = document.createElement("div")
        div.classList.add("characters_restrictions")
        for (let i = 0; i < account.characters.length; i++) {
            div.innerHTML += `
                    <div class="d-flex flex-column align-items-center">
                        <div>
                            <img src="${account.characters[i].image_src}">
                        </div>
                    <h4>${account.characters[i].name}</h4>
                    </div>
            `
        }
        divAccount.appendChild(div)
        random_team_boardHTML.appendChild(divAccount)

    })


    setTimeout(() => {
        random_team_boardHTML.classList.remove("d-none");
    }, 300)

};

function createTempCharListAcc(elementRestrictions, numberOfChampions) {
    selectedCharacters = [];
    getSelectedAccounts()
    selectedAccounts.forEach(account => {
        let result = account.characters.filter(character => {
            return elementRestrictions.every(restriction =>
                character.element.toUpperCase() !== restriction.toUpperCase()
            );
        });

        let finalCharacterArray = result;
        if (previousCharacters.length > 0) {
            finalCharacterArray = result.filter(character => {
                return !previousCharacters.some(removeCharacter =>
                    removeCharacter.name === character.name)
            })
        }

        let selected_characters = getRandomElementsFromArray(finalCharacterArray, numberOfChampions);
        let temp_characters = {
            "name": account.name,
            "id": account.id,
            "characters": selected_characters
        };
        selectedCharacters.push(temp_characters);
        previousCharacters = [];
    });
    showRandomTeam();
    selectedCharacters.forEach(account => {
        for (let i = 0; i < account.characters.length; i++) {
            previousCharacters.push(account.characters[i])
        }
    })
}


const fetchElement = async (link, callback) => {
    try {
        const response = await fetch(link);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        callback(data);
    } catch (error) {
        console.error('Error fetching JSON:', error);
    }
}


function submitCriteria() {
    document.getElementById('cta-submit_criteria').classList.add("d-none")
    document.getElementById('criterias_wrapper').classList.add("d-none")
    document.getElementById('cta-new_random_team').classList.remove("d-none")
    document.getElementById('team_per_criteria').classList.remove("d-none")
    const tempFilteredAccounts = []

    if (selectedProfiles.length == 0) {
        accounts.forEach(account => {
            selectedProfiles.push(account.name.toLowerCase())
        })
    }
    getSelectedAccounts()
    selectedAccounts.forEach(account => {
        let tempAccountCharacters = account.characters.filter(character => {
            const result = selectedElements.includes(character.element)
                && selectedStars.includes(character.stars)
                && selectedGenders.includes(character.sex)
                && selectedHeights.includes(character.height)
                && selectedWeapons.includes(character.weapon)
                && selectedLocations.includes(character.location)


            if (result) {
                return character
            }
        })

        let tempAccount = {
            name: account.name,
            id: account.id,
            characters: tempAccountCharacters
        }
        tempFilteredAccounts.push(tempAccount)
    })

    //here
    getTeamPerCriteria(tempFilteredAccounts, numberOfChampions)
}

function reopenCriteriaPicker() {
    document.getElementById('cta-submit_criteria').classList.remove("d-none")
    document.getElementById('criterias_wrapper').classList.remove("d-none")
    document.getElementById('cta-new_random_team').classList.add("d-none")
    document.getElementById('team_per_criteria').classList.add("d-none")
    document.getElementById('team_per_criteria').innerHTML = "";
}

function getTeamPerCriteria(tempFilteredAccounts, nrOfChampions) {
    previousCharacters2 = previousCharacters
    previousCharacters = [];
    let wrapDIV = document.getElementById('team_per_criteria');
    tempFilteredAccounts.forEach(account => {
        let finalCharacterArray = account.characters;
        if (previousCharacters2.length > 0) {
            finalCharacterArray = account.characters.filter(character => {
                return !previousCharacters2.some(removeCharacter =>
                    removeCharacter.name === character.name)
            })
        }
        let selected_characters = getRandomElementsFromArray(finalCharacterArray, nrOfChampions)
        selected_characters.forEach(champion => {
            previousCharacters.push(champion);
        })
        let divAccount = document.createElement("div")
        divAccount.classList.add("show_random_team-criteria")
        divAccount.innerHTML +=
            `<div class="d-flex justify-content-center">
            <h3>${account.name}</h3>
            </div>`
        const div = document.createElement('div')
        div.classList.add("characters_restrictions")
        if (selected_characters.length > 0) {
            for (let i = 0; i < selected_characters.length; i++) {
                div.innerHTML += `
                <div class="d-flex flex-column align-items-center gap-1">
                <img src="${selected_characters[i].image_src}" alt = ${selected_characters[i].name}>
                <p>${selected_characters[i].name}</p>
                </div>`
                divAccount.appendChild(div)
            }
        } else {
            div.innerHTML = `<h2> No champion found per criteria </h2>`
            divAccount.appendChild(div)
        }
        wrapDIV.appendChild(divAccount)
        //reset selected profiles for the default
        selectedProfiles = [];
    })
}


/*** Acounts related functions */
const openProfilesManager = () => {
    closeWrappers()
    accounts_managerHTML.classList.remove("d-none")
}


const showCharacters = (listToShow, whereToShow) => {
    listToShow.forEach((character) => {
        let characterCard = document.createElement('div');
        let cls = getBgClass(character);
        characterCard.classList.add(cls)
        characterCard.innerHTML = `
            <div class="character_wrapp" id="character_${character.id}">
                <img src="${character.image_src}" alt="${character.name}">
                <p>${character.name}</p>
            </div>`;

        characterCard.addEventListener('click', () => {
            character.selected = !character.selected;

            if (character.selected) {
                document.getElementById(`character_${character.id}`).classList.add('selected');
                addCharacterToSelected(selectedCharacters, character);
            } else {
                document.getElementById(`character_${character.id}`).classList.remove('selected');
                removeElementFromArray(selectedCharacters, character);
            }
        });


        whereToShow.appendChild(characterCard);
        if (character.selected) {
            document.getElementById(`character_${character.id}`).classList.add('selected');
        }
    });
}

function addCharacterToSelected(selectedCharacters, character) {
    let exists = inTheArray(selectedCharacters, character)
    if (!exists) {
        selectedCharacters.push(character)
    }

}

function removeElementFromArray(arr, element) {
    const indexToRemove = arr.findIndex(hero => hero.id === element.id)

    if (indexToRemove !== -1) {
        arr.splice(indexToRemove, 1);
    }
}


function inTheArray(selectedCharacters, character) {
    const found = selectedCharacters.find(hero => hero.id === character.id)
    if (found === undefined) {
        return false;
    } else {
        return true;
    }
}

function getBgClass(character) {
    switch (character.element) {
        case "hydro":
            return "hydro-cls";
        case "anemo":
            return "anemo-cls";
        case "pyro":
            return "pyro-cls";
        case "cryo":
            return "cryo-cls";
        case "electro":
            return "electro-cls";
        case "geo":
            return "geo-cls";
        case "dendro":
            return "dendro-cls";
        default:
            return "omni-cls"

    }
}


/** New Profile **/
const openNewProfileArea = async () => {
    selectedCharacters = [];
    existing_profile_wrapperHTML.classList.add("d-none");
    await fetchElement(dataURL, data => {
        characters_list = data.characters
        characters_list = sortArray(characters_list)
    });
    new_profile_wrapperHTML.classList.remove("d-none");
    characters_boardHTML.innerHTML = "";
    showCharacters(characters_list, characters_boardHTML)
}


/** Existing Profile */
function openExistingProfileArea() {
    selectedCharacters = [];
    new_profile_wrapperHTML.classList.add("d-none")
    existing_profile_wrapperHTML.classList.remove("d-none")
    characters_boardHTML.innerHTML = "";

    const cta_profileHTML = document.getElementById("cta-profile");
    cta_profileHTML.innerHTML = "";
    accounts.forEach(profile => {
        let cta_profileDIV = document.createElement("div");
        cta_profileDIV.innerHTML = `
        <button class="btn btn-info" onclick="showProfileCharacters(${profile.id})">${profile.name}</button">
        <div>
        <button class="btn btn-success" onclick="updateProfile(${profile.id})"><span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sd-card" viewBox="0 0 16 16">
        <path d="M6.25 3.5a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0zm2 0a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0zm2 0a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0zm2 0a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0z"/>
        <path fill-rule="evenodd" d="M5.914 0H12.5A1.5 1.5 0 0 1 14 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5V3.914c0-.398.158-.78.44-1.06L4.853.439A1.5 1.5 0 0 1 5.914 0M13 1.5a.5.5 0 0 0-.5-.5H5.914a.5.5 0 0 0-.353.146L3.146 3.561A.5.5 0 0 0 3 3.914V14.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5z"/>
        </svg></span></button>
        <button class="btn btn-danger" onclick="deleteProfile(${profile.id})"><span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
        </svg></span></button>
        </div>
        `;
        cta_profileDIV.classList.add("d-flex")
        cta_profileDIV.classList.add("gap-2")

        cta_profileHTML.appendChild(cta_profileDIV);
    })

}

const showProfileCharacters = async (id) => {
    characters_boardHTML.classList.remove("d-none")
    characters_boardHTML.innerHTML = "";
    let result = accounts.find(profile => profile.id === id);
    // Ensure to await the asynchronous function fetchElement()
    await fetchElement(dataURL, data => {
        characters_list = data.characters
    });

    let listToShow = characters_list.map(character => {
        const matchingCharacter = result.characters.find(accCharacter => accCharacter.id === character.id);
        if (matchingCharacter) {
            return matchingCharacter;
        }
        return character;
    });

    listToShow = sortArray(listToShow);
    showCharacters(listToShow, characters_boardHTML);
    selectedCharacters = listToShow;
};

/** New team **/
const openTeamCreator = async () => {
    selected_team_wrapperHTML.classList.add("d-none")
    await fetchElement(dataURL, data => {
        characters_list = data.characters
    });
    new_team_wrapperHTML.classList.remove("d-none");
    teamCreator_wrapperHTML.classList.remove("d-none")
    teamCreator_boardHTML.classList.remove("d-none")
    teamCreator_boardHTML.innerHTML = "";
    showCharacters(characters_list, teamCreator_boardHTML)
    showTeams(teamsPreview_boardHTML, teams)
}

const selectRandomTeam = () => {
    selectedCharacters = [];
    selected_team_wrapperHTML.innerHTML = "";
    teamCreator_wrapperHTML.classList.add("d-none")
    new_team_wrapperHTML.classList.add("d-none");
    selected_team_wrapperHTML.classList.remove("d-none")
    let team = getRandomElementsFromArray(teams, 1)
    showTeams(selected_team_wrapperHTML, team)
}

const showTeams = (whereToShow, arr) => {
    whereToShow.innerHTML = "";
    if (!teams || teams.length < 1) {
        whereToShow.innerHTML = "No team saved!"
    } else {
        let teamCard = document.createElement('div');
        arr.forEach(team => {
            teamCard.innerHTML +=
                `
            <div class="d-flex flex-column align-items-center team_preview">
                <div class="d-flex justify-content-between w-100 p-3">
                    <h3>${team.name}</h3>
                    <button class="btn btn-danger" onclick="deleteTeam(${team.id})"><span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                    </svg></span></button>
                </div>
            <div>
            <div class="d-flex">
                <div class="d-flex flex-column align-items-center w-25 ">
                    <img src="${team.characters[0].image_src}" alt="${team.characters[0].name}">
                    <p>${team.characters[0].name}</p>
                </div>
                <div class="d-flex flex-column align-items-center w-25">
                    <img src="${team.characters[1].image_src}" alt="${team.characters[1].name}">
                    <p>${team.characters[1].name}</p>
                </div>
                <div class="d-flex flex-column align-items-center w-25">
                    <img src="${team.characters[2].image_src}" alt="${team.characters[2].name}">
                    <p>${team.characters[2].name}</p>
                </div>
                <div class="d-flex flex-column align-items-center w-25">
                    <img src="${team.characters[3].image_src}" alt="${team.characters[3].name}">
                    <p>${team.characters[3].name}</p>
                </div>
            </div>
            
            </div>
            `
        })
        whereToShow.appendChild(teamCard);
    }
}





/*** CTA Buttons */
const saveProfile = (nameProfile, selectedCharacters) => {
    let timestamp = new Date().getTime();
    let newProfile = {
        "name": nameProfile,
        "id": timestamp,
        "characters": selectedCharacters
    }

    //Check if Profile already exists
    nameExists = accounts.some(profile => profile.name === newProfile.name)
    if (!nameExists) {
        accounts.push(newProfile);
        saveLocal('profiles');
    } else {
        alert("Profile already exists")
    }
}


const deleteProfile = (profileID) => {
    const indexToRemove = accounts.findIndex(profile => profile.id === profileID)
    if (indexToRemove !== -1) {
        accounts.splice(indexToRemove, 1);
    }
    saveLocal('profiles')
    openExistingProfileArea()
}


const deleteTeam = (teamID) => {
    const indexToRemove = teams.findIndex(team => team.id === teamID)
    if (indexToRemove !== -1) {
        teams.splice(indexToRemove, 1);
    }
    saveLocal('teams')
    showTeams(teamsPreview_boardHTML, teams);
}

const updateProfile = (profileID) => {
    const indexToUpdate = accounts.findIndex(profile => profile.id === profileID)
    let tempArray = [];
    selectedCharacters.forEach(character => {
        if (character.selected == true) {
            tempArray.push(character)
        }
    })
    accounts[indexToUpdate].characters = tempArray;
    saveLocal('profiles');
    characters_boardHTML.classList.add("d-none")
}

const saveTeam = (nameTeam, selectedCharacters) => {
    let timestamp = new Date().getTime();
    let newTeam = {
        "name": nameTeam,
        "id": timestamp,
        "characters": selectedCharacters
    }

    //Check if Profile already exists
    if (!teams) {
        teams = [];
        teams.push(newTeam);
        saveLocal('teams');
    } else {
        nameExists = teams.some(team => team.name === newTeam.name)
        if (!nameExists) {
            teams.push(newTeam);
            saveLocal('teams');
        } else {
            alert("Profile already exists")
        }
    }
    selectedCharacters = [];
}

function openTeamRandomizer() {
    closeWrappers();
    getProfiles("criteria-profiles");
    criteria_randomizerHTML.classList.remove("d-none");
}

function openElementRandomizer() {
    closeWrappers()
    team_randomizerHTML.classList.remove('d-none')
    teamCreator_wrapperHTML.classList.remove('d-none')
    getProfiles("restrictions-profiles")
}

function openTeamPicker() {
    closeWrappers()
    teams_managerHTML.classList.remove('d-none')
}

async function openWeekly() {
    closeWrappers()
    weekly_randomizerHTML.classList.remove("d-none");
    const cta = document.getElementById('cta-getWeeklyRandomBoss');
    cta.innerHTML = 'Pick a Boss'

    //Fetch for the initial preview list of W.B.
    await fetchRandomWeeklyBossList();
    renderWeeklyBossesList(cta)
}

async function fetchRandomWeeklyBossList() {
    if (firstWeeklyBoss) {
        await fetchElement(dataURL, data => {
            weekly_list = data.weekly_boss
        });
    }
}

function removeWeeklyBoss(idToRemove) {
    firstWeeklyBoss = false
    const cta = document.getElementById('cta-getWeeklyRandomBoss');
    let index = weekly_list.findIndex(boss => boss.id === idToRemove)
    removeElementFromArray(weekly_list, weekly_list[index])
    weekly_boss_randomizer_boardHTML.innerHTML = "";
    renderWeeklyBossesList(cta);
}

async function getRandomWeeklyBoss() {
    const cta = document.getElementById('cta-getWeeklyRandomBoss');
    cta.innerHTML = "Pick a Boss"

    //Fetch the W.B. for the reset
    if (firstWeeklyBoss) {
        await fetchRandomWeeklyBossList()
    }
    if (weekly_list.length > 0) {
        let weekly_int = getRandomElementsFromArray(weekly_list, 1);
        weekly_boss_randomizer_boardHTML.innerHTML = '';
        const div = document.createElement('div');
        div.innerHTML = `
        <div class="d-flex flex-column align-items-center boss-div">
        <h2 class="text-capitalize">${weekly_int[0].name}</h2>
        <img src="${weekly_int[0].image_src}" alt="${weekly_int[0].name}">
        </div>
        `;
        removeElementFromArray(weekly_list, weekly_int[0])
        firstWeeklyBoss = false
        weekly_boss_randomizer_boardHTML.appendChild(div)
        renderWeeklyBossesList(cta)
    } else {
        alert("Error by weekly boss randomiser")
    }
}


function renderWeeklyBossesList(cta) {
    const weeklyBossesListHTML = document.createElement('div')
    weeklyBossesListHTML.classList.add("boss_list")
    weeklyBossesListHTML.innerHTML = "";
    for (let i = 0; i < weekly_list.length; i++) {
        weeklyBossesListHTML.innerHTML += `
            <div class="boss_mini" onclick="removeWeeklyBoss(${weekly_list[i].id})">
            <img src="${weekly_list[i].image_src}">
            </div>
            `;
    }
    weekly_boss_randomizer_boardHTML.appendChild(weeklyBossesListHTML)
    if (weekly_list.length == 0) {
        cta.innerHTML = 'Reset Weekly Bosses'
        weeklyBossesListHTML.innerHTML = `
        <div class="d-flex justify-content-center">
            <h2>Congratulation! You have killed all the bosses</h2>
        </div>
        `
        firstWeeklyBoss = true;
    }
}



async function openBoss() {
    closeWrappers()
    boss_randomizerHTML.classList.remove("d-none");
    let cta = document.getElementById("cta-getRandomBoss");
    cta.innerHTML = "Pick a Boss"

    //Fetch for the preview of the  Bosses list
    await fetchRandomBossList()
    renderBossesList()
}

async function fetchRandomBossList() {
    if (firstBoss) {
        await fetchElement(dataURL, data => {
            bosses_list = data.world_boss
        });
    }
}


async function getRandomBoss() {
    boss_randomizer_boardHTML.innerHTML = "";
    let cta = document.getElementById("cta-getRandomBoss");
    cta.innerHTML = "Pick a Boss"

    if (firstBoss) {
        await fetchRandomBossList()
    }

    if (bosses_list.length > 0) {
        let boss = getRandomElementsFromArray(bosses_list, 1);
        boss_randomizer_boardHTML.innerHTML = "";
        const div = document.createElement('div');
        div.innerHTML = `
        <div class="d-flex flex-column align-items-center boss-div p-3">
        <h2 class="text-capitalize">${boss[0].name}</h2>
        <img src="${boss[0].image_src}" alt="${boss[0].name}" class="p-3" >
        </div>`;

        removeElementFromArray(bosses_list, boss[0])
        firstBoss = false
        boss_randomizer_boardHTML.appendChild(div)
        renderBossesList(cta)

    } else {
        alert("Error by boss randomizer")
    }
}

function renderBossesList(cta) {
    const bossesListHTML = document.createElement('div')
    bossesListHTML.classList.add("boss_list")
    bossesListHTML.innerHTML = "";
    for (let i = 0; i < bosses_list.length; i++) {
        bossesListHTML.innerHTML += `
            <div class="boss_mini" onclick="removeBoss(${bosses_list[i].id})">
            <img src="${bosses_list[i].image_src}">
            </div>
            `;
    }
    boss_randomizer_boardHTML.appendChild(bossesListHTML)
    if (bosses_list.length == 0) {
        cta.innerHTML = "Reset boss list"
        bossesListHTML.innerHTML = `
            <div class="d-flex justify-content-center">
                <h2>Congratulation! You have killed all the bosses</h2>
            </div>
            `
        firstBoss = true;
    }
}

function removeBoss(idToRemove) {
    firstBoss = false
    const cta = document.getElementById('cta-getRandomBoss');
    let index = bosses_list.findIndex(boss => boss.id === idToRemove)
    removeElementFromArray(bosses_list, bosses_list[index])
    boss_randomizer_boardHTML.innerHTML = "";
    renderBossesList(cta)
}


function getProfiles(id) {
    let profiles_checkboxHTML = document.getElementById(id)
    profiles_checkboxHTML.innerHTML = "";
    accounts.forEach(profile => {
        profiles_checkboxHTML.innerHTML += `
        <input class="form-check-input" type="checkbox" value="${profile.name.toLowerCase()}" id="${profile.name.toLowerCase()}">
                                <label class="form-check-label" for="omni">
                                    ${profile.name}
                                </label>        `
    })
    const profilesCheckboxes = document.querySelectorAll('.wrap-profiles input[type="checkbox"]');
    profilesCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function (event) {
            if (event.srcElement.checked) {
                selectedProfiles.push(event.srcElement.id)
            } else {
                removeElementFromArray(selectedProfiles, event.srcElement.id)
            }
            console.log(selectedProfiles)
        });
    });
}

function getSelectedAccounts() {
    selectedAccounts = []
    accounts.forEach(account => {
        selectedProfiles.forEach(profile => {
            if (account.name.toLowerCase() == profile) {
                selectedAccounts.push(account)
            }
        })
    })
}


function closeWrappers() {
    hideHeader();
    team_randomizerHTML.classList.add('d-none');
    teams_managerHTML.classList.add('d-none');
    boss_randomizerHTML.classList.add('d-none');
    weekly_randomizerHTML.classList.add('d-none');
    accounts_managerHTML.classList.add("d-none");
    new_profile_wrapperHTML.classList.add("d-none");
    teamCreator_wrapperHTML.classList.add("d-none");
    teamCreator_boardHTML.classList.add("d-none");
    new_team_wrapperHTML.classList.add("d-none")
    criteria_randomizerHTML.classList.add("d-none")
    characters_boardHTML.innerHTML = "";
    random_team_boardHTML.innerHTML = "";
    selectedCharacters = [];
    selectedProfiles = [];

    weekly_boss_randomizer_boardHTML.innerHTML = "";
    boss_randomizer_boardHTML.innerHTML = "";
}

function hideHeader() {
    const headerElement = document.querySelector('header'); // Replace 'header' with your header's specific selector

    if (headerElement) {
        headerElement.style.display = 'none';
    }
}


/*** Randomizer functions */
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandomElementsFromArray(arr, numElements) {
    if (numElements >= arr.length) {
        return arr; // Return the entire array if numElements is greater than or equal to the array length
    } else {
        const shuffled = arr.slice().sort(() => Math.random() - 0.5); // Create a shuffled copy of the array
        return shuffled.slice(0, numElements); // Return a slice of the shuffled array with numElements
    }
}


/*** Sort array ***/
function sortArray(arr) {
    let result = arr.sort((a, b) => {
        const nameA = a.name.toUpperCase(); // Convert names to uppercase for case-insensitive comparison
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0; // Names are equal
    });
    return result;
}

/*** Reset Functions **/
function removeSelectedClass() {
    characters_list.forEach(character => {
        const characterElement = document.getElementById(`character_${character.id}`);
        if (characterElement) {
            characterElement.classList.remove('selected');
        }
    })
}



/*** Local storage ***/
// Data to be saved

const saveLocal = (element) => {
    if (element === 'profiles') {
        // Convert the object to a string before saving to localStorage
        const profilesString = JSON.stringify(accounts);
        // Save to localStorage with a specific key
        localStorage.setItem('profiles', profilesString);
    } else if (element === 'teams') {
        // Convert the object to a string before saving to localStorage
        const profilesString = JSON.stringify(teams);
        // Save to localStorage with a specific key
        localStorage.setItem('teams', profilesString);
    }
}


const getLocal = () => {
    // Retrieve the data using the same key
    const storedProfileLocal = localStorage.getItem('profiles');
    const storedTeamsLocal = localStorage.getItem('teams');

    if (storedProfileLocal) {
        // Convert the retrieved string back to an object
        accounts = JSON.parse(storedProfileLocal);
        teams = JSON.parse(storedTeamsLocal);
    } else {
        console.log('No data found in localStorage');
    }
}

