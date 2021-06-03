window.addEventListener("load", async function () {
    //add yeti animation to login and sign up page
    if (document.querySelector(".yeti-animation") != undefined) {
        const yetiAnimationDiv = document.querySelector(".yeti-animation")
        yetiAnimationDiv.innerHTML = `<img src="/images/login-animation/general.png" class="yeti-images" yeti="general">`
        document.querySelector(".container").addEventListener('click', async e => {
            if (e.target && (e.target.matches("#txtUsername") || e.target.matches("#new_acount_username"))) {
                yetiAnimationDiv.innerHTML = `<img src="/images/login-animation/username.png" class="yeti-images" yeti="general">`
            } else if (e.target && (e.target.matches("#txtPassword") || e.target.matches("#new_account_password1") || e.target.matches("#new_account_password2"))) {
                yetiAnimationDiv.innerHTML = `<img src="/images/login-animation/password.png" class="yeti-images" yeti="general">`
            } else {
                yetiAnimationDiv.innerHTML = `<img src="/images/login-animation/general.png" class="yeti-images" yeti="general">`
            }
        });
    }
})
