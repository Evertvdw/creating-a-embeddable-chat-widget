<template>
  <span className="is-typing">
    <span className="is-typing-dot"></span>
    <span className="is-typing-dot"></span>
    <span className="is-typing-dot"></span>
  </span>
</template>

<style lang="scss">
.is-typing {
  position: relative;
  display: inline-block;

  &-dot {
    float: left;
    width: 0.5em;
    height: 0.5em;
    margin: 0 0.2em;
    background: $primary;
    border-radius: 50%;
    opacity: 0;
    animation: loadingFade 1s infinite;

    &:nth-child(1) {
      animation-delay: 0s;
    }
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes loadingFade {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0;
  }
}
</style>
