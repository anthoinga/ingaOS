let mobile = $state(window.matchMedia('(max-width: 639px)').matches)

const mq = window.matchMedia('(max-width: 639px)')
mq.addEventListener('change', (e) => {
  mobile = e.matches
})

export function isMobile() {
  return mobile
}
