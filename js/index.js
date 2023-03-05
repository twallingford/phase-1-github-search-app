//Build a JavaScript app that searches GitHub for users by name and
//displays the results on screen. Clicking the user will show all the 
//repositories for the user.

//When search submitted, it should take the value of the input and search GitHub for user matches using the User Search Endpoint.
//Using results of search, display info about users. Show their username, avatar and a link to their profile.
//Clicking on one of these users should send a request to the User Repos Endpoint and return data about all the repositories for that user.
//Using the response from the Users Repos Endpoint, display all the repositories for that user on the page.
//Toggle the search bar between searching for users by keyword and searching for repos by keyword. Add an extra button to do this.

const searchForm = document.querySelector("#github-form");
const searchInput = document.querySelector("#search");
const userList = document.querySelector("#user-list");
const reposList = document.querySelector("#repos-list");
const nameRadio = document.querySelector('#name-search');
const repoRadio = document.querySelector('#repo-search');

//Add event listener to the form for submission
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    userList.innerHTML = '';
    reposList.innerHTML = '';

    if(nameRadio.checked){
        //Fetch what was in the search input field
        fetch(`https://api.github.com/search/users?q=${searchInput.value}`)
        .then(res => res.json())
        .then(data => {
            //For each user (which is a number in an array of objects) in each item brought back in the data)
            for(let user in data.items){
                //If the input value is in the login name of the user
                if(data.items[user]["login"].includes(searchInput.value)){
                    //Create a card for the user
                    
                    //Creating a user container to make each user obviously separate
                    const userContainer = document.createElement('div');
                    
                    //Creating a name and image field for the login name and avatar of the user
                    const usernameField = document.createElement('p');
                    const userImgField = document.createElement('img');

                    //Making the text of the username field be the person's login name
                    usernameField.innerText = data.items[user]["login"];

                    //Making the image of the user their avatar and scaling it down
                    userImgField.setAttribute("src", data.items[user]["avatar_url"]);
                    userImgField.style.height = '40px';
                    userImgField.style.width = '40px';

                    //Making the <div> item a box with a drop shadow behind it to make the results separated and more "button"-like
                    userContainer.style.boxShadow = '0 4px 8px 0 rgba(0,0,0,0.2)'

                    //Append the container to the user list and the name/avatar to the container
                    userList.appendChild(userContainer);
                    userContainer.appendChild(usernameField);
                    userContainer.appendChild(userImgField);

                    //Add an event listener that, when on click, will bring up their repos
                    userContainer.addEventListener("click", () => {
                        reposList.innerHTML = '';
                        fetch(`https://api.github.com/users/${usernameField.innerText}/repos`)
                            .then(res => res.json())
                            .then(data => {
                                for(let repo in data)
                                {
                                    const repoLink = document.createElement('a');
                                    const repoContainer = document.createElement('div');
                                    const repoNameField = document.createElement('p');

                                    repoLink.setAttribute('href', data[repo]["html_url"]);
                                    repoLink.setAttribute('target', '_blank');

                                    repoContainer.style.boxShadow = '0 4px 8px 0 rgba(0,0,0,0.2)';
                                    repoNameField.innerText = data[repo]["name"];
                                    
                                    repoContainer.appendChild(repoNameField);
                                    repoLink.appendChild(repoContainer);
                                    reposList.appendChild(repoLink);
                                }
                            })
                    })
                }
            }
        })
    }
    else if(repoRadio.checked){
        fetch(`https://api.github.com/search/repositories?q=${searchInput.value}`)
            .then(res => res.json())
            .then(data => {
                for(let repo in data.items){
                    if(data.items[repo]["name"].includes(searchInput.value)){
                        const repoSearchLink = document.createElement('a');
                        const repoSearchContainer = document.createElement('div');
                        const repoSearchNameField = document.createElement('h4');
                        const repoOwnerField = document.createElement('p');
                        const ownerAvatar = document.createElement('img');

                        ownerAvatar.setAttribute('src', data.items[repo]["owner"]["avatar_url"]);
                        ownerAvatar.style.width = '40px';
                        ownerAvatar.style.height = '40px';

                        repoSearchLink.setAttribute('href', data.items[repo]["html_url"]);
                        repoSearchLink.setAttribute('target', '_blank');

                        repoSearchContainer.style.boxShadow = '0 4px 8px 0 rgba(0,0,0,0.2)';
                        repoSearchNameField.innerText = data.items[repo]["name"];

                        repoOwnerField.innerText = 'Owner: ' + data.items[repo]["owner"]["login"]

                        repoSearchContainer.appendChild(repoSearchNameField);
                        repoSearchContainer.appendChild(repoOwnerField);
                        repoSearchContainer.appendChild(ownerAvatar);
                        repoSearchLink.appendChild(repoSearchContainer);
                        reposList.appendChild(repoSearchLink);

                    }
            }})
    }
    else{
        alert('Error: Please select a search type!');
    }
})


//Make it non-case sensitive