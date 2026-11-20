function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

async function loadProfile() {
    try {
        const res = await fetch("get_profile.php");
        const data = await res.json();

        if (!data.success) {
            document.getElementById("heading-name").textContent = data.message || "Could not load your record.";
            return;
        }

        const s = data.student;
        const fullName = [s.first_name, s.middle_name, s.last_name].filter(Boolean).join(" ");



        document.getElementById("heading-name").textContent = `Welcome, ${fullName}!`;
        document.getElementById("course-title").textContent = s.course_name;
        document.getElementById("bachelor-title").textContent = s.college_name;
        document.getElementById("year-level").textContent = s.year_level;

        document.getElementById("student-fullName").textContent = fullName;
        document.getElementById("studentBirthday").textContent = formatDate(s.birthdate);
        document.getElementById("studentAge").textContent = s.age;
        document.getElementById("studentSex").textContent = s.sex;
        document.getElementById("studentEmail").textContent = s.email;
        document.getElementById("student-phoneNumber").textContent = s.contact_number;
        document.getElementById("student-address").textContent = s.address;

        console.log("Name: ", fullName);
        console.log("Course: ", s.course_name);
        console.log("College: ", s.college_name);
        console.log("Year: ", s.year_level);
        console.log("Birthday: ", formatDate(s.birthdate));
        console.log("Age: ", s.age);
        console.log("Sex: ", s.sex);
        console.log("Email: ", s.email);
        console.log("Phone Number: ", s.contact_number);
        console.log("Address: ", s.address);
    } catch (err) {
        console.error("Failed to load profile:", err);
        document.getElementById("heading-name").textContent = "Something went wrong loading your record.";
    }
}

loadProfile();

const logout_btn = document.getElementById("logout-btn");
const toast = document.getElementById("toast");
const confirmlogout = document.getElementById("confirm-logout-btn");
const cancelbtn = document.getElementById("cancel-btn");

confirmlogout.addEventListener("click", () => {
    window.location.replace("../index.html");
    console.log("logout confirmed");
})

logout_btn.addEventListener("click", () => {
    toast.classList.add("show");
    console.log("logout has been click");
})

cancelbtn.addEventListener("click", () => {
    toast.classList.remove("show");
    console.log("logout cancelled");
})

// Sidebar toggle
const adminShell = document.querySelector('.admin-shell');
const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');

function sidebarState() {
    if (window.innerWidth <= 900) {
        adminShell.classList.add('sidebar-collapsed');
    }
}


sidebarState();

sidebarToggleBtn.addEventListener('click', () => {
    adminShell.classList.toggle('sidebar-collapsed');
});
sidebarToggleBtn.addEventListener('click', () => {
    if(adminShell.classList.contains('sidebar-collapsed')){
        console.log("Sidebar collapsed");
    }
    else{
        console.log("Sidebar expanded");
    }
});