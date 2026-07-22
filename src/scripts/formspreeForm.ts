// Shared submit behaviour for the Download and Contact forms (both post to the same
// Formspree endpoint and share the identical checkbox-gate / success-swap / error-banner
// pattern in the handoff). Extracted once a second page actually needed the same logic —
// not built speculatively ahead of that.
//
// Expected markup, all attribute-selected (no IDs) so this works unmodified on any page:
//
// <div data-form-root>
//   <div data-form-content>
//     <form data-formspree-form action="https://formspree.io/f/..." method="POST">
//       <div data-form-error hidden>...</div>
//       ...fields...
//       <input type="checkbox" />               (unnamed privacy-agreement checkbox)
//       <button data-submit-button disabled>...</button>
//     </form>
//   </div>
//   <div data-form-success hidden>...</div>
// </div>
export function initFormspreeForm(root: ParentNode = document): void {
  const formRoot = root.querySelector<HTMLElement>('[data-form-root]');
  const form = formRoot?.querySelector<HTMLFormElement>('[data-formspree-form]');
  if (!formRoot || !form) return;

  const content = formRoot.querySelector<HTMLElement>('[data-form-content]');
  const success = formRoot.querySelector<HTMLElement>('[data-form-success]');
  const checkbox = form.querySelector<HTMLInputElement>('input[type="checkbox"]');
  const submitButton = form.querySelector<HTMLButtonElement>('[data-submit-button]');
  const errorBanner = form.querySelector<HTMLElement>('[data-form-error]');
  const subjectField = form.querySelector<HTMLInputElement>('input[name="_subject"]');
  const nameField = form.querySelector<HTMLInputElement>('input[name="name"]');
  const companyField = form.querySelector<HTMLInputElement>('input[name="company"]');
  // Captured once before any submission appends the sender's name, so retries
  // (e.g. after a failed attempt) don't keep stacking it onto itself.
  const baseSubject = subjectField?.value ?? '';

  checkbox?.addEventListener('change', () => {
    if (submitButton) submitButton.disabled = !checkbox.checked;
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitButton?.disabled) return;

    errorBanner?.setAttribute('hidden', '');

    if (subjectField) {
      const name = nameField?.value.trim();
      const company = companyField?.value.trim();
      const sender = name ? (company ? `${company} ${name}様` : `${name}様`) : '';
      subjectField.value = sender ? `${baseSubject}：${sender}より` : baseSubject;
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        content?.setAttribute('hidden', '');
        success?.removeAttribute('hidden');
      } else {
        errorBanner?.removeAttribute('hidden');
      }
    } catch {
      errorBanner?.removeAttribute('hidden');
    }
  });
}
