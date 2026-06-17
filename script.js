let relativeCount = 0;

// Set max date for birthdate to today
document.getElementById('Bdate').max = new Date().toISOString().split("T")[0];

function switchView(viewId) {
  document.querySelectorAll('.view-container').forEach(view => {
    view.classList.remove('active');
  });

  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.add('active');
  }

  if (viewId === 'view-login') {
    document.body.className = 'landing-bg';
  } else if (viewId === 'view-submitted') {
    document.body.className = 'success-bg';
  } else {
    document.body.className = 'form-bg'; 
  }
  
  window.scrollTo(0, 0);
}

// --- REAL-TIME INLINE ERROR HELPERS ---

function showError(input, message) {
    input.classList.add('input-error');
    let errorSpan = input.nextElementSibling;
    if (!errorSpan || !errorSpan.classList.contains('error-text')) {
        errorSpan = document.createElement('span');
        errorSpan.className = 'error-text';
        // Insert right after the input box
        input.parentNode.insertBefore(errorSpan, input.nextSibling);
    }
    errorSpan.innerText = message;
    return false;
}

function clearError(input) {
    input.classList.remove('input-error');
    let errorSpan = input.nextElementSibling;
    if (errorSpan && errorSpan.classList.contains('error-text')) {
        errorSpan.remove();
    }
    return true;
}

// The core validation logic for individual fields
function validateInput(input) {
    const val = input.value.trim();
    const name = input.name;

    // Skip checking if it's completely empty unless it's required. 
    // The browser's native 'required' attribute handles empty checks.
    if (val === '' && name !== 'religion') {
        return clearError(input);
    }

    if (name === 'password') {
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(val)) {
            return showError(input, "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.");
        }
    }
    if (name === 'Pname' || name === 'relativeName[]') {
        if (val.length < 5) return showError(input, "Please input your full name");
        if (!val.includes(" ")) return showError(input, "Please input your full name.");
        if (!/^[a-zA-Z\s]+$/.test(val)) return showError(input, "Please input your full name");
    }
    if (name === 'Addr') {
        if (val.length < 5 || !val.includes(" ")) return showError(input, "Please enter a valid address.");
    }
    if (name === 'job' || name === 'religion' || name === 'relPatient[]' || name === 'relJob[]') {
        if (val.length > 0 && val.length < 3) return showError(input, "Please enter a valid religion.");
        if (val.length > 0 && !/^[a-zA-Z\s]+$/.test(val)) return showError(input, "Please enter a valid religion.");
    }
    if (name === 'salary' || name === 'relIncome[]') {
        if (isNaN(val) || Number(val) < 0) return showError(input, "Income must be 0 or greater");
    }
    if (name === 'relativeAge[]') {
         if (isNaN(val) || Number(val) < 18) return showError(input, "Relative must be in legal age.");
    }

    // If it passes all checks, remove any existing error
    return clearError(input);
}

// Listeners for real-time checking when leaving a field or typing
const regForm = document.getElementById('registerForm');

// 'blur' triggers when the cursor leaves an input box
regForm.addEventListener('blur', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
        validateInput(e.target);
    }
}, true);

// 'input' triggers while typing to instantly clear errors once corrected
regForm.addEventListener('input', function(e) {
    if (e.target.classList.contains('input-error')) {
        validateInput(e.target); 
    }
}, true);


// --- FORM SUBMISSIONS ---

// 1. Handle Registration
regForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Final sweep to validate everything before sending
  const allInputs = this.querySelectorAll('input, select');
  let isFormValid = true;
  
  allInputs.forEach(input => {
      // If it's required and empty, or if our custom validation fails
      if ((input.required && input.value.trim() === '') || !validateInput(input)) {
          // Trigger the error visual
          if (input.required && input.value.trim() === '') {
              showError(input, "This field is required.");
          }
          isFormValid = false;
      }
  });

  if (!isFormValid) {
      return alert("Please fix the highlighted errors before submitting.");
  }

  const formData = new FormData(this);

  fetch('register.php', { method: 'POST', body: formData })
  .then(res => { if (!res.ok) return res.text().then(t => { throw new Error(t) }); return res.text(); })
  .then(data => {
    if(data.startsWith("SUCCESS:")) {
      alert(`Profile Created Successfully! You can now log in.`);
      this.reset();
      document.getElementById('relatives-dynamic-container').innerHTML = '';
      relativeCount = 0;
      
      // Clear any lingering error styles
      document.querySelectorAll('.input-error').forEach(clearError);
      
      switchView('view-login');
    }
  })
  .catch(err => alert("Registration Error: " + err.message));
});

// 2. Handle Login
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);

  fetch('login.php', { method: 'POST', body: formData })
  .then(res => { if (!res.ok) return res.text().then(t => { throw new Error(t) }); return res.text(); })
  .then(data => {
    if(data.startsWith("SUCCESS|")) {
      const patientID = data.split("|")[1];
      this.reset();
      document.getElementById('welcome-message').innerText = "Patient ID: " + patientID;
      switchView('view-landing');
    }
  })
  .catch(err => alert("Login Error: " + err.message));
});

// 3. Handle Assistance Submission
document.getElementById('assistanceRequestForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);

  fetch('connect.php', { method: 'POST', body: formData })
  .then(res => { if (!res.ok) return res.text().then(t => { throw new Error(t) }); return res.text(); })
  .then(data => {
    if (data.trim() === "SUCCESS") {
        this.reset();
        document.getElementById('requestDetails').style.display = 'none';
        switchView('view-submitted');
    } else {
        alert(data);
    }
  })
  .catch(err => alert("Submission Error: " + err.message));
});

// 4. Logout User
function logoutUser() {
  fetch('logout.php')
  .then(() => {
    document.getElementById('assistanceRequestForm').reset();
    switchView('view-login');
  });
}

// --- UI HELPERS ---

function addNewRelativeEntry() {
  relativeCount++;
  const container = document.getElementById('relatives-dynamic-container');
  const entryHtml = `
    <div class="relative-entry-card" id="relative-entry-${relativeCount}" style="background:#f8f9fa; padding:15px; margin-bottom:15px; border-radius:5px; border:1px solid #ddd;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <button type="button" class="btn btn-secondary" style="padding:5px 10px; font-size:12px;" onclick="removeRelativeEntry(${relativeCount})">✕ Remove</button>
      </div>
      <div class="form-group">
        <label for="relativeName-${relativeCount}">Full Name</label>
        <input type="text" class="form-control" id="relativeName-${relativeCount}" name="relativeName[]" required>
      </div>
      <div class="form-group">
        <label for="relativeAge-${relativeCount}">Age</label>
        <input type="number" class="form-control" id="relativeAge-${relativeCount}" name="relativeAge[]" min='18' required>
      </div>
      <div class="form-group">
        <label for="relativeCivStats-${relativeCount}">Civil Status</label>
        <select id="relativeCivStats-${relativeCount}" name="relCivilStatus[]" class="form-control" required>
          <option value="" disabled hidden selected>Select Status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Widow">Widow</option>
          <option value="Separated">Separated</option>
          <option value="Common-Law Partner">Common-Law Partner</option>
        </select>
      </div>
      <div class="form-group">
        <label for="relativeRelation-${relativeCount}">Relation To Patient</label>
        <input type="text" class="form-control" id="relativeRelation-${relativeCount}" name="relPatient[]" required>
      </div>
      <div class="form-group">
        <label for="relativeJob-${relativeCount}">Job</label>
        <input type="text" class="form-control" id="relativeJob-${relativeCount}" name="relJob[]" required>
      </div>
      <div class="form-group">
        <label for="relativeIncome-${relativeCount}">Monthly Income</label>
        <input type="number" class="form-control" id="relativeIncome-${relativeCount}" name="relIncome[]" required>
      </div>
    </div>`;
  container.insertAdjacentHTML('beforeend', entryHtml);
}

function removeRelativeEntry(id) {
  const target = document.getElementById(`relative-entry-${id}`);
  if (target) target.remove();
}

function toggleRequestDetails() {
    const requestType = document.getElementById('request').value;
    const detailsDiv = document.getElementById('requestDetails');
    if (['Others', 'Medicine', 'Laboratory/Diagnostic Procedures', 'Transplant'].includes(requestType)) {
        detailsDiv.style.display = 'block';
    } else {
        detailsDiv.style.display = 'none';
    }
}