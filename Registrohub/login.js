const login_btn = document.getElementById("login-btn");
const reg_btn = document.getElementById("reg-btn");
const toggle_password_btn = document.getElementById("toggle-password-btn");
const password_input_el = document.getElementById("password_input");



let login_feedback = document.getElementById("login-feedback");

login_btn.addEventListener("click", async () => {
    let username_input = document.getElementById("username_input").value;
    let password_input = document.getElementById("password_input").value;
    
    try {
        const res = await fetch("login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username_input, password: password_input })
        });
        const data = await res.json();

        if (data.success) {
            console.log("Login Success");
            login_feedback.textContent = data.message;
            login_feedback.style.color = "#429B58";

            setTimeout(() => {
                window.location.replace(data.redirect); // Admin/admin_view.html or Student/student_view.html
            }, 1000); // after 1 sec bago mapunta sa dashboard
        } else {
            console.log("Input fields are required");
            login_feedback.textContent = data.message;
            login_feedback.style.color = "#B93E2E";
        }
    } catch (err) {
        console.error("Login request failed:", err);
        login_feedback.textContent = "Something went wrong. Please try again.";
        login_feedback.style.color = "#B93E2E";
    }
})

reg_btn.addEventListener("click", () => {
    window.location.href = "registration.html";
})

toggle_password_btn.addEventListener("click", () => {
    const isHidden = password_input_el.type === "password";
    password_input_el.type = isHidden ? "text" : "password";
    toggle_password_btn.textContent = isHidden ? "Hide" : "Show";
    toggle_password_btn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
})