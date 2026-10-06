import './ds.css'

document.querySelectorAll('.ds-copy-btn[data-copy]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const text = document.getElementById(btn.dataset.copy)?.textContent ?? ''
    navigator.clipboard.writeText(text.trim()).then(
      () => { btn.textContent = 'Copied!'; setTimeout(() => { btn.textContent = 'Copy' }, 2000) },
      () => { btn.textContent = 'Failed'; setTimeout(() => { btn.textContent = 'Copy' }, 2000) },
    )
  })
})
