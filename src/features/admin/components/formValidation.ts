/**
 * Client-side form validation, shared by every admin form.
 *
 * Built on the browser's Constraint Validation API (required, type=email, min/
 * max, minlength, pattern…) but with our OWN message copy and INLINE display,
 * instead of the native per-browser bubble. Forms opt in by rendering with
 * `noValidate` so the browser stays quiet and this drives the experience.
 *
 * It is deliberately DOM-imperative rather than React state: it runs entirely
 * on the submit/input events, before any server round-trip, and never triggers
 * a React re-render of the form — so the little error spans it creates are not
 * fighting reconciliation. They are tagged data-generated so they can be found
 * and cleared again cleanly.
 */

type Validatable = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function isValidatable(el: Element): el is Validatable {
  return 'validity' in el && (el as Validatable).willValidate === true;
}

/** Friendlier than the browser defaults, and consistent across browsers. */
function messageFor(field: Validatable): string {
  const v = field.validity;
  if (v.valueMissing) return 'This field is required.';
  if (v.typeMismatch && (field as HTMLInputElement).type === 'email') return 'Enter a valid email address.';
  if (v.typeMismatch && (field as HTMLInputElement).type === 'url') return 'Enter a valid URL.';
  if (v.rangeUnderflow) return `Must be ${(field as HTMLInputElement).min} or more.`;
  if (v.rangeOverflow) return `Must be ${(field as HTMLInputElement).max} or less.`;
  if (v.tooShort) return `Must be at least ${(field as HTMLInputElement).minLength} characters.`;
  if (v.tooLong) return `Must be at most ${(field as HTMLInputElement).maxLength} characters.`;
  if (v.stepMismatch) return 'Enter a valid value.';
  if (v.patternMismatch) return field.title || 'Please match the requested format.';
  return field.validationMessage || 'Please correct this field.';
}

/** Where the message goes: inside the field's `.adm-field` wrapper if it has
 *  one (so it lines up under the label+input), otherwise right after the field. */
function slotFor(field: Validatable): Element {
  return field.closest('.adm-field') ?? field.parentElement ?? field;
}

export function clearErrors(form: HTMLFormElement): void {
  form.querySelectorAll('.adm-field-error[data-generated]').forEach(n => n.remove());
  form.querySelectorAll('[aria-invalid="true"]').forEach(n => n.removeAttribute('aria-invalid'));
}

/**
 * Validate every field. Marks the invalid ones, writes an inline message under
 * each, focuses the first, and returns false. Returns true when all pass.
 */
export function runInlineValidation(form: HTMLFormElement): boolean {
  clearErrors(form);
  let firstInvalid: Validatable | null = null;

  for (const el of Array.from(form.elements)) {
    if (!isValidatable(el)) continue;
    if (el.checkValidity()) continue;

    el.setAttribute('aria-invalid', 'true');
    const msg = document.createElement('span');
    msg.className = 'adm-field-error';
    msg.setAttribute('data-generated', '');
    msg.textContent = messageFor(el);
    slotFor(el).appendChild(msg);
    if (!firstInvalid) firstInvalid = el;
  }

  if (firstInvalid) {
    firstInvalid.focus({ preventScroll: true });
    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }
  return true;
}

/**
 * Once a field has been flagged, clear its error the moment it becomes valid
 * again — so the form heals as the user types rather than only on the next
 * submit. Returns a cleanup function for useEffect.
 */
export function attachLiveValidation(form: HTMLFormElement): () => void {
  const onInput = (e: Event) => {
    const field = e.target as Element | null;
    if (!field || !isValidatable(field)) return;
    if (field.getAttribute('aria-invalid') !== 'true') return;
    if (field.checkValidity()) {
      field.removeAttribute('aria-invalid');
      slotFor(field).querySelector('.adm-field-error[data-generated]')?.remove();
    }
  };
  form.addEventListener('input', onInput);
  return () => form.removeEventListener('input', onInput);
}
