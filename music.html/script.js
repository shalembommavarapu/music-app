document.addEventListener("DOMContentLoaded", function () {
    const logoutLink = document.getElementById("logoutLink");

    if (logoutLink) {
        logoutLink.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default link behavior

            // Remove JWT token and user session
            localStorage.removeItem("token");
            localStorage.removeItem("loggedInUser");

            // Redirect directly to login page
            window.location.href = "login.html";
        });
    }
});
