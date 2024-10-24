document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("mainForm");
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const password = document.getElementById("password");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (checkInputs()) {
      const formData = {
        name: name.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        password: password.value.trim(),
      };

      fetch("/sign_up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Регистрация прошла успешно") {
            showModal();
          } else {
            Swal.fire({
              icon: "error",
              title: "Ошибка!",
              text: data.error,
              confirmButtonText: "OK",
            });
          }
        })
        .catch((error) => {
          console.error("Ошибка при отправке данных:", error);
          Swal.fire({
            icon: "error",
            title: "Ошибка!",
            text: "Что-то пошло не так при отправке данных",
            confirmButtonText: "OK",
          });
        });
    }
  });

  name.addEventListener("input", () => {
    validateField(name, name.value.trim() !== "", "Имя не может быть пустым");
  });

  email.addEventListener("input", () => {
    validateField(email, isEmail(email.value.trim()), "Некорректное значение");
  });

  phone.addEventListener("input", () => {
    validateField(phone, isPhone(phone.value.trim()), "Некорректное значение");
  });

  password.addEventListener("input", () => {
    validateField(
      password,
      password.value.trim().length >= 8,
      "Пароль должен быть не менее 8 символов"
    );
  });

  function checkInputs() {
    let isValid = true;
    validateField(name, name.value.trim() !== "", "Имя не может быть пустым");
    validateField(email, isEmail(email.value.trim()), "Некорректное значение");
    validateField(phone, isPhone(phone.value.trim()), "Некорректное значение");
    validateField(
      password,
      password.value.trim().length >= 8,
      "Пароль должен быть не менее 8 символов"
    );

    document.querySelectorAll(".form-control").forEach((control) => {
      if (control.classList.contains("error")) {
        isValid = false;
      }
    });

    return isValid;
  }

  function validateField(input, condition, errorMessage) {
    if (condition) {
      setSuccess(input);
    } else {
      setError(input, errorMessage);
    }
  }

  function setError(input, message) {
    const formControl = input.parentElement;
    const icon = formControl.querySelector(".icon");
    formControl.className = "form-control error";
    icon.className = "icon fas fa-times-circle";
    input.placeholder = message;
  }

  function setSuccess(input) {
    const formControl = input.parentElement;
    const icon = formControl.querySelector(".icon");
    formControl.className = "form-control success";
    icon.className = "icon fas fa-check-circle";
  }
  function isEmail(email) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
  }

  function isPhone(phone) {
    return /^\+?(\d.*){3,}$/.test(phone);
  }

  function showModal() {
    Swal.fire({
      icon: "success",
      title: "Успешно!",
      text: "Регистрация прошла успешно",
      confirmButtonText: "OK",
      confirmButtonColor: "#77b7cd",
    });
  }
});
