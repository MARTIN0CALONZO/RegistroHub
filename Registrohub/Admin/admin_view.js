const tbody = document.getElementById("students-tbody");

let allStudents = [];

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function renderStudents(list){
    tbody.innerHTML = "";
    if(list.length === 0){
        tbody.innerHTML = `<tr><td colspan="10">No records found.</td></tr>`;
        recordCount.textContent = `Showing 0 of ${allStudents.length} records`;
        return;
    }

    list.forEach((s) => {
        const fullName = [s.first_name, s.middle_name, s.last_name].filter(Boolean).join(' ');
        const tr = document.createElement("tr");

        tr.innerHTML = `
        <td>${fullName}</td>
        <td>${s.birthdate}</td>
        <td>${s.age}</td>
        <td>${s.sex}</td>
        <td>${s.address}</td>
        <td>${s.course_name}</td>
        <td><span class = "pill">${s.year_level}</span></td>
        <td>${s.email}</td>
        <td>${s.contact_number}</td>
        <td><button class = "btn btn-ghost btn-small delete-btn" data-id="${s.id}">Delete Record</button></td>
        `;
        tbody.appendChild(tr);

        console.log("Name:",fullName);
        console.log("Birthdate:", s.birthdate);
        console.log("Age:",s.age);
        console.log("Sex:", s.sex);
        console.log("Address:", s.address);
        console.log("Course:", s.course_name);
        console.log("Year:", s.year_level);
        console.log("Email:", s.email);
        console.log("Contact Number:", s.contact_number);
    });
    
    recordCount.textContent = `Showing ${list.length} of ${allStudents.length} records`;
}

async function loadStudents() {
    try {
        const res = await fetch("get_student.php");
        const data = await res.json();

        if (!data.success) {
            tbody.innerHTML = `<tr><td colspan="10">${data.message || "Could not load records."}</td></tr>`;
            return;
        }

        allStudents = data.students;
        renderStudents(allStudents);
    } catch (err) {
        console.error("Failed to load students:", err);
        tbody.innerHTML = `<tr><td colspan="10">Something went wrong loading records.</td></tr>`;
    }
}

loadStudents();

tbody.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("delete-btn")) return;

    const studentId = e.target.dataset.id;

    const confirmDelete = confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;

    try {
        const res = await fetch("delete_student.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: studentId
            })
        });

        const data = await res.json();

        if (data.success) {
            // Reload the table
            loadStudents();
        } else {
            alert(data.message);
        }

    } catch (err) {
        console.error(err);
        alert("Failed to delete student.");
    }
});

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

const searchInput = document.getElementById("search-input");
const programFilter = document.getElementById("program-filter");
const yearFilter = document.getElementById("year-filter");

console.log(searchInput);
console.log(programFilter);
console.log(yearFilter);

function filterStudents() {
    console.log("Filtering...");
    const search = searchInput.value.toLowerCase().trim();
    const program = programFilter.value;
    const year = yearFilter.value;

    const filtered = allStudents.filter(student => {

        const fullName = `${student.first_name} ${student.middle_name || ""} ${student.last_name}`.toLowerCase();

        const matchesSearch =
            fullName.includes(search) ||
            student.email.toLowerCase().includes(search) ||
            String(student.id).includes(search);

        const matchesProgram =
            program === "" || student.course_name === program;

        const matchesYear =
            year === "" || student.year_level === year;

        return matchesSearch && matchesProgram && matchesYear;

    });

    renderStudents(filtered);
}

searchInput.addEventListener("input", (filterStudents));
programFilter.addEventListener("change", filterStudents);
yearFilter.addEventListener("change", filterStudents);