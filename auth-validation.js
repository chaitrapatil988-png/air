(() => {
  const emailPattern = /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;
  const namePattern = /^\p{L}+(?:\s+\p{L}+)*$/u;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  function messageFor(input, form) {
    const value = input.type === 'checkbox' || input.type === 'radio' ? input.checked : input.value.trim();
    const kind = input.dataset.validate || input.type;
    const label = form.querySelector(`label[for="${input.id}"]`)?.textContent.trim() || input.name;

    if (input.type === 'radio') {
      const group = [...form.querySelectorAll(`input[type="radio"][name="${input.name}"]`)];
      return group.some(option => option.checked) ? '' : `Please select your ${input.name}.`;
    }
    if (input.type === 'checkbox' && input.required && !input.checked) return 'Please choose whether to remember this device.';
    if (input.required && !value) {
      if (kind === 'name') return 'Please enter your name.';
      if (kind === 'email') return 'Please enter your email address.';
      if (kind === 'password') return 'Please enter your password.';
      if (kind === 'confirm-password') return 'Please confirm your password.';
      return `Please complete ${label.toLowerCase()}.`;
    }
    if (!value) return '';
    if (kind === 'name' && !namePattern.test(input.value.trim())) return 'Name can contain letters and spaces only.';
    if (kind === 'email' && !emailPattern.test(input.value.trim())) return 'Please enter a valid email address.';
    if (kind === 'password' && !passwordPattern.test(input.value)) return 'Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.';
    if (kind === 'confirm-password' && input.value !== form.querySelector('[data-validate="password"]')?.value) return 'Passwords do not match.';
    return '';
  }

  function showError(input, message) {
    let error = input.closest('.field, fieldset, .remember-row')?.querySelector(':scope > .field-error');
    if (!error) {
      error = document.createElement('span');
      error.className = 'field-error';
      error.setAttribute('aria-live', 'polite');
      const container = input.closest('.field, fieldset, .remember-row') || input.parentElement;
      container.append(error);
    }
    error.textContent = message;
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (message) input.setAttribute('aria-describedby', error.id || (error.id = `error-${input.id || input.name}`));
    else input.removeAttribute('aria-describedby');
  }

  document.querySelectorAll('form[data-auth-validation]').forEach(form => {
    const fields = [...form.querySelectorAll('input[required]')];
    form.addEventListener('submit', event => {
      let invalid = false;
      fields.forEach(input => {
        const message = messageFor(input, form);
        showError(input, message);
        if (message) invalid = true;
      });
      if (invalid) {
        form.dataset.validationAttempted = 'true';
        event.preventDefault();
        event.stopImmediatePropagation();
        form.querySelector('[aria-invalid="true"]')?.focus();
      }
    }, true);

    form.addEventListener('input', event => {
      const input = event.target;
      if (!fields.includes(input)) return;
      if (form.dataset.validationAttempted === 'true') showError(input, messageFor(input, form));
      if (input.dataset.validate === 'password') {
        const confirmation = form.querySelector('[data-validate="confirm-password"]');
        if (confirmation && form.dataset.validationAttempted === 'true') showError(confirmation, messageFor(confirmation, form));
      }
    });
    form.addEventListener('change', event => {
      const input = event.target;
      if (fields.includes(input) && form.dataset.validationAttempted === 'true') showError(input, messageFor(input, form));
    });
  });
})();
