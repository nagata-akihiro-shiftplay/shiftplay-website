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

  checkbox?.addEventListener('change', () => {
    if (submitButton) submitButton.disabled = !checkbox.checked;
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitButton?.disabled) return;

    errorBanner?.setAttribute('hidden', '');
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
