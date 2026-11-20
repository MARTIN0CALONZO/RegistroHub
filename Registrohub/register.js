const back_to_login = document.getElementById("back-to-login");
const form = document.getElementById("reg-form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
        fname: document.getElementById("fname").value,
        mname: document.getElementById("mname").value,
        lname: document.getElementById("lname").value,
        bdate: document.getElementById("bdate").value,
        sex: document.getElementById("sex").value,
        address: document.getElementById("address").value,
        course: document.getElementById("course").value,
        yrlvl: document.getElementById("yrlvl").value,
        email: document.getElementById("email").value,
        contact: document.getElementById("contact").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    };

    try {
        const res = await fetch("register.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.success) {
            alert(data.message);
            window.location.href = "index.html";
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error("Registration request failed:", err);
        alert("Something went wrong. Please try again.");
    }
})

back_to_login.addEventListener("click", () => {
    window.location.href = "index.html";
})
